'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

loadEnv(path.join(__dirname, '.env'));

const PORT = Number(process.env.PORT || 3000);
const APP_URL = (process.env.APP_URL || `http://localhost:${PORT}`).trim();
const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_PUBLISHABLE_KEY = (process.env.SUPABASE_PUBLISHABLE_KEY || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const TELEGRAM_BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const TELEGRAM_SYNC_SECRET = (process.env.TELEGRAM_SYNC_SECRET || '').trim();
const CRON_SECRET = (process.env.CRON_SECRET || '').trim();
const TELEGRAM_SYNC_INTERVAL_MS = Number(process.env.TELEGRAM_SYNC_INTERVAL_MS || 5000);
const STATIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname.startsWith('/static/')) {
    return serveStaticFile(url.pathname.replace('/static/', ''), res);
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, {
      ok: true,
      supabaseConfigured: Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
      telegramSyncConfigured: Boolean(SUPABASE_SERVICE_ROLE_KEY && TELEGRAM_BOT_TOKEN),
      telegramSyncSecretConfigured: Boolean(getTelegramSyncSecret())
    });
  }

  if ((req.method === 'GET' || req.method === 'POST') && url.pathname === '/api/sync-telegram') {
    if (!isAuthorizedSyncRequest(req, url)) {
      return sendJson(res, 401, {
        ok: false,
        error: 'Unauthorized'
      });
    }

    try {
      await syncTelegramIntegrations();
      return sendJson(res, 200, {
        ok: true
      });
    } catch (error) {
      return sendJson(res, 500, {
        ok: false,
        error: error.message
      });
    }
  }

  if (req.method === 'GET' && url.pathname === '/') {
    return sendHtml(res, renderDocument({
      title: 'Tipalets',
      mode: 'home'
    }));
  }

  if (req.method === 'GET' && url.pathname === '/login') {
    return sendHtml(res, renderDocument({
      title: 'Login',
      mode: 'login'
    }));
  }

  if (req.method === 'GET' && url.pathname === '/register') {
    return sendHtml(res, renderDocument({
      title: 'Register',
      mode: 'register'
    }));
  }

  if (req.method === 'GET' && (url.pathname === '/dashboard' || url.pathname === '/client')) {
    return sendHtml(res, renderDocument({
      title: 'Client Dashboard',
      mode: 'dashboard'
    }));
  }

  if (req.method === 'GET' && url.pathname === '/admin') {
    return sendHtml(res, renderDocument({
      title: 'Admin Dashboard',
      mode: 'admin'
    }));
  }

  const widgetMatch = url.pathname.match(/^\/alert\/([^/]+)\/([^/]+)$/);
  if (req.method === 'GET' && widgetMatch) {
    return sendHtml(res, renderDocument({
      title: 'OBS Alert Widget',
      mode: 'widget',
      routeData: {
        username: widgetMatch[1],
        settingId: widgetMatch[2]
      }
    }));
  }

  const goalWidgetMatch = url.pathname.match(/^\/goal\/([^/]+)$/);
  if (req.method === 'GET' && goalWidgetMatch) {
    return sendHtml(res, renderDocument({
      title: 'Donation Goal Widget',
      mode: 'goal-widget',
      routeData: {
        username: goalWidgetMatch[1]
      }
    }));
  }

  const donationWidgetMatch = url.pathname.match(/^\/donation-widget\/([^/]+)$/);
  if (req.method === 'GET' && donationWidgetMatch) {
    return sendHtml(res, renderDocument({
      title: 'Donation Widget',
      mode: 'donation-widget',
      routeData: {
        username: donationWidgetMatch[1]
      }
    }));
  }

  sendJson(res, 404, {
    ok: false,
    error: 'Not found'
  });
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Tipalets listening on ${APP_URL}`);
  });

  if (!process.env.VERCEL && SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && SUPABASE_SERVICE_ROLE_KEY && TELEGRAM_BOT_TOKEN) {
    startTelegramSyncWorker();
  } else if (!process.env.VERCEL) {
    console.warn('Telegram sync worker disabled. Configure SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY, and TELEGRAM_BOT_TOKEN to enable background ingestion.');
  }
}

function renderDocument({ title, mode, routeData = {} }) {
  const boot = JSON.stringify({
    mode,
    routeData,
    appUrl: APP_URL,
    supabaseUrl: SUPABASE_URL,
    supabasePublishableKey: SUPABASE_PUBLISHABLE_KEY,
    telegramSyncConfigured: Boolean(SUPABASE_SERVICE_ROLE_KEY && TELEGRAM_BOT_TOKEN)
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/static/styles.css" />
  </head>
  <body data-mode="${escapeHtml(mode)}">
    <div id="app"></div>
    <script>
      window.__APP_BOOT__ = ${boot};
    </script>
    <script type="module" src="/static/app.js"></script>
  </body>
</html>`;
}

function serveStaticFile(relativePath, res) {
  const safePath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(STATIC_DIR, safePath);

  if (!fullPath.startsWith(STATIC_DIR)) {
    return sendJson(res, 403, { ok: false, error: 'Forbidden' });
  }

  fs.readFile(fullPath, (error, data) => {
    if (error) {
      return sendJson(res, 404, { ok: false, error: 'Asset not found' });
    }

    const ext = path.extname(fullPath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Content-Length': data.length
    });
    res.end(data);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function sendHtml(res, html) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(html)
  });
  res.end(html);
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = stripWrappingQuotes(value);
    }
  }
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith('\'') && value.endsWith('\''))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function startTelegramSyncWorker() {
  let running = false;
  let schemaMissing = false;

  const tick = async () => {
    if (running) {
      return;
    }

    if (schemaMissing) {
      return;
    }

    running = true;
    try {
      await syncTelegramIntegrations();
    } catch (error) {
      if (isMissingSchemaError(error)) {
        schemaMissing = true;
        console.error('Telegram sync paused: Supabase tables are missing. Run supabase/schema.sql, then restart the server.');
      } else {
        console.error('Telegram sync failed:', error.message);
      }
    } finally {
      running = false;
    }
  };

  tick();
  setInterval(tick, TELEGRAM_SYNC_INTERVAL_MS > 0 ? TELEGRAM_SYNC_INTERVAL_MS : 5000);
}

async function syncTelegramIntegrations() {
  const integrations = await supabaseRest(
    `/rest/v1/client_integrations?select=id,user_id,telegram_chat_id,last_telegram_update_id,active_setting_id,sync_enabled&sync_enabled=eq.true`,
    { service: true }
  );

  if (!Array.isArray(integrations) || integrations.length === 0) {
    return;
  }

  for (const integration of integrations) {
    if (!integration.telegram_chat_id) {
      continue;
    }

    try {
      await processIntegration(integration);
    } catch (error) {
      console.error(`Integration ${integration.id} failed:`, error.message);
    }
  }
}

async function processIntegration(integration) {
  const offset = Number.isInteger(integration.last_telegram_update_id)
    ? integration.last_telegram_update_id + 1
    : undefined;

  const updates = await getTelegramUpdates(TELEGRAM_BOT_TOKEN, offset);
  if (!updates.length) {
    return;
  }

  let lastUpdateId = integration.last_telegram_update_id;
  let activeSettingId = integration.active_setting_id;

  if (!activeSettingId) {
    activeSettingId = await findDefaultSettingId(integration.user_id);
  }

  for (const update of updates) {
    if (Number.isInteger(update.update_id)) {
      lastUpdateId = update.update_id;
    }

    const message = extractTelegramMessage(update);
    if (!message || String(message.chat.id) !== String(integration.telegram_chat_id)) {
      continue;
    }

    const parsed = parseDonationMessage(message);
    if (!parsed || !activeSettingId) {
      continue;
    }

    const insertedEvents = await supabaseRest('/rest/v1/donation_events?on_conflict=source_message_id', {
      method: 'POST',
      service: true,
      prefer: 'resolution=ignore-duplicates,return=representation',
      body: {
        user_id: integration.user_id,
        alert_setting_id: activeSettingId,
        source_message_id: `${integration.id}:${update.update_id}`,
        donor_name: parsed.donorName,
        amount: parsed.amount,
        currency: parsed.currency,
        supporter_message: parsed.supporterMessage,
        raw_text: parsed.rawText,
        paid_at: parsed.paidAt
      }
    });

    if (Array.isArray(insertedEvents) && insertedEvents.length > 0) {
      await advanceActiveGoal(integration.user_id, parsed.amount, parsed.currency);
    }
  }

  if (Number.isInteger(lastUpdateId)) {
    await supabaseRest(`/rest/v1/client_integrations?id=eq.${encodeURIComponent(integration.id)}`, {
      method: 'PATCH',
      service: true,
      prefer: 'return=minimal',
      body: {
        last_telegram_update_id: lastUpdateId,
        updated_at: new Date().toISOString()
      }
    });
  }
}

async function findDefaultSettingId(userId) {
  const rows = await supabaseRest(
    `/rest/v1/alert_settings?select=id&user_id=eq.${encodeURIComponent(userId)}&is_default=eq.true&limit=1`,
    { service: true }
  );

  return Array.isArray(rows) && rows[0] ? rows[0].id : null;
}

async function advanceActiveGoal(userId, amount, currency) {
  const goals = await supabaseRest(
    `/rest/v1/donation_goals?select=*&user_id=eq.${encodeURIComponent(userId)}&status=eq.active&order=queue_order.asc&limit=1`,
    { service: true }
  );

  const activeGoal = Array.isArray(goals) && goals[0] ? goals[0] : null;
  if (!activeGoal) {
    return;
  }

  if (activeGoal.currency && currency && String(activeGoal.currency) !== String(currency) && String(activeGoal.currency_symbol || activeGoal.currency) !== String(currency)) {
    return;
  }

  const currentAmount = Number(activeGoal.current_amount || 0);
  const goalAmount = Number(activeGoal.goal_amount || 0);
  const nextAmount = currentAmount + Number(amount || 0);
  const completed = goalAmount > 0 && nextAmount >= goalAmount;
  const nextStatus = completed && activeGoal.goal_type !== 'daily' ? 'completed' : 'active';

  await supabaseRest(`/rest/v1/donation_goals?id=eq.${encodeURIComponent(activeGoal.id)}`, {
    method: 'PATCH',
    service: true,
    prefer: 'return=minimal',
    body: {
      current_amount: completed && activeGoal.goal_type !== 'daily' ? goalAmount : nextAmount,
      progress_display: `${formatMoney(completed && activeGoal.goal_type !== 'daily' ? goalAmount : nextAmount, activeGoal.currency || currency || 'USD')} / ${formatMoney(goalAmount, activeGoal.currency || currency || 'USD')}`,
      status: nextStatus,
      updated_at: new Date().toISOString()
    }
  });

  if (completed && activeGoal.goal_type !== 'daily') {
    const pendingGoals = await supabaseRest(
      `/rest/v1/donation_goals?select=id&user_id=eq.${encodeURIComponent(userId)}&status=eq.pending&order=queue_order.asc&limit=1`,
      { service: true }
    );

    const nextGoal = Array.isArray(pendingGoals) && pendingGoals[0] ? pendingGoals[0] : null;
    if (nextGoal) {
      await supabaseRest(`/rest/v1/donation_goals?id=eq.${encodeURIComponent(nextGoal.id)}`, {
        method: 'PATCH',
        service: true,
        prefer: 'return=minimal',
        body: {
          status: 'active',
          updated_at: new Date().toISOString()
        }
      });
    }
  }
}

function extractTelegramMessage(update) {
  return update.message || update.edited_message || update.channel_post || update.edited_channel_post || null;
}

async function getTelegramUpdates(botToken, offset) {
  const params = new URLSearchParams({
    timeout: '0',
    allowed_updates: JSON.stringify(['message', 'edited_message', 'channel_post', 'edited_channel_post'])
  });

  if (typeof offset === 'number') {
    params.set('offset', String(offset));
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?${params.toString()}`);
  const payload = await response.json();

  if (!payload.ok || !Array.isArray(payload.result)) {
    throw new Error('Unexpected Telegram API response');
  }

  return payload.result;
}

function parseDonationMessage(message) {
  if (message.successful_payment) {
    const currency = message.successful_payment.currency || 'USD';
    const amount = Number(message.successful_payment.total_amount || 0) / 100;

    return {
      donorName: buildSenderName(message.from) || 'Supporter',
      amount,
      currency,
      supporterMessage: extractSupporterMessage(getMessageText(message)),
      rawText: getMessageText(message),
      paidAt: message.date ? new Date(message.date * 1000).toISOString() : new Date().toISOString()
    };
  }

  const rawText = getMessageText(message);
  if (!rawText || !/(paid|payment|donat|invoice|supporter|success)/i.test(rawText)) {
    return null;
  }

  const abaPayment = parseAbaPaymentMessage(rawText, message);
  if (abaPayment) {
    return abaPayment;
  }

  const moneyMatch = rawText.match(/(?:\$|USD|EUR|GBP|KHR|THB|JPY|AUD|CAD)?\s?(\d+(?:[.,]\d{1,2})?)\s?(USD|EUR|GBP|KHR|THB|JPY|AUD|CAD|\$)?/i);
  const amount = moneyMatch ? Number(moneyMatch[1].replace(',', '.')) : 0;
  const currency = moneyMatch
    ? normalizeCurrency(moneyMatch[2] || rawText.slice(Math.max(0, moneyMatch.index - 3), moneyMatch.index + 1))
    : 'USD';

  if (!amount) {
    return null;
  }

  return {
    donorName: extractDonorName(rawText, message) || buildSenderName(message.from) || 'Supporter',
    amount,
    currency,
    supporterMessage: extractSupporterMessage(rawText),
    rawText,
    paidAt: message.date ? new Date(message.date * 1000).toISOString() : new Date().toISOString()
  };
}

function extractDonorName(text, message) {
  const patterns = [
    /(?:from|by|supporter)\s+([A-Za-z0-9 _.-]{2,40})/i,
    /name[:\s]+([A-Za-z0-9 _.-]{2,40})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return buildSenderName(message.from);
}

function parseAbaPaymentMessage(text, message) {
  const normalized = String(text || '').trim();
  const amountMatch = normalized.match(/^(\$|៛)\s*([\d,]+(?:\.\d{1,2})?)\s+paid\s+by\s+/i);
  if (!amountMatch) {
    return null;
  }

  const afterPrefix = normalized.slice(amountMatch[0].length);
  const onIndex = afterPrefix.search(/\s+on\s+/i);
  if (onIndex === -1) {
    return null;
  }

  const donorSection = afterPrefix.slice(0, onIndex).trim();
  const donorName = donorSection.replace(/\s+\(\*.*?\)\s*$/i, '').trim();
  const currencySymbol = amountMatch[1];
  const amount = Number(String(amountMatch[2]).replaceAll(',', ''));
  const remarkMatch = normalized.match(/Remark:\s*(.*?)(?:\s*Trx\.?\s*ID:|$)/i);
  const remark = (remarkMatch?.[1] || '').trim().replace(/\.+$/, '').trim();

  if (!amount || !donorName) {
    return null;
  }

  return {
    donorName,
    amount,
    currency: currencySymbol === '៛' ? 'KHR' : '$',
    supporterMessage: remark,
    rawText: normalized,
    paidAt: message.date ? new Date(message.date * 1000).toISOString() : new Date().toISOString()
  };
}

function extractSupporterMessage(text) {
  const match = text.match(/(?:message|note)[:\s]+(.+)/i);
  if (match) {
    return match[1].trim();
  }

  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines.slice(1).join(' ');
  }

  return '';
}

function buildSenderName(from) {
  if (!from) {
    return null;
  }

  const fullName = [from.first_name, from.last_name].filter(Boolean).join(' ').trim();
  return fullName || from.username || null;
}

function getMessageText(message) {
  if (typeof message.text === 'string' && message.text.trim()) {
    return message.text.trim();
  }

  if (typeof message.caption === 'string' && message.caption.trim()) {
    return message.caption.trim();
  }

  return '';
}

function normalizeCurrency(value) {
  const cleaned = String(value || 'USD').replace(/[^A-Za-z$]/g, '').toUpperCase();
  if (cleaned === '$') {
    return '$';
  }

  if (cleaned === '') {
    return 'USD';
  }

  return cleaned;
}

function formatMoney(value, currency) {
  const number = Number(value || 0);
  const code = currency === '$' ? 'USD' : currency;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code || 'USD'
    }).format(number);
  } catch (error) {
    return `${number.toFixed(2)} ${currency || 'USD'}`;
  }
}

async function supabaseRest(restPath, { method = 'GET', body, service = false, prefer } = {}) {
  const headers = {
    apikey: service ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${service ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_PUBLISHABLE_KEY}`
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (prefer) {
    headers.Prefer = prefer;
  }

  const response = await fetch(`${SUPABASE_URL}${restPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase request failed with ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function isMissingSchemaError(error) {
  if (!error || typeof error.message !== 'string') {
    return false;
  }

  return error.message.includes('PGRST205') || error.message.includes("Could not find the table 'public.client_integrations'");
}

function isAuthorizedSyncRequest(req, url) {
  const syncSecret = getTelegramSyncSecret();
  if (!syncSecret) {
    return false;
  }

  const authHeader = req.headers.authorization || '';
  if (authHeader === `Bearer ${syncSecret}`) {
    return true;
  }

  return url.searchParams.get('secret') === syncSecret;
}

function getTelegramSyncSecret() {
  return CRON_SECRET || TELEGRAM_SYNC_SECRET;
}

module.exports = {
  server,
  handleRequest,
  syncTelegramIntegrations,
  parseDonationMessage,
  extractTelegramMessage,
  getMessageText,
  normalizeCurrency
};

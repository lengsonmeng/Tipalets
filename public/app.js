import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const boot = window.__APP_BOOT__ || {};
const app = document.getElementById('app');
const supabase = boot.supabaseUrl && boot.supabasePublishableKey
  ? createClient(boot.supabaseUrl, boot.supabasePublishableKey)
  : null;

const DEFAULT_SETTING = {
  title: 'Default Setting',
  alert_type: 'Donation',
  enabled: true,
  layout: 'image-above-text',
  logo_url: '',
  sound_url: '',
  message_template: 'Thank you {name} for donated {amount}{currency}{newline}{message}',
  alert_duration: 10,
  text_delay: 3.5,
  sound_volume: 100,
  font_family: 'Poppins',
  font_size: 36,
  font_weight: '700',
  text_color: '#FFFFFF',
  text_highlight_color: '#32C3A6',
  background_color: '#000000',
  alert_animation: 'fade-pop',
  text_animation: 'type-rise',
  is_default: true
};

const FONT_OPTIONS = [
  'Poppins',
  'Bebas Neue',
  'Montserrat',
  'Oswald',
  'Merriweather',
  'Orbitron',
  'Nunito'
];

const ANIMATION_OPTIONS = [
  { value: 'fade-pop', label: 'Fade Pop' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'zoom-burst', label: 'Zoom Burst' }
];

const TEXT_ANIMATION_OPTIONS = [
  { value: 'type-rise', label: 'Type Rise' },
  { value: 'pulse-glow', label: 'Pulse Glow' },
  { value: 'fade-pop', label: 'Fade Pop' }
];

boot.mode && start();

async function start() {
  switch (boot.mode) {
    case 'home':
      renderHome();
      break;
    case 'login':
      await renderLogin();
      break;
    case 'register':
      await renderRegister();
      break;
    case 'dashboard':
      await renderDashboard();
      break;
    case 'admin':
      await renderAdmin();
      break;
    case 'widget':
      await renderWidget();
      break;
    case 'goal-widget':
      await renderGoalWidget();
      break;
    case 'donation-widget':
      await renderDonationWidgetPage();
      break;
    default:
      app.innerHTML = '<div class="shell"><div class="empty-state">Unknown page.</div></div>';
  }
}

function renderHome() {
  app.innerHTML = `
    <div class="home-page">
      <section class="hero">
        <div class="shell">
          <header class="home-header">
            <a class="brand" href="/">
              <span class="brand-mark">T</span>
              <span>Tipalets</span>
            </a>
            <div class="home-header-actions">
              <a class="button-ghost button-home-ghost" href="/login">Login</a>
              <a class="button button-home" href="/register">Create account</a>
            </div>
          </header>
        </div>
        <div class="shell hero-grid">
          <div class="glass hero-copy hero-copy-home">
            <div class="eyebrow hero-eyebrow-home">Cambodia Creator Alerts • Tipalets</div>
            <div class="hero-khmer">សម្រាប់អ្នកស្ទ្រីម និងអ្នកបង្កើតមាតិកា</div>
            <h1 class="display home-display">The donation alert platform for Cambodian creators.</h1>
            <p class="lede home-lede">Connect Telegram payment messages, style your OBS widget, and show every donation live with custom sound, logo, motion, and bilingual text.</p>
            <p class="hero-khmer-copy">ភ្ជាប់ Telegram payment message ជាមួយ OBS widget របស់អ្នក ដើម្បីបង្ហាញ donation alert ភ្លាមៗ ពេលអ្នកគាំទ្របង់ប្រាក់ចូល។ អាចកំណត់ logo, sound, color, font និង animation បានទាំងអស់។</p>
            <div class="cta-row" style="margin-top:24px">
              <a class="button button-home" href="/register">Get Started</a>
              <a class="button-ghost button-home-ghost" href="/login">Login</a>
              <a class="button-ghost button-home-ghost" href="/dashboard">Dashboard</a>
            </div>
            <div class="hero-strip">
              <span class="hero-chip hero-chip-home">OBS-ready</span>
              <span class="hero-chip hero-chip-home">ABA-style alerts</span>
              <span class="hero-chip hero-chip-home">Telegram Sync</span>
              <span class="hero-chip hero-chip-home">Khmer + English</span>
            </div>
            <div class="hero-stats" style="margin-top:28px">
              <div class="mini-stat mini-stat-home"><strong>Live stream alerts</strong><span>Display supporter payments instantly in your scene with a transparent browser source.</span></div>
              <div class="mini-stat mini-stat-home"><strong>Custom OBS design</strong><span>Fine-tune text, sound, background, logo, animation, and donation message layout.</span></div>
              <div class="mini-stat mini-stat-home"><strong>Creator analytics</strong><span>Track recent donation activity across day, week, and month from your dashboard.</span></div>
            </div>
          </div>
          <div class="glass hero-preview hero-preview-home">
            <div class="subtle-title">Live Donation Demo</div>
            <div class="hero-preview-stage hero-preview-stage-home">
              <div class="hero-preview-meta">
                <div>
                  <div class="hero-preview-label">Creator Scene</div>
                  <strong>Donation Alert Preview</strong>
                </div>
                <div class="badge">Live</div>
              </div>
              ${buildAlertMarkup({
                ...DEFAULT_SETTING,
                logo_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
                background_color: '#120C09',
                font_family: 'Bebas Neue',
                font_size: 42,
                text_highlight_color: '#FF8A3D'
              }, {
                donor_name: 'VANNAK',
                amount: 5,
                currency: '$',
                supporter_message: 'អរគុណសម្រាប់ការគាំទ្រ! Keep the stream going!'
              }, true)}
            </div>
            <div class="hero-feature-list hero-feature-list-home">
              <div class="hero-feature-item hero-feature-item-home">
                <strong>Built for Cambodian creators</strong>
                <span>Shape donation alerts around the payment message formats your audience already uses.</span>
              </div>
              <div class="hero-feature-item hero-feature-item-home">
                <strong>Ready for OBS and livestream overlays</strong>
                <span>Copy one widget URL, add it as a browser source, and let the alert system handle the rest.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="home-section">
        <div class="shell">
          <div class="home-section-head">
            <div>
              <div class="subtle-title">Why Choose Ahnajak Alets?</div>
              <h2 class="home-section-title">Everything creators need for better donation alerts.</h2>
              <p class="section-copy">A clean system for receiving payments, displaying alerts, and understanding your stream revenue.</p>
            </div>
            <div class="hero-khmer-copy home-section-khmer">ហេតុអ្វីគួរជ្រើសរើស Ahnajak Alets? ព្រោះវាធ្វើឲ្យ donation alert របស់អ្នកងាយប្រើ ស្អាត និងអាចកែតម្រូវបានតាមរបៀបស្ទ្រីមរបស់អ្នក។</div>
          </div>
          <div class="why-grid">
            <div class="why-card">
              <h3>Easy Donations</h3>
              <p>Seamless and secure donation process for fans.</p>
            </div>
            <div class="why-card">
              <h3>Customizable Alerts</h3>
              <p>Create unique alerts for donations and subscriptions.</p>
            </div>
            <div class="why-card">
              <h3>ABA Payway Integration</h3>
              <p>Integrate existing ABA Payway with our Telegram Bot and secure your account connection.</p>
            </div>
            <div class="why-card">
              <h3>Analytics</h3>
              <p>Get detailed earnings insights including daily, weekly, and monthly reports.</p>
            </div>
            <div class="why-card">
              <h3>Donation Goals</h3>
              <p>Create stream goals, run stretch targets in sequence, and show a live progress widget on stream.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function renderLogin() {
  if (!supabase) {
    return renderMissingSupabase();
  }

  const session = await getSession();
  if (session) {
    location.href = '/dashboard';
    return;
  }

  app.innerHTML = `
    <div class="auth-wrap">
      <div class="card auth-card">
        <div class="eyebrow">Welcome back</div>
        <h1 class="section-title" style="font-size:36px;margin-top:18px">Login to Tipalets</h1>
        <p class="lede" style="font-size:16px">Access your donation analytics, Telegram integration, and OBS widget settings.</p>
        <form id="login-form" class="form-grid" style="margin-top:22px">
          <div class="field">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button class="button" type="submit">Login</button>
        </form>
        <div id="auth-message"></div>
        <p class="note" style="margin-top:18px">No account yet? <a href="/register" style="color:var(--accent)">Register here</a>.</p>
      </div>
    </div>
  `;

  const form = document.getElementById('login-form');
  const message = document.getElementById('auth-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(message, 'Signing in...');
    const formData = new FormData(form);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || '')
    });

    if (error) {
      setMessage(message, error.message, true);
      return;
    }

    location.href = '/dashboard';
  });
}

async function renderRegister() {
  if (!supabase) {
    return renderMissingSupabase();
  }

  const session = await getSession();
  if (session) {
    location.href = '/dashboard';
    return;
  }

  app.innerHTML = `
    <div class="auth-wrap">
      <div class="card auth-card">
        <div class="eyebrow">Create account</div>
        <h1 class="section-title" style="font-size:36px;margin-top:18px">Build your alert system</h1>
        <p class="lede" style="font-size:16px">Set up auth, Telegram sync, custom alert media, and your OBS widget URL.</p>
        <form id="register-form" class="form-grid" style="margin-top:22px">
          <div class="field">
            <label>Username</label>
            <input type="text" name="username" required maxlength="32" pattern="[a-zA-Z0-9_\\-]+" />
          </div>
          <div class="field">
            <label>Display name</label>
            <input type="text" name="display_name" required maxlength="64" />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" name="password" required minlength="6" />
          </div>
          <button class="button" type="submit">Register</button>
        </form>
        <div id="auth-message"></div>
        <p class="note" style="margin-top:18px">Already registered? <a href="/login" style="color:var(--accent)">Login here</a>.</p>
      </div>
    </div>
  `;

  const form = document.getElementById('register-form');
  const message = document.getElementById('auth-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(message, 'Creating account...');
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim().toLowerCase();
    const displayName = String(formData.get('display_name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName
        }
      }
    });

    if (error) {
      setMessage(message, error.message, true);
      return;
    }

    if (data.user) {
      await ensureProfile(data.user, { username, display_name: displayName });
    }

    setMessage(message, 'Account created. If email confirmation is enabled in Supabase, confirm your email first and then login.');
  });
}

async function renderDashboard() {
  if (!supabase) {
    return renderMissingSupabase();
  }

  const session = await requireSession('/login');
  if (!session) {
    return;
  }

  const user = session.user;
  const profile = await ensureProfile(user);
  const { integration, settings, events, goals, donationWidget } = await loadDashboardData(user.id);
  const activeSetting = settings[0] || null;
  const state = {
    user,
    profile,
    integration,
    settings,
    selectedSettingId: activeSetting ? activeSetting.id : null,
    events,
    goals,
    donationWidget,
    currentView: 'analytics',
    analyticsRange: 'day'
  };

  renderDashboardShell(state);
}

async function renderAdmin() {
  if (!supabase) {
    return renderMissingSupabase();
  }

  const session = await requireSession('/login');
  if (!session) {
    return;
  }

  const profile = await ensureProfile(session.user);
  if (profile.role !== 'admin') {
    app.innerHTML = `<div class="shell"><div class="empty-state">This page is reserved for admin accounts.</div></div>`;
    return;
  }

  const [profilesResult, integrationsResult, eventsResult] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('client_integrations').select('*').order('updated_at', { ascending: false }).limit(50),
    supabase.from('donation_events').select('*').order('created_at', { ascending: false }).limit(50)
  ]);

  const profiles = profilesResult.data || [];
  const integrations = integrationsResult.data || [];
  const events = eventsResult.data || [];

  app.innerHTML = `
    <div class="shell">
      ${buildNav(profile, true)}
      <div class="admin-grid stats-grid">
        <div class="card admin-card metric"><strong>${profiles.length}</strong><span>Recent registered users</span></div>
        <div class="card admin-card metric"><strong>${integrations.length}</strong><span>Client integrations</span></div>
        <div class="card admin-card metric"><strong>${events.length}</strong><span>Recent donation events</span></div>
      </div>
      <div class="admin-grid" style="margin-top:20px">
        <div class="card admin-card">
          <div class="split">
            <div>
              <div class="subtle-title">System Status</div>
              <h2 class="section-title">Telegram worker</h2>
            </div>
            <div class="badge">${boot.telegramSyncConfigured ? 'Configured' : 'Missing service role key'}</div>
          </div>
          <p class="note">The server-side Telegram sync worker needs <code>SUPABASE_SERVICE_ROLE_KEY</code> to read all client integrations and write donation events.</p>
        </div>
        <div class="card admin-card">
          <div class="subtle-title">Latest users</div>
          ${renderTable(profiles.map((item) => [
            item.username || 'unknown',
            item.display_name || '',
            item.role || 'client',
            formatDate(item.created_at)
          ]), ['Username', 'Display name', 'Role', 'Joined'])}
        </div>
        <div class="card admin-card">
          <div class="subtle-title">Latest donation events</div>
          ${renderTable(events.map((item) => [
            item.donor_name || 'Supporter',
            formatCurrency(item.amount, item.currency),
            item.supporter_message || '',
            formatDate(item.created_at)
          ]), ['Supporter', 'Amount', 'Message', 'Created'])}
        </div>
      </div>
    </div>
  `;

  bindNavActions();
}

async function renderWidget() {
  if (!supabase) {
    app.innerHTML = '<div class="empty-state">Supabase is not configured.</div>';
    return;
  }

  const { username, settingId } = boot.routeData || {};
  app.innerHTML = `
    <div class="widget-stage">
      <div class="alert-shell" id="widget-alert"></div>
      <audio id="widget-audio" preload="auto"></audio>
    </div>
  `;

  const container = document.getElementById('widget-alert');
  const audio = document.getElementById('widget-audio');
  const queue = [];
  let setting = null;
  let showing = false;
  let lastSeenEventId = null;
  let hydrated = false;

  async function loadSetting() {
    const { data, error } = await supabase
      .from('alert_settings')
      .select('*')
      .eq('id', settingId)
      .eq('enabled', true)
      .single();

    if (error || !data) {
      container.innerHTML = '';
      container.classList.remove('visible');
      return;
    }

    setting = data;
    document.title = `${username || 'alert'} widget`;
  }

  async function pollEvents() {
    if (!setting) {
      return;
    }

    const { data } = await supabase
      .from('donation_events')
      .select('*')
      .eq('alert_setting_id', setting.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const events = (data || []).slice().reverse();
    if (!hydrated) {
      hydrated = true;
      if (events.length) {
        lastSeenEventId = events[events.length - 1].id;
      }
      return;
    }

    for (const event of events) {
      if (!lastSeenEventId || isNewerEvent(event.id, lastSeenEventId, events)) {
        queue.push(event);
      }
    }

    if (events.length) {
      lastSeenEventId = events[events.length - 1].id;
    }

    if (!showing) {
      playNext();
    }
  }

  function playNext() {
    if (!queue.length || !setting) {
      showing = false;
      container.classList.remove('visible');
      container.innerHTML = '';
      return;
    }

    showing = true;
    const event = queue.shift();
    container.innerHTML = buildAlertMarkup(setting, event, false);
    container.className = 'alert-shell visible';
    applyAlertStyle(container, setting);

    if (setting.sound_url) {
      audio.src = setting.sound_url;
      audio.volume = clamp(Number(setting.sound_volume || 100) / 100, 0, 1);
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    const duration = Math.max(2, Number(setting.alert_duration || 10)) * 1000;
    setTimeout(() => {
      container.classList.remove('visible');
      setTimeout(playNext, 250);
    }, duration);
  }

  await loadSetting();
  await pollEvents();
  setInterval(async () => {
    if (!setting) {
      await loadSetting();
    }
    await pollEvents();
  }, 2000);
}

async function renderGoalWidget() {
  if (!supabase) {
    app.innerHTML = '<div class="empty-state">Supabase is not configured.</div>';
    return;
  }

  const { username } = boot.routeData || {};
  app.innerHTML = `
    <div class="widget-stage">
      <div id="goal-widget-root"></div>
    </div>
  `;

  const root = document.getElementById('goal-widget-root');

  async function loadGoal() {
    const profileResult = await supabase.from('profiles').select('id,username').eq('username', username).maybeSingle();
    const profile = profileResult.data;
    if (!profile) {
      root.innerHTML = '';
      return;
    }

    const goalResult = await supabase
      .from('donation_goals')
      .select('*')
      .eq('user_id', profile.id)
      .eq('status', 'active')
      .order('queue_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!goalResult.data) {
      root.innerHTML = '';
      return;
    }

    root.innerHTML = buildGoalWidgetMarkup(goalResult.data, 0);
  }

  await loadGoal();
  setInterval(loadGoal, 3000);
}

async function renderDonationWidgetPage() {
  if (!supabase) {
    app.innerHTML = '<div class="empty-state">Supabase is not configured.</div>';
    return;
  }

  const { username } = boot.routeData || {};
  app.innerHTML = `<div class="widget-stage"><div id="donation-widget-root"></div></div>`;
  const root = document.getElementById('donation-widget-root');

  async function loadWidget() {
    const profileResult = await supabase.from('profiles').select('id,username').eq('username', username).maybeSingle();
    const profile = profileResult.data;
    if (!profile) {
      root.innerHTML = '';
      return;
    }

    const [settingsResult, eventsResult] = await Promise.all([
      supabase.from('donation_widget_settings').select('*').eq('user_id', profile.id).maybeSingle(),
      supabase.from('donation_events').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(6)
    ]);

    if (!settingsResult.data) {
      root.innerHTML = '';
      return;
    }

    root.innerHTML = buildDonationWidgetMarkup(settingsResult.data, eventsResult.data || []);
  }

  await loadWidget();
  setInterval(loadWidget, 3000);
}

async function loadDashboardData(userId) {
  const [integrationResult, settingsResult, eventsResult, goalsResult, donationWidgetResult] = await Promise.all([
    supabase.from('client_integrations').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('alert_settings').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
    supabase.from('donation_events').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
    supabase.from('donation_goals').select('*').eq('user_id', userId).order('queue_order', { ascending: true }).order('created_at', { ascending: true }),
    supabase.from('donation_widget_settings').select('*').eq('user_id', userId).maybeSingle()
  ]);

  let settings = settingsResult.data || [];
  if (!settings.length) {
    const created = await supabase.from('alert_settings').insert({
      ...DEFAULT_SETTING,
      user_id: userId
    }).select().single();
    if (created.data) {
      settings = [created.data];
    }
  }

  let donationWidget = donationWidgetResult.data || null;
  if (!donationWidget) {
    const createdWidget = await supabase.from('donation_widget_settings').insert({
      user_id: userId
    }).select().single();
    if (createdWidget.data) {
      donationWidget = createdWidget.data;
    }
  }

  return {
    integration: integrationResult.data || null,
    settings,
    events: eventsResult.data || [],
    goals: goalsResult.data || [],
    donationWidget
  };
}

function renderDashboardShell(state) {
  const selected = state.settings.find((item) => item.id === state.selectedSettingId) || state.settings[0];
  const widgetUrl = selected ? `${boot.appUrl}/alert/${state.profile.username}/${selected.id}` : '';
  const filteredEvents = filterEventsByRange(state.events, state.analyticsRange);
  const totals = summarizeEvents(filteredEvents);

  app.innerHTML = `
    <div class="shell">
      ${buildNav(state.profile, false)}
      <div class="dashboard-main dashboard-main-full">
        <div class="card dashboard-card">
          <div class="split">
            <div>
              <div class="subtle-title">Client Dashboard</div>
              <h2 class="section-title">Workspace</h2>
              <p class="section-copy">Welcome, ${escapeHtml(state.profile.display_name || state.profile.username)}. Build alerts, connect Telegram, and monitor donations from one clean workspace.</p>
            </div>
            <div class="inline-actions">
              <span class="pill">@${escapeHtml(state.profile.username || 'missing')}</span>
              <span class="pill">${boot.telegramSyncConfigured ? 'Telegram sync ready' : 'Server sync disabled'}</span>
              <button class="button-ghost" id="refresh-dashboard">Refresh</button>
              <button class="button-danger" id="logout-button">Logout</button>
            </div>
          </div>
          <div class="view-tabs" style="margin-top:16px">
            <button class="tab-button ${state.currentView === 'analytics' ? 'active' : ''}" data-view="analytics">Donate Anl</button>
            <button class="tab-button ${state.currentView === 'donation-widget' ? 'active' : ''}" data-view="donation-widget">Donation Widget</button>
            <button class="tab-button ${state.currentView === 'goals' ? 'active' : ''}" data-view="goals">Donation Goals</button>
            <button class="tab-button ${state.currentView === 'telegram' ? 'active' : ''}" data-view="telegram">Telegram Integration</button>
            <button class="tab-button ${state.currentView === 'settings' ? 'active' : ''}" data-view="settings">Alert Setting</button>
          </div>
        </div>
        ${state.currentView === 'analytics'
          ? renderAnalyticsView(state, filteredEvents, totals)
          : state.currentView === 'donation-widget'
            ? renderDonationWidgetView(state)
          : state.currentView === 'goals'
            ? renderDonationGoalsView(state)
          : state.currentView === 'telegram'
            ? renderTelegramIntegrationView(state)
            : renderAlertSettingsView(state, selected, widgetUrl)}
      </div>
    </div>
  `;

  bindNavActions();
  bindDashboardActions(state);
}

function bindDashboardActions(state) {
  document.getElementById('refresh-dashboard')?.addEventListener('click', () => location.reload());
  document.getElementById('logout-button')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    location.href = '/login';
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      state.currentView = button.dataset.view;
      renderDashboardShell(state);
    });
  });

  document.querySelectorAll('[data-range]').forEach((button) => {
    button.addEventListener('click', () => {
      state.analyticsRange = button.dataset.range;
      renderDashboardShell(state);
    });
  });

  document.querySelectorAll('[data-setting-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedSettingId = button.dataset.settingId;
      renderDashboardShell(state);
    });
  });

  document.getElementById('setting-switcher')?.addEventListener('change', (event) => {
    state.selectedSettingId = event.target.value;
    renderDashboardShell(state);
  });

  document.getElementById('create-setting')?.addEventListener('click', async () => {
    const title = prompt('New alert setting name', 'New Alert Setting');
    if (!title) {
      return;
    }

    const { data, error } = await supabase.from('alert_settings').insert({
      ...DEFAULT_SETTING,
      title: title.trim(),
      is_default: false,
      user_id: state.user.id
    }).select().single();

    if (error) {
      setMessage(document.getElementById('setting-message'), error.message, true);
      return;
    }

    state.settings.unshift(data);
    state.selectedSettingId = data.id;
    renderDashboardShell(state);
  });

  document.getElementById('create-goal-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = document.getElementById('goal-message');
    setMessage(target, 'Creating donation goal...');
    const formData = new FormData(event.currentTarget);
    const queueOrder = state.goals.length + 1;
    const payload = {
      user_id: state.user.id,
      title: String(formData.get('title') || '').trim(),
      style: String(formData.get('style') || 'original-gamepad'),
      color_theme: String(formData.get('color_theme') || 'light'),
      currency: String(formData.get('currency') || 'USD'),
      currency_symbol: currencySymbolFor(String(formData.get('currency') || 'USD')),
      goal_amount: Number(formData.get('goal_amount') || 1),
      current_amount: 0,
      progress_display: formatCurrency(0, String(formData.get('currency') || 'USD')) + ' / ' + formatCurrency(Number(formData.get('goal_amount') || 1), String(formData.get('currency') || 'USD')),
      goal_type: String(formData.get('goal_type') || 'one-time'),
      set_end_date: formData.get('set_end_date') === 'true',
      ends_on: formData.get('set_end_date') === 'true' && formData.get('ends_on') ? new Date(String(formData.get('ends_on'))).toISOString() : null,
      status: state.goals.some((goal) => goal.status === 'active') ? 'pending' : 'active',
      queue_order: queueOrder
    };

    const { data, error } = await supabase.from('donation_goals').insert(payload).select().single();
    if (error) {
      setMessage(target, error.message, true);
      return;
    }

    state.goals.push(data);
    setMessage(target, 'Donation goal created.');
    renderDashboardShell(state);
  });

  document.getElementById('copy-goal-widget-url')?.addEventListener('click', async () => {
    const activeGoalWidgetUrl = `${boot.appUrl}/goal/${state.profile.username}`;
    try {
      await navigator.clipboard.writeText(activeGoalWidgetUrl);
      setMessage(document.getElementById('goal-message'), 'Donation goal widget URL copied.');
    } catch (error) {
      setMessage(document.getElementById('goal-message'), 'Could not copy widget URL. Copy it manually.', true);
    }
  });

  document.getElementById('copy-donation-widget-url')?.addEventListener('click', async () => {
    const widgetUrl = `${boot.appUrl}/donation-widget/${state.profile.username}`;
    try {
      await navigator.clipboard.writeText(widgetUrl);
      setMessage(document.getElementById('donation-widget-message'), 'Donation widget URL copied.');
    } catch (error) {
      setMessage(document.getElementById('donation-widget-message'), 'Could not copy widget URL. Copy it manually.', true);
    }
  });

  document.getElementById('donation-widget-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = document.getElementById('donation-widget-message');
    setMessage(target, 'Saving donation widget...');
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get('title') || 'Donation Widget'),
      theme: String(formData.get('theme') || 'sunset'),
      layout: String(formData.get('layout') || 'stacked-cards'),
      max_items: Number(formData.get('max_items') || 4),
      show_currency: formData.get('show_currency') === 'true',
      show_message: formData.get('show_message') === 'true',
      background_color: String(formData.get('background_color') || '#120C09'),
      accent_color: String(formData.get('accent_color') || '#FF8A3D'),
      text_color: String(formData.get('text_color') || '#FFF4EC'),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('donation_widget_settings')
      .update(payload)
      .eq('id', state.donationWidget.id)
      .select()
      .single();

    if (error) {
      setMessage(target, error.message, true);
      return;
    }

    state.donationWidget = data;
    setMessage(target, 'Donation widget updated.');
    renderDashboardShell(state);
  });

  document.querySelectorAll('[data-goal-action="activate"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const goalId = button.dataset.goalId;
      const updates = [];
      for (const goal of state.goals) {
        if (goal.status === 'active' && goal.id !== goalId) {
          updates.push(supabase.from('donation_goals').update({ status: 'pending' }).eq('id', goal.id));
        }
      }
      await Promise.all(updates);
      const { data } = await supabase.from('donation_goals').update({ status: 'active' }).eq('id', goalId).select().single();
      state.goals = state.goals.map((goal) => goal.id === goalId ? data : { ...goal, status: goal.status === 'active' ? 'pending' : goal.status });
      renderDashboardShell(state);
    });
  });

  document.querySelectorAll('[data-goal-action="complete"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const goalId = button.dataset.goalId;
      const { data } = await supabase.from('donation_goals').update({ status: 'completed', current_amount: Number(button.dataset.goalAmount || 0) }).eq('id', goalId).select().single();
      state.goals = state.goals.map((goal) => goal.id === goalId ? data : goal);
      const nextPending = state.goals.find((goal) => goal.status === 'pending');
      if (nextPending) {
        const next = await supabase.from('donation_goals').update({ status: 'active' }).eq('id', nextPending.id).select().single();
        state.goals = state.goals.map((goal) => goal.id === nextPending.id ? next.data : goal);
      }
      renderDashboardShell(state);
    });
  });

  bindGoalPlayground();
  bindDonationWidgetPreview(state);

  document.getElementById('integration-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = document.getElementById('integration-message');
    setMessage(target, 'Saving Telegram integration...');
    const formData = new FormData(event.currentTarget);

    const payload = {
      user_id: state.user.id,
      telegram_chat_id: String(formData.get('telegram_chat_id') || '').trim(),
      active_setting_id: String(formData.get('active_setting_id') || ''),
      sync_enabled: String(formData.get('sync_enabled') || 'true') === 'true'
    };

    const { data, error } = await supabase
      .from('client_integrations')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      setMessage(target, error.message, true);
      return;
    }

    state.integration = data;
    setMessage(target, 'Telegram settings saved.');
  });

  const editor = document.getElementById('setting-editor');
  if (editor) {
    editor.addEventListener('input', () => updatePreviewFromForm(editor));

    editor.addEventListener('submit', async (event) => {
      event.preventDefault();
      const target = document.getElementById('setting-message');
      setMessage(target, 'Saving alert setting...');
      const payload = gatherSettingPayload(editor);
      const selected = state.settings.find((item) => item.id === state.selectedSettingId);

      const { data, error } = await supabase
        .from('alert_settings')
        .update(payload)
        .eq('id', selected.id)
        .select()
        .single();

      if (error) {
        setMessage(target, error.message, true);
        return;
      }

      const index = state.settings.findIndex((item) => item.id === selected.id);
      state.settings[index] = data;
      setMessage(target, 'Alert setting updated.');
      renderDashboardShell(state);
    });

    editor.querySelector('[name="logo_file"]')?.addEventListener('change', async (event) => {
      await uploadSettingAsset(event.target.files[0], state.user.id, 'image', editor);
    });

    editor.querySelector('[name="sound_file"]')?.addEventListener('change', async (event) => {
      await uploadSettingAsset(event.target.files[0], state.user.id, 'sound', editor);
    });
  }
}

async function uploadSettingAsset(file, userId, type, form) {
  if (!file) {
    return;
  }

  const path = `${userId}/${type}-${Date.now()}-${slugify(file.name)}`;
  const target = document.getElementById('setting-message');
  setMessage(target, `Uploading ${type}...`);

  const { error } = await supabase.storage.from('alert-assets').upload(path, file, {
    upsert: true,
    cacheControl: '3600'
  });

  if (error) {
    setMessage(target, error.message, true);
    return;
  }

  const { data } = supabase.storage.from('alert-assets').getPublicUrl(path);
  const fieldName = type === 'image' ? 'logo_url' : 'sound_url';
  form.querySelector(`[name="${fieldName}"]`).value = data.publicUrl;
  updatePreviewFromForm(form);
  setMessage(target, `${type} uploaded. Save the setting to persist it.`);
}

function updatePreviewFromForm(form) {
  const payload = gatherSettingPayload(form);
  const previewRoot = document.getElementById('preview-root');
  if (!previewRoot) {
    return;
  }

  previewRoot.innerHTML = buildAlertMarkup(payload, {
    donor_name: 'Viewer Name',
    amount: 15,
    currency: 'USD',
    supporter_message: 'This is how the alert will look in your stream overlay.'
  }, true);
}

function gatherSettingPayload(form) {
  const formData = new FormData(form);
  return {
    title: String(formData.get('title') || '').trim(),
    alert_type: String(formData.get('alert_type') || 'Donation'),
    enabled: formData.get('enabled') === 'true',
    layout: String(formData.get('layout') || 'image-above-text'),
    logo_url: String(formData.get('logo_url') || '').trim(),
    sound_url: String(formData.get('sound_url') || '').trim(),
    message_template: String(formData.get('message_template') || DEFAULT_SETTING.message_template),
    alert_duration: Number(formData.get('alert_duration') || 10),
    text_delay: Number(formData.get('text_delay') || 3.5),
    sound_volume: Number(formData.get('sound_volume') || 100),
    font_family: String(formData.get('font_family') || 'Poppins'),
    font_size: Number(formData.get('font_size') || 36),
    font_weight: String(formData.get('font_weight') || '700'),
    text_color: String(formData.get('text_color') || '#FFFFFF'),
    text_highlight_color: String(formData.get('text_highlight_color') || '#32C3A6'),
    background_color: String(formData.get('background_color') || '#000000'),
    alert_animation: String(formData.get('alert_animation') || 'fade-pop'),
    text_animation: String(formData.get('text_animation') || 'type-rise'),
    is_default: formData.get('is_default') === 'true',
    updated_at: new Date().toISOString()
  };
}

function buildSettingEditor(setting) {
  return `
    <form id="setting-editor" class="form-grid editor-shell">
      <section class="editor-section">
        <div class="subtle-title">Identity</div>
        <div class="field">
          <label>Alert title</label>
          <input name="title" value="${escapeHtml(setting.title || '')}" />
        </div>
        <div class="editor-grid-2" style="margin-top:16px">
          <div class="field">
            <label>Alert type</label>
            <select name="alert_type">
              ${['Donation', 'Supporter'].map((item) => `<option value="${item}" ${setting.alert_type === item ? 'selected' : ''}>${item}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Enabled</label>
            <select name="enabled">
              <option value="true" ${setting.enabled ? 'selected' : ''}>Enabled</option>
              <option value="false" ${!setting.enabled ? 'selected' : ''}>Disabled</option>
            </select>
          </div>
        </div>
      </section>
      <section class="editor-section">
        <div class="subtle-title">Layout & Media</div>
        <div class="field">
          <label>Layout</label>
          <select name="layout">
            ${[
              ['image-above-text', 'Image Above Text'],
              ['image-left-text', 'Image Left Text'],
              ['text-only', 'Text Only']
            ].map(([value, label]) => `<option value="${value}" ${setting.layout === value ? 'selected' : ''}>${label}</option>`).join('')}
          </select>
        </div>
        <div class="editor-grid-2" style="margin-top:16px">
          <div class="field">
            <label>Image upload</label>
            <input name="logo_file" type="file" accept="image/*" />
          </div>
          <div class="field">
            <label>Image URL</label>
            <input name="logo_url" value="${escapeHtml(setting.logo_url || '')}" />
          </div>
        </div>
        <div class="editor-grid-2" style="margin-top:16px">
          <div class="field">
            <label>Sound upload</label>
            <input name="sound_file" type="file" accept="audio/*" />
          </div>
          <div class="field">
            <label>Sound URL</label>
            <input name="sound_url" value="${escapeHtml(setting.sound_url || '')}" />
          </div>
        </div>
        <div class="field" style="margin-top:16px">
          <label>Sound volume</label>
          <input name="sound_volume" type="range" min="0" max="100" step="1" value="${escapeHtml(setting.sound_volume || 100)}" />
        </div>
      </section>
      <section class="editor-section">
        <div class="subtle-title">Message</div>
        <div class="field">
          <label>Message template</label>
          <textarea name="message_template">${escapeHtml(setting.message_template || DEFAULT_SETTING.message_template)}</textarea>
        </div>
        <div class="editor-grid-2" style="margin-top:16px">
          <div class="field">
            <label>Alert duration</label>
            <input name="alert_duration" type="number" min="2" max="60" step="1" value="${escapeHtml(setting.alert_duration || 10)}" />
          </div>
          <div class="field">
            <label>Text delay</label>
            <input name="text_delay" type="number" min="0" max="20" step="0.1" value="${escapeHtml(setting.text_delay || 3.5)}" />
          </div>
        </div>
      </section>
      <section class="editor-section">
        <div class="subtle-title">Typography & Color</div>
        <div class="editor-grid-2">
          <div class="field">
            <label>Font</label>
            <select name="font_family">
              ${FONT_OPTIONS.map((font) => `<option value="${font}" ${setting.font_family === font ? 'selected' : ''}>${font}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Font size</label>
            <input name="font_size" type="number" min="14" max="96" step="1" value="${escapeHtml(setting.font_size || 36)}" />
          </div>
        </div>
        <div class="editor-grid-2" style="margin-top:16px">
          <div class="field">
            <label>Font weight</label>
            <select name="font_weight">
              ${['400', '500', '600', '700', '800'].map((weight) => `<option value="${weight}" ${String(setting.font_weight) === weight ? 'selected' : ''}>${weight}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Default setting</label>
            <select name="is_default">
              <option value="true" ${setting.is_default ? 'selected' : ''}>Yes</option>
              <option value="false" ${!setting.is_default ? 'selected' : ''}>No</option>
            </select>
          </div>
        </div>
        <div class="editor-grid-3" style="margin-top:16px">
          <div class="field">
            <label>Text color</label>
            <input name="text_color" type="color" value="${escapeHtml(setting.text_color || '#FFFFFF')}" />
            <div class="field-meta">Current color: ${escapeHtml(setting.text_color || '#FFFFFF')}</div>
          </div>
          <div class="field">
            <label>Text highlight color</label>
            <input name="text_highlight_color" type="color" value="${escapeHtml(setting.text_highlight_color || '#32C3A6')}" />
            <div class="field-meta">Current color: ${escapeHtml(setting.text_highlight_color || '#32C3A6')}</div>
          </div>
          <div class="field">
            <label>Background color</label>
            <input name="background_color" type="color" value="${escapeHtml(setting.background_color || '#000000')}" />
            <div class="field-meta">Current color: ${escapeHtml(setting.background_color || '#000000')}</div>
          </div>
        </div>
      </section>
      <section class="editor-section">
        <div class="subtle-title">Animation</div>
        <div class="editor-grid-2">
          <div class="field">
            <label>Alert animation</label>
            <select name="alert_animation">
              ${ANIMATION_OPTIONS.map((item) => `<option value="${item.value}" ${setting.alert_animation === item.value ? 'selected' : ''}>${item.label}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Text animation</label>
            <select name="text_animation">
              ${TEXT_ANIMATION_OPTIONS.map((item) => `<option value="${item.value}" ${setting.text_animation === item.value ? 'selected' : ''}>${item.label}</option>`).join('')}
            </select>
          </div>
        </div>
      </section>
      <div class="inline-actions">
        <button class="button" type="submit">Save alert setting</button>
      </div>
    </form>
  `;
}

function renderAnalyticsView(state, filteredEvents, totals) {
  return `
    <div class="card dashboard-card">
      <div class="split">
        <div>
          <div class="subtle-title">Donation Analytics</div>
          <h2 class="section-title">Performance Overview</h2>
          <p class="section-copy">Switch between recent day, week, and month totals to track supporter activity.</p>
        </div>
        <div class="range-tabs">
          <button class="tab-button ${state.analyticsRange === 'day' ? 'active' : ''}" data-range="day">Last Day</button>
          <button class="tab-button ${state.analyticsRange === 'week' ? 'active' : ''}" data-range="week">Last Week</button>
          <button class="tab-button ${state.analyticsRange === 'month' ? 'active' : ''}" data-range="month">Last Month</button>
        </div>
      </div>
      <div class="stats-grid" style="margin-top:18px">
        <div class="mini-stat"><strong>${totals.count}</strong><span>Donations in selected range</span></div>
        <div class="mini-stat"><strong>${totals.amount}</strong><span>Collected amount</span></div>
        <div class="mini-stat"><strong>${totals.latest}</strong><span>Most recent supporter</span></div>
      </div>
      <div class="card-surface" style="margin-top:18px">
        <div class="subtle-title">Recent Activity</div>
        ${filteredEvents.length ? renderTable(filteredEvents.slice(0, 20).map((event) => [
          event.donor_name || 'Supporter',
          formatCurrency(event.amount, event.currency),
          event.supporter_message || event.raw_text || '',
          formatDate(event.created_at)
        ]), ['Name', 'Amount', 'Message', 'Time']) : '<div class="empty-state">No donation data in this time range.</div>'}
      </div>
    </div>
  `;
}

function renderAlertSettingsView(state, selected, widgetUrl) {
  return `
    <div class="settings-shell">
      <div class="card dashboard-card">
        <div class="settings-topbar">
          <div>
            <div class="subtle-title">Alert Settings</div>
            <h2 class="section-title">Alert Design Workspace</h2>
            <p class="section-copy">Manage Telegram connection, choose the active alert preset, and tune the full OBS experience from one page.</p>
          </div>
          <div class="inline-actions">
            <button class="button-ghost" id="create-setting">Create new setting</button>
          </div>
        </div>
        <div class="settings-select-grid" style="margin-top:18px">
          <div class="field">
            <label>Select Setting</label>
            <select id="setting-switcher">
              ${state.settings.map((setting) => `
                <option value="${setting.id}" ${selected && selected.id === setting.id ? 'selected' : ''}>${escapeHtml(setting.title)}</option>
              `).join('')}
            </select>
          </div>
          <div class="field">
            <label>OBS Widget URL</label>
            <div class="code-box">${escapeHtml(widgetUrl || 'Create a setting first')}</div>
          </div>
        </div>
      </div>

      <div class="settings-layout">
        <div class="settings-left">
          ${selected ? `
            <div class="setting-summary">
              <div class="subtle-title">Selected Setting</div>
              <div class="split">
                <h3 class="section-title" style="margin:0">${escapeHtml(selected.title)}</h3>
                <span class="badge">${selected.enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div class="setting-summary-grid">
                <div class="setting-summary-item">
                  <strong>Alert Type</strong>
                  <span>${escapeHtml(selected.alert_type || 'Donation')}</span>
                </div>
                <div class="setting-summary-item">
                  <strong>Layout</strong>
                  <span>${escapeHtml(selected.layout || 'image-above-text')}</span>
                </div>
                <div class="setting-summary-item">
                  <strong>Duration</strong>
                  <span>${escapeHtml(String(selected.alert_duration || 10))}s</span>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="card dashboard-card">
            <div class="subtle-title">Setting Library</div>
            <div class="setting-list" id="setting-list" style="margin-top:16px">
              ${state.settings.map((setting) => `
                <button class="setting-item ${selected && selected.id === setting.id ? 'active' : ''}" data-setting-id="${setting.id}">
                  <div class="split">
                    <strong>${escapeHtml(setting.title)}</strong>
                    <span class="badge">${setting.enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div class="note">${escapeHtml(setting.alert_type || 'Donation')}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="card dashboard-card">
            <div class="subtle-title">Customize</div>
            <h2 class="section-title">Alert Controls</h2>
            ${selected ? buildSettingEditor(selected) : '<div class="empty-state" style="margin-top:16px">No settings found.</div>'}
            <div id="setting-message"></div>
          </div>
        </div>

        <div class="settings-right">
          <div class="card dashboard-card settings-sticky">
            <div class="preview-header">
              <div>
                <div class="subtle-title">Preview</div>
                <h2 class="section-title">OBS Preview</h2>
                <p class="section-copy">See the selected alert as a large browser-source preview before you use it live.</p>
              </div>
              <div class="preview-badge">OBS Widget Preview</div>
            </div>
            <div class="preview-stage">
              <div class="preview-grid"></div>
              <div class="preview-label">16:9 live scene mockup</div>
              <div id="preview-root">
                ${selected ? buildAlertMarkup(selected, {
                  donor_name: 'Viewer Name',
                  amount: 15,
                  currency: '$',
                  supporter_message: 'This is how the alert will look in your stream overlay.'
                }, true) : ''}
              </div>
            </div>
            <p class="note preview-note">Logo and sound files upload to the <code>alert-assets</code> Supabase storage bucket.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTelegramIntegrationView(state) {
  return `
    <div class="card dashboard-card">
      <div class="split">
        <div>
          <div class="subtle-title">Telegram Integration</div>
          <h2 class="section-title">Connection Settings</h2>
          <p class="section-copy">Set the Telegram chat that the server should watch for successful payment messages. The bot token is now stored on the server in <code>.env</code>.</p>
        </div>
        <div class="badge">${boot.telegramSyncConfigured ? 'Sync worker configured' : 'Server sync not configured'}</div>
      </div>
      <div class="card-surface" style="margin-top:18px">
        <div class="subtle-title">Bot Setup</div>
        <p class="section-copy" style="margin-top:0">Add <strong>@TipBotCheck_bot</strong> to your Telegram chat or group, then copy that chat ID into the field below.</p>
      </div>
      <form id="integration-form" class="form-grid" style="margin-top:18px">
        <div class="field">
          <label>Telegram Chat ID</label>
          <input type="text" name="telegram_chat_id" value="${escapeHtml(state.integration?.telegram_chat_id || '')}" placeholder="-1001234567890" />
          <div class="field-meta">Invite @TipBotCheck_bot into this chat before saving.</div>
        </div>
        <div class="field">
          <label>Active alert setting</label>
          <select name="active_setting_id">
            ${state.settings.map((setting) => `
              <option value="${setting.id}" ${state.integration?.active_setting_id === setting.id ? 'selected' : ''}>${escapeHtml(setting.title)}</option>
            `).join('')}
          </select>
        </div>
        <div class="field">
          <label>Enable sync</label>
          <select name="sync_enabled">
            <option value="true" ${state.integration?.sync_enabled !== false ? 'selected' : ''}>Enabled</option>
            <option value="false" ${state.integration?.sync_enabled === false ? 'selected' : ''}>Disabled</option>
          </select>
        </div>
        <div class="inline-actions">
          <button class="button" type="submit">Save Telegram settings</button>
        </div>
      </form>
      <div id="integration-message"></div>
    </div>
  `;
}

function renderDonationWidgetView(state) {
  const widgetUrl = `${boot.appUrl}/donation-widget/${state.profile.username}`;
  const settings = state.donationWidget || {};
  const previewEvents = (state.events || []).slice(0, Math.max(1, Number(settings.max_items || 4)));

  return `
    <div class="settings-shell">
      <div class="card dashboard-card">
        <div class="split">
          <div>
            <div class="subtle-title">Donation Widget</div>
            <h2 class="section-title">Separate from Donation Goal</h2>
            <p class="section-copy">Use this widget for a live donation feed or donation cards in OBS. This is different from the Donation Goal widget.</p>
          </div>
          <div class="inline-actions">
            <button class="button-ghost" id="copy-donation-widget-url">Copy Donation Widget URL</button>
          </div>
        </div>
        <div class="code-box" style="margin-top:16px">${escapeHtml(widgetUrl)}</div>
        <div id="donation-widget-message"></div>
      </div>

      <div class="settings-layout">
        <div class="settings-left">
          <div class="card dashboard-card">
            <div class="subtle-title">Setting</div>
            <h2 class="section-title">Donation Widget Settings</h2>
            <form id="donation-widget-form" class="form-grid editor-shell" style="margin-top:16px">
              <section class="editor-section">
                <div class="field">
                  <label>Widget Title</label>
                  <input name="title" value="${escapeHtml(settings.title || 'Donation Widget')}" />
                </div>
                <div class="editor-grid-2" style="margin-top:16px">
                  <div class="field">
                    <label>Theme</label>
                    <select name="theme">
                      <option value="sunset" ${settings.theme === 'sunset' ? 'selected' : ''}>Sunset</option>
                      <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                      <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>Layout</label>
                    <select name="layout">
                      <option value="stacked-cards" ${settings.layout === 'stacked-cards' ? 'selected' : ''}>Stacked Cards</option>
                      <option value="single-feature" ${settings.layout === 'single-feature' ? 'selected' : ''}>Single Feature</option>
                    </select>
                  </div>
                </div>
                <div class="editor-grid-2" style="margin-top:16px">
                  <div class="field">
                    <label>Visible Items</label>
                    <input name="max_items" type="number" min="1" max="8" value="${escapeHtml(String(settings.max_items || 4))}" />
                  </div>
                  <div class="field">
                    <label>Show Currency</label>
                    <select name="show_currency">
                      <option value="true" ${settings.show_currency !== false ? 'selected' : ''}>Yes</option>
                      <option value="false" ${settings.show_currency === false ? 'selected' : ''}>No</option>
                    </select>
                  </div>
                </div>
                <div class="field" style="margin-top:16px">
                  <label>Show Message</label>
                  <select name="show_message">
                    <option value="true" ${settings.show_message !== false ? 'selected' : ''}>Yes</option>
                    <option value="false" ${settings.show_message === false ? 'selected' : ''}>No</option>
                  </select>
                </div>
              </section>
              <section class="editor-section">
                <div class="subtle-title">Colors</div>
                <div class="editor-grid-3">
                  <div class="field">
                    <label>Background</label>
                    <input name="background_color" type="color" value="${escapeHtml(settings.background_color || '#120C09')}" />
                  </div>
                  <div class="field">
                    <label>Accent</label>
                    <input name="accent_color" type="color" value="${escapeHtml(settings.accent_color || '#FF8A3D')}" />
                  </div>
                  <div class="field">
                    <label>Text</label>
                    <input name="text_color" type="color" value="${escapeHtml(settings.text_color || '#FFF4EC')}" />
                  </div>
                </div>
              </section>
              <div class="inline-actions">
                <button class="button" type="submit">Save Donation Widget</button>
              </div>
            </form>
          </div>
        </div>
        <div class="settings-right">
          <div class="card dashboard-card settings-sticky">
            <div class="preview-header">
              <div>
                <div class="subtle-title">Preview</div>
                <h2 class="section-title">Donation Widget Preview</h2>
              </div>
              <div class="preview-badge">OBS Widget</div>
            </div>
            <div id="donation-widget-preview-root">${buildDonationWidgetMarkup(settings, previewEvents)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindGoalPlayground() {
  const form = document.getElementById('create-goal-form');
  const previewRoot = document.getElementById('goal-preview-root');
  if (!form || !previewRoot) {
    return;
  }

  let playgroundAmount = 0;

  const renderPreview = () => {
    const formData = new FormData(form);
    const currency = String(formData.get('currency') || 'USD');
    const goalAmount = Number(formData.get('goal_amount') || 1);
    const goal = {
      title: String(formData.get('title') || 'New Gaming PC'),
      style: String(formData.get('style') || 'original-gamepad'),
      color_theme: String(formData.get('color_theme') || 'light'),
      currency,
      currency_symbol: currencySymbolFor(currency),
      goal_amount: goalAmount,
      current_amount: playgroundAmount,
      progress_display: `${formatCurrency(playgroundAmount, currency)} / ${formatCurrency(goalAmount, currency)}`
    };
    previewRoot.innerHTML = buildGoalWidgetMarkup(goal, playgroundAmount);
  };

  form.addEventListener('input', renderPreview);
  document.querySelectorAll('[data-goal-test]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.goalTest === 'reset') {
        playgroundAmount = 0;
      } else {
        playgroundAmount += Number(button.dataset.goalTest || 0);
      }
      renderPreview();
    });
  });

  document.querySelectorAll('[data-goal-fill]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = form.querySelector('[name="goal_amount"]');
      input.value = button.dataset.goalFill;
      renderPreview();
    });
  });

  renderPreview();
}

function bindDonationWidgetPreview(state) {
  const form = document.getElementById('donation-widget-form');
  const root = document.getElementById('donation-widget-preview-root');
  if (!form || !root) {
    return;
  }

  const renderPreview = () => {
    const formData = new FormData(form);
    const settings = {
      title: String(formData.get('title') || 'Donation Widget'),
      theme: String(formData.get('theme') || 'sunset'),
      layout: String(formData.get('layout') || 'stacked-cards'),
      max_items: Number(formData.get('max_items') || 4),
      show_currency: formData.get('show_currency') === 'true',
      show_message: formData.get('show_message') === 'true',
      background_color: String(formData.get('background_color') || '#120C09'),
      accent_color: String(formData.get('accent_color') || '#FF8A3D'),
      text_color: String(formData.get('text_color') || '#FFF4EC')
    };
    root.innerHTML = buildDonationWidgetMarkup(settings, (state.events || []).slice(0, Math.max(1, settings.max_items)));
  };

  form.addEventListener('input', renderPreview);
  renderPreview();
}

function renderDonationGoalsView(state) {
  const activeGoal = state.goals.find((goal) => goal.status === 'active') || null;
  const pendingGoals = state.goals.filter((goal) => goal.status === 'pending');
  const completedGoals = state.goals.filter((goal) => goal.status === 'completed');
  const goalWidgetUrl = `${boot.appUrl}/goal/${state.profile.username}`;

  return `
    <div class="goals-shell">
      <div class="card dashboard-card">
        <div class="split">
          <div>
            <div class="subtle-title">Donation Goals</div>
            <h2 class="section-title">Manage your stream goals and sequential stretch targets.</h2>
          </div>
          <div class="inline-actions">
            <button class="button-ghost" id="copy-goal-widget-url">Copy Donation Goal Widget URL</button>
            <button class="button" onclick="document.getElementById('goal-title')?.focus()">Create New Goal</button>
          </div>
        </div>
        <div class="code-box" style="margin-top:16px">${escapeHtml(goalWidgetUrl)}</div>
      </div>

      <div class="goals-layout">
        <div class="goals-left">
          <div class="card dashboard-card">
            <div class="subtle-title">Donation Goal Preview</div>
            <div id="goal-preview-root">${buildGoalWidgetMarkup({
              title: 'New Gaming PC',
              style: 'original-gamepad',
              color_theme: 'light',
              currency: 'USD',
              currency_symbol: '$',
              goal_amount: 1,
              current_amount: 0,
              progress_display: '$0.00 / $1.00'
            }, 0)}</div>
            <div class="subtle-title" style="margin-top:16px">Interactive Playground</div>
            <div class="inline-actions">
              <button class="button-ghost" data-goal-test="5">+$5</button>
              <button class="button-ghost" data-goal-test="20">+$20</button>
              <button class="button-ghost" data-goal-test="100">+$100</button>
              <button class="button-ghost" data-goal-test="reset">Reset</button>
            </div>
            <p class="note" style="margin-top:12px">Use buttons above to test animations. These changes won't be saved to your goal.</p>
          </div>

          <div class="card dashboard-card">
            <div class="split">
              <div>
                <div class="subtle-title">Current Goal</div>
                <h2 class="section-title">${activeGoal ? escapeHtml(activeGoal.title) : 'No Active Goal'}</h2>
              </div>
              <div class="badge">${activeGoal ? 'Active' : 'Empty'}</div>
            </div>
            <p class="section-copy">${activeGoal ? 'Your donation goal widget is currently showing this goal.' : 'Your donation goal widget is currently empty. Activate a goal below or create a new one to start collecting donations.'}</p>
          </div>

          <div class="card dashboard-card">
            <div class="split">
              <div class="subtle-title">Goal Queue (${pendingGoals.length})</div>
              <div class="subtle-title">Completed (${completedGoals.length})</div>
            </div>
            ${pendingGoals.length || completedGoals.length ? renderTable(
              [...pendingGoals, ...completedGoals].map((goal) => [
                goal.title,
                prettifyGoalStyle(goal.style),
                goal.progress_display || buildGoalProgressDisplay(goal),
                goal.ends_on ? formatDate(goal.ends_on) : 'No end date',
                goal.status,
                goal.status === 'pending'
                  ? 'Activate'
                  : goal.status === 'active'
                    ? 'Complete'
                    : 'Done'
              ]),
              ['Goal Details', 'Style', 'Progress', 'Ends On', 'Status', 'Action']
            ) : '<div class="empty-state">The queue is empty. Stretch goals will appear here.</div>'}
            <div class="data-list" style="margin-top:16px">
              ${state.goals.map((goal) => `
                <div class="data-item">
                  <div class="split">
                    <strong>${escapeHtml(goal.title)}</strong>
                    <span class="badge">${escapeHtml(goal.status)}</span>
                  </div>
                  <div class="note">${escapeHtml(buildGoalProgressDisplay(goal))}</div>
                  <div class="inline-actions" style="margin-top:10px">
                    ${goal.status === 'pending' ? `<button class="button-ghost" data-goal-action="activate" data-goal-id="${goal.id}">Activate</button>` : ''}
                    ${goal.status === 'active' ? `<button class="button-ghost" data-goal-action="complete" data-goal-id="${goal.id}" data-goal-amount="${goal.goal_amount}">Complete</button>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="goals-right">
          <div class="card dashboard-card">
            <div class="subtle-title">Create New Donation Goal</div>
            <h2 class="section-title">Configure your goal and preview it in real-time.</h2>
            <form id="create-goal-form" class="form-grid editor-shell" style="margin-top:16px">
              <div class="editor-section">
                <div class="field">
                  <label>Goal Title *</label>
                  <input id="goal-title" name="title" placeholder="e.g., New Gaming PC" required />
                </div>
                <div class="editor-grid-2" style="margin-top:16px">
                  <div class="field">
                    <label>Style</label>
                    <select name="style">
                      <option value="original-gamepad">Original (Gamepad)</option>
                      <option value="minimal-bar">Minimal Bar</option>
                      <option value="neon-stream">Neon Stream</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>Color Theme</label>
                    <select name="color_theme">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="sunset">Sunset</option>
                    </select>
                  </div>
                </div>
                <div class="editor-grid-2" style="margin-top:16px">
                  <div class="field">
                    <label>Goal Currency</label>
                    <select name="currency">
                      <option value="USD">USD ($)</option>
                      <option value="KHR">KHR (៛)</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>Goal Amount *</label>
                    <input name="goal_amount" type="number" min="1" step="1" value="1" required />
                  </div>
                </div>
                <div class="goal-quick-amounts">
                  <button type="button" class="goal-quick-button" data-goal-fill="1">1</button>
                  <button type="button" class="goal-quick-button" data-goal-fill="10">10</button>
                  <button type="button" class="goal-quick-button" data-goal-fill="50">50</button>
                  <button type="button" class="goal-quick-button" data-goal-fill="100">100</button>
                </div>
                <div class="field" style="margin-top:16px">
                  <label>Progress Display</label>
                  <input name="progress_display" value="$0.00 / $1.00" />
                </div>
                <div class="editor-grid-2" style="margin-top:16px">
                  <div class="field">
                    <label>Goal Type</label>
                    <select name="goal_type">
                      <option value="one-time">One-time</option>
                      <option value="daily">Daily</option>
                    </select>
                    <div class="field-meta">"Daily" goals never finish and reset every midnight.</div>
                  </div>
                  <div class="field">
                    <label>Set End Date</label>
                    <select name="set_end_date">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
                <div class="field" style="margin-top:16px">
                  <label>Ends On</label>
                  <input name="ends_on" type="date" />
                </div>
              </div>
              <div class="inline-actions">
                <button class="button" type="submit">Create Donation Goal</button>
              </div>
            </form>
            <div id="goal-message"></div>
          </div>
          <div class="card dashboard-card settings-sticky">
            <div class="card-surface">
              <strong>💡 Quick Tip:</strong>
              <div class="note" style="margin-top:8px">Goals in the same list will automatically advance. When this goal finishes, your next pending goal will start immediately.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildNav(profile, isAdmin) {
  return `
    <div class="nav">
      <a class="brand" href="/">
        <span class="brand-mark">T</span>
        <span>Tipalets</span>
      </a>
      <div class="nav-actions">
        <a class="button-ghost" href="/">Homepage</a>
        <a class="button-ghost" href="/dashboard">Client</a>
        ${isAdmin ? '<a class="button-ghost" href="/admin">Admin</a>' : ''}
        ${profile ? `<span class="pill">@${escapeHtml(profile.username || 'user')}</span>` : ''}
      </div>
    </div>
  `;
}

function bindNavActions() {
  const logout = document.getElementById('logout-button');
  if (logout) {
    logout.addEventListener('click', async () => {
      await supabase.auth.signOut();
      location.href = '/login';
    });
  }
}

function buildAlertMarkup(setting, event, preview) {
  const text = interpolateTemplate(setting.message_template || DEFAULT_SETTING.message_template, {
    name: event.donor_name || 'Supporter',
    amount: formatAmount(event.amount),
    currency: event.currency || 'USD',
    message: event.supporter_message || '',
    newline: '\n'
  });

  const hasImage = Boolean(setting.logo_url) && setting.layout !== 'text-only';
  const layoutStyle = getAlertLayoutStyle(setting.layout);
  const background = hexToRgba(setting.background_color || '#000000', preview ? 0.72 : 0.66);

  return `
    <div class="visible" style="
      --highlight-color:${escapeHtml(setting.text_highlight_color || '#32C3A6')};
      background:${background};
      display:grid;
      gap:16px;
      justify-items:center;
      padding:24px 28px;
      border-radius:28px;
      border:1px solid rgba(255,255,255,0.08);
      box-shadow:0 24px 80px rgba(0,0,0,0.35);
    ">
      <div class="${preview ? '' : setting.alert_animation || 'fade-pop'}" style="display:grid;gap:16px;${layoutStyle}">
      ${hasImage ? `<img class="alert-logo" src="${escapeHtml(setting.logo_url)}" alt="Alert logo" />` : ''}
      <div class="alert-text ${escapeHtml(setting.text_animation || 'type-rise')}" style="
        font-family:${escapeHtml(setting.font_family || 'Poppins')}, sans-serif;
        font-size:${Number(setting.font_size || 36)}px;
        font-weight:${escapeHtml(setting.font_weight || '700')};
        color:${escapeHtml(setting.text_color || '#FFFFFF')};
      ">
        ${escapeHtml(text).replace(
          escapeHtml(event.donor_name || 'Supporter'),
          `<span class="alert-highlight">${escapeHtml(event.donor_name || 'Supporter')}</span>`
        ).replace(
          escapeHtml(formatAmount(event.amount)),
          `<span class="alert-highlight">${escapeHtml(formatAmount(event.amount))}</span>`
        )}
      </div>
      </div>
    </div>
  `;
}

function buildGoalWidgetMarkup(goal, animatedAmount = 0) {
  const percent = Math.max(0, Math.min(100, (Number(goal.current_amount || animatedAmount || 0) / Math.max(1, Number(goal.goal_amount || 1))) * 100));
  const theme = getGoalTheme(goal.color_theme);
  return `
    <div class="goal-widget ${escapeHtml(goal.style || 'original-gamepad')}" style="--goal-accent:${theme.accent};--goal-bg:${theme.bg};--goal-track:${theme.track};--goal-ink:${theme.ink};">
      <div class="goal-widget-head">
        <div>
          <div class="goal-kicker">Donation Goal</div>
          <h3>${escapeHtml(goal.title || 'New Goal')}</h3>
        </div>
        <div class="goal-badge">${escapeHtml(goal.goal_type === 'daily' ? 'Daily' : 'New')}</div>
      </div>
      <div class="goal-progress-text">${escapeHtml(goal.progress_display || buildGoalProgressDisplay(goal))}</div>
      <div class="goal-bar">
        <div class="goal-bar-fill" style="width:${percent}%"></div>
      </div>
      <div class="goal-foot">
        <span>${escapeHtml(goal.currency || 'USD')} goal</span>
        <span>${percent.toFixed(0)}%</span>
      </div>
    </div>
  `;
}

function buildDonationWidgetMarkup(settings, events) {
  const theme = getDonationWidgetTheme(settings?.theme, settings);
  const items = (events || []).slice(0, Math.max(1, Number(settings?.max_items || 4)));

  return `
    <div class="donation-widget" style="--dw-bg:${theme.bg};--dw-accent:${theme.accent};--dw-text:${theme.text};">
      <div class="donation-widget-head">
        <div>
          <div class="goal-kicker">Donation Widget</div>
          <h3>${escapeHtml(settings?.title || 'Donation Widget')}</h3>
        </div>
        <div class="goal-badge">${escapeHtml(settings?.layout === 'single-feature' ? 'Feature' : 'Feed')}</div>
      </div>
      ${items.length ? `
        <div class="donation-widget-list ${escapeHtml(settings?.layout || 'stacked-cards')}">
          ${items.map((event, index) => `
            <article class="donation-item ${index === 0 ? 'featured' : ''}">
              <div class="split">
                <strong>${escapeHtml(event.donor_name || 'Supporter')}</strong>
                <span>${settings?.show_currency === false ? escapeHtml(formatAmount(event.amount)) : escapeHtml(formatCurrency(event.amount, event.currency || 'USD'))}</span>
              </div>
              ${settings?.show_message === false ? '' : `<div class="note">${escapeHtml(event.supporter_message || event.raw_text || '')}</div>`}
            </article>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">No donations yet. Recent payments will appear here.</div>
      `}
    </div>
  `;
}

function buildGoalProgressDisplay(goal) {
  return `${formatCurrency(goal.current_amount || 0, goal.currency || 'USD')} / ${formatCurrency(goal.goal_amount || 1, goal.currency || 'USD')}`;
}

function getGoalTheme(theme) {
  if (theme === 'dark') {
    return { accent: '#32C3A6', bg: '#08111E', track: 'rgba(255,255,255,0.08)', ink: '#ECF3FF' };
  }
  if (theme === 'sunset') {
    return { accent: '#FF8A3D', bg: '#1A0E09', track: 'rgba(255,255,255,0.1)', ink: '#FFF4EC' };
  }
  return { accent: '#586BFF', bg: '#F4F7FF', track: 'rgba(10,15,23,0.08)', ink: '#101725' };
}

function getDonationWidgetTheme(theme, settings) {
  if (theme === 'light') {
    return { bg: settings?.background_color || '#F5F7FF', accent: settings?.accent_color || '#586BFF', text: settings?.text_color || '#101725' };
  }
  if (theme === 'dark') {
    return { bg: settings?.background_color || '#08111E', accent: settings?.accent_color || '#32C3A6', text: settings?.text_color || '#ECF3FF' };
  }
  return { bg: settings?.background_color || '#120C09', accent: settings?.accent_color || '#FF8A3D', text: settings?.text_color || '#FFF4EC' };
}

function prettifyGoalStyle(style) {
  if (style === 'original-gamepad') {
    return 'Original (Gamepad)';
  }
  if (style === 'minimal-bar') {
    return 'Minimal Bar';
  }
  if (style === 'neon-stream') {
    return 'Neon Stream';
  }
  return style;
}

function getAlertLayoutStyle(layout) {
  if (layout === 'image-left-text') {
    return 'grid-template-columns:auto 1fr;align-items:center;justify-items:start;text-align:left;';
  }

  if (layout === 'text-only') {
    return 'grid-template-columns:1fr;justify-items:center;align-items:center;text-align:center;';
  }

  return 'grid-template-columns:1fr;justify-items:center;align-items:center;text-align:center;';
}

function applyAlertStyle(element, setting) {
  element.style.setProperty('--highlight-color', setting.text_highlight_color || '#32C3A6');
}

async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

async function requireSession(redirect) {
  const session = await getSession();
  if (!session) {
    location.href = redirect;
    return null;
  }
  return session;
}

async function ensureProfile(user, overrides = {}) {
  const username = overrides.username || user.user_metadata?.username || user.email?.split('@')[0] || `user-${user.id.slice(0, 8)}`;
  const displayName = overrides.display_name || user.user_metadata?.display_name || username;

  const existing = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (existing.data) {
    return existing.data;
  }

  const created = await supabase.from('profiles').upsert({
    id: user.id,
    username: username.toLowerCase(),
    display_name: displayName,
    email: user.email,
    role: 'client'
  }).select().single();

  if (created.data) {
    return created.data;
  }

  const retry = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return retry.data;
}

function renderMissingSupabase() {
  app.innerHTML = `
    <div class="shell">
      <div class="empty-state">
        Supabase is not configured yet. Add <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> to your server environment.
      </div>
    </div>
  `;
}

function renderTable(rows, headers) {
  if (!rows.length) {
    return '<div class="empty-state">No data available.</div>';
  }

  return `
    <table class="table">
      <thead>
        <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell || ''))}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;
}

function summarizeEvents(events) {
  const count = events.length;
  const total = events.reduce((sum, event) => sum + Number(event.amount || 0), 0);
  const currency = events[0]?.currency || 'USD';
  return {
    count,
    amount: formatCurrency(total, currency),
    latest: events[0]?.donor_name || 'No donations yet'
  };
}

function filterEventsByRange(events, range) {
  const now = Date.now();
  const windowMs = range === 'month'
    ? 30 * 24 * 60 * 60 * 1000
    : range === 'week'
      ? 7 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;

  return events.filter((event) => {
    const time = new Date(event.created_at || event.paid_at || 0).getTime();
    return Number.isFinite(time) && now - time <= windowMs;
  });
}

function setMessage(target, text, isError = false) {
  if (!target) {
    return;
  }
  target.innerHTML = `<div class="message ${isError ? 'error' : ''}">${escapeHtml(text)}</div>`;
}

function interpolateTemplate(template, values) {
  return String(template || '')
    .replaceAll('{name}', values.name || '')
    .replaceAll('{amount}', values.amount || '')
    .replaceAll('{currency}', values.currency || '')
    .replaceAll('{message}', values.message || '')
    .replaceAll('{newline}', values.newline || '\n');
}

function formatAmount(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function formatCurrency(value, currency = 'USD') {
  const number = Number(value || 0);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(number);
  } catch {
    return `${formatAmount(number)} ${currency}`;
  }
}

function currencySymbolFor(currency) {
  if (currency === 'KHR') {
    return '៛';
  }
  return '$';
}

function formatDate(value) {
  if (!value) {
    return '';
  }
  return new Date(value).toLocaleString();
}

function slugify(value) {
  return String(value || 'file')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex || '#000000').replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isNewerEvent(candidateId, lastId, orderedEvents) {
  if (!lastId) {
    return true;
  }

  const lastIndex = orderedEvents.findIndex((item) => item.id === lastId);
  const candidateIndex = orderedEvents.findIndex((item) => item.id === candidateId);
  return candidateIndex > lastIndex;
}

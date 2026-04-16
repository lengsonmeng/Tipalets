# Tipalets

Tipalets is a full website for stream donation alerts:

- homepage
- register and login
- client dashboard
- admin page
- public OBS widget route at `/alert/:username/:settingId`
- Supabase-backed auth, profile data, settings, uploads, and donation events
- server-side Telegram polling worker that converts paid invoice messages into alert events

## Architecture

This repo uses a lightweight Node server with static frontend pages.

- Frontend: vanilla JS, browser-side Supabase client
- Backend: Node HTTP server
- Database: Supabase Postgres + Storage
- Widget: public browser-source page for OBS

## Required environment

Copy `.env.example` to `.env` and set:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_URL`

The `SUPABASE_SERVICE_ROLE_KEY` is required for the background Telegram sync worker. Without it, the website UI still works, but donation ingestion from Telegram will stay disabled.

## Database setup

Run the SQL in [supabase/schema.sql](/workspaces/Tipalets/supabase/schema.sql) inside the Supabase SQL editor.

That script creates:

- `profiles`
- `client_integrations`
- `alert_settings`
- `donation_events`
- `alert-assets` storage bucket
- RLS policies for client ownership and public widget reads

## Client flow

1. Register or login
2. Open `/dashboard`
3. Set Telegram Chat ID and Telegram Bot Token
4. Create or edit an alert setting
5. Upload logo and sound
6. Copy the widget URL into OBS

## Telegram flow

The server polls every active client integration with `getUpdates`.

It reads messages from the configured Telegram chat and tries to detect paid invoice or donation-success text. Matching messages are inserted into `donation_events`, which the widget page then displays.

Important limitations:

- the bot only sees chats where it has been added
- if you want group messages from all members, disable privacy mode in BotFather with `/setprivacy`
- for reliable production ingestion, each client should use a bot dedicated to that stream setup

## Widget route

The public widget URL format is:

```text
/alert/<username>/<settingId>
```

The page stays visually empty until a new donation event arrives, then it renders the configured text, image, sound, colors, font, and animation.

## Running

```bash
npm start
```

## Notes

- This repo does not include a Supabase CLI migration runner. Use the SQL file directly in Supabase.
- The browser app expects the public storage bucket `alert-assets` to exist.
- If your Telegram bot token was ever exposed publicly, rotate it in BotFather before production use.

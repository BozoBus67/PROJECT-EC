resource "render_web_service" "backend" {
  name           = "epstein_clicker_backend"
  plan           = "free"
  region         = "oregon"
  start_command  = "uvicorn main:app --host 0.0.0.0 --port $PORT"
  root_directory = "backend"

  runtime_source = {
    native_runtime = {
      repo_url            = "https://github.com/BozoBus67/PROJECT-EC"
      branch              = "main"
      runtime             = "python"
      build_command       = "pip install -r requirements.txt"
      auto_deploy         = true
      auto_deploy_trigger = "commit"
    }
  }

  env_vars = {
    DISCORD_PING_USER_ID  = { value = var.discord_ping_user_id }
    DISCORD_WEBHOOK_URL   = { value = var.discord_webhook_url }
    YOUTUBE_API_KEY       = { value = var.youtube_api_key }
    YOUTUBE_PLAYLIST_ID   = { value = "PLUAuAH8ypp8USRZHusmRweh4t87A3Lybt" }
    POSTHOG_API_KEY       = { value = var.posthog_api_key }
    POSTHOG_HOST          = { value = "https://us.i.posthog.com" }
    SUPABASE_SECRET_KEY   = { value = var.supabase_secret_key }
    SUPABASE_URL          = { value = "https://kcfsskuzddsxufhcskcg.supabase.co" }
    STRIPE_SECRET_KEY     = { value = var.stripe_secret_key }
    STRIPE_WEBHOOK_SECRET = { value = var.stripe_webhook_secret }
  }
}

# KNOWN ISSUE — render-oss/terraform-provider-render#80 (open).
# Any `terraform apply` that updates render_web_service.backend on a free-tier
# service fails with "maintenance mode can only be configured for non-free tier
# services". The provider always includes maintenance_mode in update payloads;
# Render's API rejects any value (even disabled) on free tier. lifecycle.ignore_changes
# does NOT help — it only stops drift detection, not outgoing fields.
# Workaround until upstream fix or paid-tier upgrade: PATCH directly via Render's
# REST API (curl + RENDER_API_KEY), then `terraform apply -refresh-only` to sync state.
# Code deploys (git push → render webhook) are unaffected.

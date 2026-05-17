locals {
  variants = {
    ec = {
      project_name = "epstein-clicker-frontend"
    }
    sfw = {
      project_name = "epstein-clicker-frontend-sfw-version"
    }
  }
}

resource "vercel_project" "frontend" {
  for_each = local.variants

  name           = each.value.project_name
  framework      = "vite"
  root_directory = "frontend"

  # Skip rebuild when push doesn't change anything in ./frontend. Uses
  # VERCEL_GIT_PREVIOUS_SHA (Vercel-injected: SHA of last successful deploy for
  # this project+branch) for accuracy across multi-commit pushes. Falls back to
  # exit 1 (build) on first ever deploy when the var is unset.
  ignore_command = "if [ -z \"$VERCEL_GIT_PREVIOUS_SHA\" ]; then exit 1; fi; git diff $VERCEL_GIT_PREVIOUS_SHA HEAD --quiet ./"

  git_repository = {
    type              = "github"
    repo              = "BozoBus67/PROJECT-EC"
    production_branch = "main"
  }

  oidc_token_config = {
    enabled     = true
    issuer_mode = "team"
  }

  lifecycle {
    # Vercel API returns deployment_type = "all_except_custom_domains" for the EC project (a
    # legacy enum value not in the provider's accepted input set). Ignored to preserve the
    # imported setting and to avoid forcing a value on newly-created variants.
    ignore_changes = [vercel_authentication]
  }
}

# Only the SFW variant gets VITE_SFW=true. EC variant has no VITE_SFW; React code
# (constants.js et al) defaults to NSFW/EC when import.meta.env.VITE_SFW !== 'true'.
resource "vercel_project_environment_variable" "sfw_flag" {
  project_id = vercel_project.frontend["sfw"].id
  key        = "VITE_SFW"
  value      = "true"
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "vite_backend_url" {
  for_each   = vercel_project.frontend
  project_id = each.value.id
  key        = "VITE_BACKEND_URL"
  value      = var.vite_backend_url
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "vite_stripe_payment_link" {
  for_each   = vercel_project.frontend
  project_id = each.value.id
  key        = "VITE_STRIPE_PAYMENT_LINK"
  value      = var.vite_stripe_payment_link
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "vite_supabase_anon_key" {
  for_each   = vercel_project.frontend
  project_id = each.value.id
  key        = "VITE_SUPABASE_ANON_KEY"
  value      = var.vite_supabase_anon_key
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "vite_supabase_url" {
  for_each   = vercel_project.frontend
  project_id = each.value.id
  key        = "VITE_SUPABASE_URL"
  value      = var.vite_supabase_url
  target     = ["production", "preview"]
  sensitive  = true
}

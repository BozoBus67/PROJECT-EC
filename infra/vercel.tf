locals {
  variants = {
    ec = {
      project_name = "project-ec"
      variant_id   = "nsfw"
    }
    sfw = {
      project_name = "extended-cookie-clicker"
      variant_id   = "sfw"
    }
    gemstone = {
      project_name = "gemstone-clicker"
      variant_id   = "gemstone"
    }
  }
}

resource "vercel_project" "frontend" {
  for_each = local.variants

  name           = each.value.project_name
  framework      = "vite"
  root_directory = "frontend"

  # Skip rebuild when push doesn't change anything in ./frontend or ../shared.
  # (shared/ holds cross-stack canonical JSON imported by the frontend bundle —
  # changes there must rebuild.) Uses VERCEL_GIT_PREVIOUS_SHA (Vercel-injected:
  # SHA of last successful deploy for this project+branch) for accuracy across
  # multi-commit pushes. Falls back to exit 1 (build) on first deploy when
  # the var is unset.
  ignore_command = "if [ -z \"$VERCEL_GIT_PREVIOUS_SHA\" ]; then exit 1; fi; git diff $VERCEL_GIT_PREVIOUS_SHA HEAD --quiet ./ ../shared/"

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

# VITE_VARIANT — selects which edition the frontend renders. Read by
# shared/variant.js (which exports VARIANT + IS_NSFW for the rest of the app).
# Set per-project: 'nsfw' for the EC deployment, 'sfw' for the portfolio
# build, 'gemstone' for the gem parody.
#
# Renamed 2026-05-18 from VITE_SFW (boolean) to VITE_VARIANT (enum) to support
# 3+ variants without adding more boolean flags. TF apply will destroy the old
# VITE_SFW env var on the SFW project and create VITE_VARIANT on all three.
resource "vercel_project_environment_variable" "variant_flag" {
  for_each   = local.variants
  project_id = vercel_project.frontend[each.key].id
  key        = "VITE_VARIANT"
  value      = each.value.variant_id
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

variable "vite_backend_url" {
  type      = string
  sensitive = true
}

variable "vite_stripe_payment_link" {
  type      = string
  sensitive = true
}

variable "vite_supabase_anon_key" {
  type      = string
  sensitive = true
}

variable "vite_supabase_url" {
  type      = string
  sensitive = true
}

variable "discord_ping_user_id" {
  type      = string
  sensitive = true
}

variable "discord_webhook_url" {
  type      = string
  sensitive = true
}

variable "youtube_api_key" {
  type      = string
  sensitive = true
}

variable "posthog_api_key" {
  type      = string
  sensitive = true
}

variable "supabase_secret_key" {
  type      = string
  sensitive = true
}

variable "stripe_secret_key" {
  type      = string
  sensitive = true
}

variable "stripe_webhook_secret" {
  type      = string
  sensitive = true
}

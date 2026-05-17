require 'supabase_api'

SupabaseApi::Config.base_url = ENV.fetch('SUPABASE_URL')
SupabaseApi::Config.api_key = ENV.fetch('SUPABASE_SECRET_KEY')

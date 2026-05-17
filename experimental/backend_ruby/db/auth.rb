require 'faraday'

module DB
  class Auth
    def initialize(base_url, api_key)
      @api_key = api_key
      @conn = Faraday.new(url: "#{base_url}/auth/v1") do |f|
        f.request :json
        f.response :json, content_type: /\bjson$/
        f.headers['apikey'] = api_key
        f.headers['Accept-Encoding'] = 'identity'
      end
    end

    def get_user(token)
      response = @conn.get('user') do |req|
        req.headers['Authorization'] = "Bearer #{token}"
      end
      return nil if response.status >= 400
      response.body
    end
  end

  AUTH = Auth.new(
    ENV.fetch('SUPABASE_URL'),
    ENV.fetch('SUPABASE_SECRET_KEY'),
  )
end

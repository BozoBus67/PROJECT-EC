module AuthHelpers
  def require_user!
    header = request.env['HTTP_AUTHORIZATION'].to_s
    halt 401, { detail: 'Invalid authorization header' }.to_json unless header.start_with?('Bearer ')
    token = header.sub(/\ABearer /, '')
    user = DB::AUTH.get_user(token)
    halt 401, { detail: 'Invalid or expired token' }.to_json unless user
    user
  end
end

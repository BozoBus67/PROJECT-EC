require 'sinatra/base'
require 'json'
require 'dotenv/load'

require_relative 'db/client'
require_relative 'db/client_gem'
require_relative 'db/auth'
require_relative 'data/game_data'
require_relative 'helpers/auth'

class App < Sinatra::Base
  helpers AuthHelpers

  before do
    content_type :json
  end

  get '/' do
    { status: 'ok' }.to_json
  end

  get '/db_ping' do
    result = DB::SUPABASE.table('User_Login_Data').select('id').execute
    { rows_seen: result.data.length }.to_json
  end

  get '/db_ping_gem' do
    client = SupabaseApi::Client.new
    result = client.list('User_Login_Data')
    { rows_seen: result.parsed_response.length }.to_json
  end

  post '/save_game_data' do
    user = require_user!
    body = JSON.parse(request.body.read) rescue halt(400, { detail: 'Invalid JSON' }.to_json)
    game_data = body['game_data']
    halt 400, { detail: 'Missing game_data' }.to_json unless game_data

    result = DB::SUPABASE.table('User_Login_Data').update({ game_data: game_data }).eq('id', user['id']).execute
    halt 500, { detail: 'Failed to save game data' }.to_json if result.data.empty?
    { status: 'ok' }.to_json
  end

  post '/reset_game_data' do
    user = require_user!
    result = DB::SUPABASE.table('User_Login_Data').update({ game_data: GameData::INITIAL }).eq('id', user['id']).execute
    halt 500, { detail: 'Failed to reset game data' }.to_json if result.data.empty?
    { status: 'ok', game_data: GameData::INITIAL }.to_json
  end
end

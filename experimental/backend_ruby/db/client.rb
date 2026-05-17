require 'faraday'

module DB
  class Supabase
    def initialize(base_url, api_key)
      @conn = Faraday.new(url: "#{base_url}/rest/v1") do |f|
        f.request :json
        f.response :json, content_type: /\bjson$/
        f.headers['apikey'] = api_key
        f.headers['Authorization'] = "Bearer #{api_key}"
        f.headers['Accept-Encoding'] = 'identity'
      end
    end

    def table(name)
      QueryBuilder.new(@conn, name)
    end
  end

  class QueryBuilder
    def initialize(conn, table)
      @conn = conn
      @table = table
      @method = :get
      @params = {}
      @body = nil
      @prefer_single = false
    end

    def select(cols = '*')
      @method = :get
      @params[:select] = cols
      self
    end

    def insert(payload)
      @method = :post
      @body = payload
      self
    end

    def update(payload)
      @method = :patch
      @body = payload
      self
    end

    def delete
      @method = :delete
      self
    end

    def eq(column, value)
      @params[column.to_sym] = "eq.#{value}"
      self
    end

    def single
      @prefer_single = true
      self
    end

    def execute
      headers = {}
      headers['Accept'] = 'application/vnd.pgrst.object+json' if @prefer_single
      headers['Prefer'] = 'return=representation' unless @method == :get

      response =
        if @method == :get || @method == :delete
          @conn.public_send(@method, @table, @params, headers)
        else
          @conn.public_send(@method, @table, @body, headers) do |req|
            req.params = @params
          end
        end

      raise APIError.new(response.status, response.body) if response.status >= 400

      Result.new(response.body)
    end
  end

  class APIError < StandardError
    attr_reader :status, :body

    def initialize(status, body)
      @status = status
      @body = body
      super("Supabase #{status}: #{body.inspect}")
    end
  end

  Result = Struct.new(:data)

  SUPABASE = Supabase.new(
    ENV.fetch('SUPABASE_URL'),
    ENV.fetch('SUPABASE_SECRET_KEY'),
  )
end

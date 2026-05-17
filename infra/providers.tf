terraform {
  required_version = ">= 1.5"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    render = {
      source  = "render-oss/render"
      version = "~> 1.0"
    }
  }
}

provider "vercel" {
  # api_token read from VERCEL_API_TOKEN env var
}

provider "render" {
  # api_key read from RENDER_API_KEY env var
  owner_id = "tea-d6rhgucr85hc73a4807g"
}

class Api::V1::UsersController < ApplicationController
  # respond_to :json

  def index
    if hasValidJWT
      all_users = User.select(:id, :firstname, :lastname, :username, :lastloginat)
      render json: {
        status: {
          code: 200, message: "Retrieve all profiles successfully.",
          data: { allUsers: all_users }
        }
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end

  def show
  end

  def update
  end

  private
  def hasValidJWT
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(
          request.headers["Authorization"].split(" ").last,
          ENV["devise_jwt_secret_key"]
        ).first
      current_user = User.find(jwt_payload["sub"])
    end
    current_user.present?
  end
end

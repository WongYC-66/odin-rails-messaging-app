class Api::V1::UsersController < ApplicationController
  respond_to :json

  def index
    if hasValidJWT
      # all_users = User.select(:id, :firstname, :lastname, :username, :lastloginat)
      all_users = User.all
      render json: {
        status: {
          code: 200, message: "Retrieve all profiles successfully.",
          data: { allUsers: all_users }
        }
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Invalid JWT."
      }, status: :unauthorized
    end
  end

  def show
    if hasValidJWT
      query_user = User.find_by(username: params[:username])
      render json: {
        status: {
          code: 200, message: "getting one user by username : #{params[:username]}",
          data: { queryUser: query_user }
        }
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Invalid JWT."
      }, status: :unauthorized
    end
  end

  def update
  end

  private
    def hasValidJWT
      begin
        # Ensure the Authorization header is present and formatted correctly
        if request.headers["Authorization"].present?
          token = request.headers["Authorization"].split(" ").last
          return false if token.blank?

          # Attempt to decode the JWT token
          jwt_payload = JWT.decode(token, ENV["devise_jwt_secret_key"]).first

          # Find the user based on the decoded payload
          current_user = User.find_by(id: jwt_payload["sub"])
          return current_user.present?
        end
        false
      rescue
        false
      end
    end
end

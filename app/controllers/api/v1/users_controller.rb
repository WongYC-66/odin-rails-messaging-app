class Api::V1::UsersController < ApplicationController
  respond_to :json

  def index
    if hasValidJWT
      # all_users = User.select(:id, :firstname, :lastname, :username, :lastloginat)
      all_users = User.all.filter { |user| user != current_user }
      current_user.update_last_login!
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
      current_user.update_last_login!
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
    if !hasValidJWT
      return render json: {
        status: 401,
        message: "Invalid JWT."
      }, status: :unauthorized
    end

    edit_user = User.find_by(username: params[:username])
    if !edit_user.persisted? || edit_user != current_user
      render json: {
        status: 401,
        message: "User not found or un-Authorized."
      }, status: :unauthorized
    end

    edit_user.update(
      firstname: params[:firstName],
      lastname: params[:lastName],
      email: params[:email],
      description: params[:description],
    )

    current_user.update_last_login!

    render json: {
        status: {
          code: 200, message: "success updating one user by username : #{params[:username]}",
          data: { updatedUser: edit_user }
        }
    }, status: :ok
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

class Api::V1::ChatsController < ApplicationController
  respond_to :json

  def index
    if hasValidJWT
      all_chats = Chat
      .joins(:users)
      .where(users: { id: current_user.id })
      .preload(:users)
      .preload(messages: [ :user ])
      .distinct
      .order(lastUpdatedAt: :desc)

      render json: {
        status: {
          code: 200, message: "Retrieve all chats where user involved successfully.",
          data: { allChats: all_chats.as_json }
        }
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Invalid JWT."
      }, status: :unauthorized
    end
  end

  def create
    if !hasValidJWT
      return render json: {
        status: 401,
        message: "Invalid JWT."
      }, status: :unauthorized
    end

    userIds = params[:userIds].sort
    is_group_chat = userIds.length <= 2? false : params[:isGroupChat]

    existing_chat = Chat.joins(:users)
      .where(isGroupChat: false)
      .group("chats.id")
      .having("COUNT(users.id) = ?", userIds.length)
      .where(users: { id: userIds }) #

    existing_chat = existing_chat
      .to_a
      .select { |chat| chat.users.pluck(:id).sort == userIds } # Ensures only matching user IDs
      .first

    if !existing_chat || is_group_chat
      existing_chat = Chat.create(
        name: is_group_chat ? params[:groupName] : "",
        isGroupChat: is_group_chat
      )
      # add users
      userIds.each do |user_id|
        user = User.find_by(id: user_id)
        existing_chat.users << user
      end
    end

    render json: {
      status: {
        code: 200, message: "Chat room created",
        data: { chat: existing_chat }
      }
    }, status: :ok
  end

  def show
    if hasValidJWT
      chat = Chat
       .preload(messages: [ :user ])
       .find_by(id: params[:chat_id])

      render json: {
        status: {
          code: 200, message: "Retrieve one chat successfully.",
          data: { chat: chat.as_json_asc_messages }
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

    chat = Chat.find_by(id: params[:chat_id])
    if chat && chat.users.include?(current_user)
        new_message = current_user.messages.create(text: params[:text])
        chat.messages << new_message
        chat.update(lastUpdatedAt: DateTime.now)
        render json: {
        status: {
          code: 200, message: "post one new message by chatId : #{params[:chat_id]}",
          data: { chat: chat }
        }
    }, status: :ok
    else
        render json: {
        status: 401,
        message: "Chat not found or un-Authorized."
      }, status: :unauthorized
    end
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

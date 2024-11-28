class ApplicationController < ActionController::Base
  respond_to :json

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: %i[username firstname lastname email password confirm_password])
      devise_parameter_sanitizer.permit(:sign_in, keys: %i[username password])
      devise_parameter_sanitizer.permit(:account_update, keys: %i[firstname lastname email description])
    end
end

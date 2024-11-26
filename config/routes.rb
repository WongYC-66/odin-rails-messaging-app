Rails.application.routes.draw do
  # user api
  namespace :api do
    namespace :v1 do
      get "/users/", to: "users#index"
      get "/users/:username", to: "users#show"
      put "/users/:username", to: "users#update"
    end
  end

  # devise_for :users
  devise_for :users, path: "", path_names: {
    sign_in: "/users/sign_in",
    sign_out: "/users/sign_out",
    registration: "/users/sign_up"
  },
  controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }, sign_out_via: [ :get, :post ]

  root "homepage#index"
  get "/*path" => "homepage#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end

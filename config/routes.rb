Rails.application.routes.draw do
  resources :payments, only: [:new, :create] do
    collection do
      post "new", as: "new"
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end

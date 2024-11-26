class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :username, :firstname, :lastname, :description, :lastloginat
end

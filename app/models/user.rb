class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # devise :database_authenticatable, :registerable,
  #        :recoverable, :rememberable, :validatable
  devise :database_authenticatable, :registerable, :recoverable, :validatable, :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :messages

  has_many :chat_participants
  has_many :chats, through: :chat_participants

  def as_json(_options = {})
    {
      id: self.id,
      username: self.username,
      firstName: self.firstname,
      lastName: self.lastname,
      lastLoginAt: self.lastloginat,
      description: self.description,
      email: self.email
     }
  end
end

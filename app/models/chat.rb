class Chat < ApplicationRecord
  has_many :messages

  has_many :chat_participants
  has_many :users, through: :chat_participants

  def as_json(_options = {})
    {
      id: self.id,
      name: self.name,
      isGroupChat: self.isGroupChat,
      lastUpdatedAt: self.lastUpdatedAt,
      users: self.users,
      messages: self.messages.sort_by(&:created_at).reverse
    }
  end

  def as_json_asc_messages(_options = {})
    {
      id: self.id,
      name: self.name,
      isGroupChat: self.isGroupChat,
      lastUpdatedAt: self.lastUpdatedAt,
      users: self.users,
      messages: self.messages.sort_by(&:created_at)
    }
  end
end

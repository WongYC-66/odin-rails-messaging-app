class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chat

  def as_json(_options = {})
    {
      text: self.text,
      timestamp: self.created_at,
      user: self.user
    }
  end
end

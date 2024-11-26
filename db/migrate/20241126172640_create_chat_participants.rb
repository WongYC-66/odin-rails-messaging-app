class CreateChatParticipants < ActiveRecord::Migration[8.0]
  def change
    create_table :chat_participants do |t|
      t.belongs_to :chat
      t.belongs_to :user
      t.timestamps
    end
  end
end

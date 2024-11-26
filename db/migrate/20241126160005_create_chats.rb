class CreateChats < ActiveRecord::Migration[8.0]
  def change
    create_table :chats do |t|
      t.string :name
      t.boolean :isGroupChat
      t.timeDate :lastUpdatedAt
      t.timestamps
    end
  end
end

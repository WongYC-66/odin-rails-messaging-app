class CreateChats < ActiveRecord::Migration[8.0]
  def change
    create_table :chats do |t|
      t.string :name,               default: ""
      t.boolean :isGroupChat,       default: false
      t.datetime :lastUpdatedAt,    default: DateTime.now
      t.timestamps
    end
  end
end

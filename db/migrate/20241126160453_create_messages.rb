class CreateMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :messages do |t|
      t.string :text,     null: false
      t.references :user, null: false
      t.references :chat, null: false
      t.timestamps
    end
  end
end

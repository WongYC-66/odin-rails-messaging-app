class CreateMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :messages do |t|
      t.string :text
      t.references :user
      t.references :chat
      t.timestamps
    end
  end
end

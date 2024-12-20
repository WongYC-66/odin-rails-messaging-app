# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

usernames = [
  'admin1', 'user1', 'user2', 'user3',
  'user4', 'user5', 'user6', 'user7',
  'user8', 'user9', 'user10', 'user11',
  'user12', 'user13', 'user14', 'guest'
]

puts "Seeding begins ... "

puts "Creating users"
usernames.each do |username|
  User.create!(
    username: username,
    firstname: Faker::Name.first_name,
    lastname: Faker::Name.last_name,
    password: "123456",
    password_confirmation: "123456",
    description: "Generated by faker, " + Faker::Lorem.sentence(word_count: 5),
    email: Faker::Internet.email(name: username)
  )
  puts username
end

puts "Creating chats"
# single chat
chat1 = Chat.create(name: '', isGroupChat: false, lastUpdatedAt: DateTime.now)
chat1.users << User.find_by(username: usernames[0])
chat1.users << User.find_by(username: usernames[1])
chat1.messages << User.find_by(username: usernames[0]).messages.create(text: "hi this is chat1 , posted by admin1")

# single chat
chat2 = Chat.create(name: '', isGroupChat: false, lastUpdatedAt: DateTime.now)
chat2.users << User.find_by(username: usernames[0])
chat2.users << User.find_by(username: usernames[3])
chat2.messages << User.find_by(username: usernames[3]).messages.create(text: "hi this is chat2 , posted by user3")

# single chat
chat3 = Chat.create(name: '', isGroupChat: false, lastUpdatedAt: DateTime.now)
chat3.users << User.find_by(username: usernames[0])
chat3.users << User.find_by(username: usernames[1])
chat3.messages << User.find_by(username: usernames[1]).messages.create(text: "hi this is chat3 , posted by user1")

# group chat
chat4 = Chat.create(name: 'testing group chat name', isGroupChat: true, lastUpdatedAt: DateTime.now)
chat4.users << User.find_by(username: usernames[0])
chat4.users << User.find_by(username: usernames[1])
chat4.users << User.find_by(username: usernames[2])
chat4.users << User.find_by(username: usernames[3])
chat4.users << User.find_by(username: usernames[4])
chat4.users << User.find_by(username: usernames[5])
chat4.messages << User.find_by(username: usernames[0]).messages.create(text: "hi this is groupchat message , posted by admin1")
chat4.messages << User.find_by(username: usernames[1]).messages.create(text: "hi this is groupchat message , posted by user1")

# single chat
chat5 = Chat.create(name: '', isGroupChat: false, lastUpdatedAt: DateTime.now)
chat5.users << User.find_by(username: usernames[2])
chat5.users << User.find_by(username: usernames[3])
chat5.messages << User.find_by(username: usernames[2]).messages.create(text: "hi this is chat5 , posted by user2, admin1 shall have no access")

# Visitor Chat room creating, visitor index=15,  1-to-1
guestUser = User.find_by(username: usernames[-1])
fiveRandomUsernames = usernames.slice(0 ... -1).shuffle!.slice(0 ... 5)
fiveRandomUsernames.each do |username|
  new_chat = Chat.create(name: '', isGroupChat: false, lastUpdatedAt: DateTime.now)
  new_chat.users << guestUser
  new_chat.users << User.find_by(username: username)
  new_chat.messages << User.find_by(username: username).messages.create(text: "hi, im #{username}. How are u?")
  new_chat.messages << guestUser.messages.create(text: "hi....")
end

# Vistor Group Chat room creating.
fourRandomUsernames = usernames.slice(0 .. -2).shuffle!.slice(0 ... 4)
chat12 = Chat.create(name: 'My Friends', isGroupChat: true, lastUpdatedAt: DateTime.now)
chat12.users << guestUser
fourRandomUsernames.each do |username|
  chat12.users << User.find_by(username: username)
  chat12.messages << User.find_by(username: username).messages.create(text: "hi, im #{username}. #{Faker::Lorem.sentence(word_count: 5)}")
end

puts "Seeding ended."

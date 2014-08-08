require "sinatra"
require "sinatra/json"

get "/" do
  erb :app
end

post "/play/:id" do
  `osascript -e 'tell application "Spotify" to play track "#{params[:id]}"'`
end

post "/pause" do
  `osascript -e 'tell application "Spotify" to pause track'`
end

post "/resume" do
  `osascript -e 'tell application "Spotify" to play'`
end

get "/current" do
  artist = `osascript -e 'tell application "Spotify" to artist of current track as string'`
  album = `osascript -e 'tell application "Spotify" to album of current track as string'`
  track = `osascript -e 'tell application "Spotify" to name of current track as string'`
  status = `osascript -e 'tell application "Spotify" to player state as string'`

  json({ :artist => artist, :album => album, :track => track, :status => status })
end

# nodetf-mcbgs
Minecraft Game Server for Authentication and Game Files

## Usage

```sh
mcbgs [<port>]
```

- `port`: Port of server: Default is 43434

## For Clients

either use or replace the IP address of the server. That means every instance of `login.minecraft.net`, `minecraft.net` and `s3.amazonaws.com` if you want to replace

## Server Structure

### `skins` Folder

contains skins of players, file format is `<playername>.png`

### `cape` Folder

contains capes of players, file format is `<playername>.png`

### `resources` Folder

contains important files the client will download upon boot. Normally it's just the audio/music files

### `users` Folder

contains registered Users, file format is `<playername>.json`. The JSON has the following structure:
```ts
interface UserData
{
    id: string // unique id of player
    username: string // username of player like filename
    password: string // raw password of player (YES, NOT HASHED)
    sessionId: string | "-" // current session id, "-" means the player hasn't logged in yet
    serverId: string | "-" // current server id, "-" means the player is not in a server
}
```
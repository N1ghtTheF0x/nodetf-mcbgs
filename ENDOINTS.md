# Assets

"http://s3.amazonaws.com/MinecraftSkins/<playername>.png" - Skin getter for Multiplayer [Returns PNG]
"http://s3.amazonaws.com/MinecraftCloaks/<playername>.png" - Cape getter for Single-/Multiplayer [Returns PNG]
"http://s3.amazonaws.com/MinecraftResources/" - XML with following structure:

[some kind of header]
<Contents>
	<Key>{relative path to folder/file of this url}</Key>
	<LastModified>{Year}-{Month}-{Day}T{Hours}:{Minutes}:{Seconds}.{Miliseconds?}Z</LastModified>
	<ETag>"{hash of file?}"</ETag>
	<Size>{size of file, 0 if directory}</Size>
	<StorageClass>STANDARD</StorageClass>
</Contents>
[more Contents Tags...]

# Servers

"http://www.minecraft.net/game/joinserver.jsp?user=<playername>&sessionId=<sessionid>&serverId=<servername?>" - Login check to join server [Returns ok/OK for success, failure on other]
"http://www.minecraft.net/game/checkserver.jsp?user=<playername>&serverId=<servername?>" - Check if player is in a server [Returns YES, else not YES]

# Session

"https://login.minecraft.net?user=<username>&password=<password>&version=<launcherversion>" POST with Content-Type "application/x-www-form-urlencoded" - Userlogin of Launcher [Returns <unixtimestamp of game version>:<download-ticket>:<username>:<sessionId>:<uniqueUserId>, "Old version" when version is lower than on server, "Bad response" when parameter missing, "Bad login" when login information wrong, "User not premium" when not owning game, "Account migrated, use e-mail" when migrated to Mojang account]
"https://login.minecraft.net/session?name<username>&session=<sessionId>" - Checks if session is valid. Send every 6000 ticks (6000 / 20 = 300 seconds = 5 minutes) [Returns status code, unlicensed copy when 400]

# Auth

"https://minecraft.net/login.jsp?username=<username>&password=<password>" POST 
"https://minecraft.net/register.jsp?username=<username>&password1=<password>&password2=<password>&email=<email>" POST
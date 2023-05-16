import Manager from "../manager"
import { LauncherLoginRequest } from "../request"
import MinecraftGameServer from "../server"
import { authenticateUser } from "./login"

class SessionManager extends Manager
{
    constructor(server: MinecraftGameServer)
    {
        super("Session",server)
    }
    authenticateUser(req: LauncherLoginRequest)
    {
        return authenticateUser(this.server.user,req)
    }
}

export default SessionManager
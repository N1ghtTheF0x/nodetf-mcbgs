import { Config } from "../config"
import Manager from "../manager"
import { CheckServerRequest, JoinServerRequest } from "../request"
import MinecraftGameServer from "../server"
import { isUserInServer } from "./check"
import { canJoinServer } from "./join"

class ServerManager extends Manager
{
    constructor(server: MinecraftGameServer)
    {
        super("Server",server)
    }
    isUserInServer(req: CheckServerRequest)
    {
        return isUserInServer(this.server.user,req)
    }
    canJoinServer(req: JoinServerRequest)
    {
        return canJoinServer(this.server.user,req)
    }
}

export default ServerManager
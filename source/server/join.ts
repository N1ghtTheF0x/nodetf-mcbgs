import { PATH_GAME_JOIN } from "../endpoint"
import { JoinServerRequest } from "../request"
import UserManager, { INVALID_ID } from "../user"

type InvaildParameter = "INVALID PARAMETER"
type Parameters = keyof JoinServerRequest
export type InvaildJoinServerRequest = `${InvaildParameter} ${Uppercase<Parameters>}`

export function parseJoinRequestParameters(url: string): JoinServerRequest | InvaildJoinServerRequest
{
    const params = new URLSearchParams(url.replace(PATH_GAME_JOIN,""))

    const user = params.get("user")
    const sessionId = params.get("sessionId")
    const serverId = params.get("serverId")

    if(!user) return "INVALID PARAMETER USER"
    if(!sessionId) return "INVALID PARAMETER SESSIONID"
    if(!serverId) return "INVALID PARAMETER SERVERID"

    return {user,serverId,sessionId}
}

export function canJoinServer(userm: UserManager,req: JoinServerRequest)
{
    const user = userm.read(req.user)
    if(!user) return `User ${req.user} does not exist!`

    if(user.serverId == req.serverId) return "User is already in the server!"
    if(user.serverId != INVALID_ID) return `User is in ${user.serverId}!`
    if(user.sessionId == INVALID_ID) return "User is in a invalid session!"
    if(user.sessionId != req.sessionId) return "User is already in a different session!"

    userm.update(req.user,"serverId",req.serverId)

    return "OK"
}
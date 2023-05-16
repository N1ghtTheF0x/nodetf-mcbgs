import { PATH_GAME_CHECK } from "../endpoint"
import { CheckServerRequest } from "../request"
import UserManager from "../user"

type InvaildParameter = "INVALID PARAMETER"
type Parameters = keyof CheckServerRequest
export type InvaildJoinServerRequest = `${InvaildParameter} ${Uppercase<Parameters>}`

export function parseCheckRequestParameters(url: string): CheckServerRequest | InvaildJoinServerRequest
{
    const params = new URLSearchParams(url.replace(PATH_GAME_CHECK,""))

    const user = params.get("user")
    const sessionId = params.get("sessionId")

    if(!user) return "INVALID PARAMETER USER"
    if(!sessionId) return "INVALID PARAMETER SESSIONID"

    return {user,sessionId}
}

export function isUserInServer(userm: UserManager,req: CheckServerRequest)
{
    const user = userm.read(req.user)
    if(!user) return "NO"
    if(user.sessionId != req.sessionId) return "NO"

    return "YES"
}
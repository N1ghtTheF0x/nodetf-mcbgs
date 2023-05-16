import { randomBytes } from "crypto"
import { PATH_LOGIN_GET } from "../endpoint"
import UserManager from "../user"
import { LauncherLoginRequest } from "../request"
import { LauncherLoginResponse } from "../response"
import { B173_RELEASE_DATE, LAUNCHER_VERSION } from "../utils"

export type LauncherLoginResponseString = `${number}:${string}:${string}:${string}:${string}`

export function parseLauncherLoginParameters(url: string): LauncherLoginRequest | string
{
    const params = new URLSearchParams(url.replace(PATH_LOGIN_GET,""))

    const user = params.get("user")
    const password = params.get("password")
    const version = params.get("version")

    if(!user || !password || !version) return "Bad Response"
    if(parseInt(version) < LAUNCHER_VERSION) return "Old version"

    return {user,password,version: parseInt(version)}
}

export function createLauncherLoginReponse(res: LauncherLoginResponse): LauncherLoginResponseString
{
    return `${res.gameVersionTime}:${res.downloadTicket}:${res.username}:${res.sessionId}:${res.userId}`
}

export function authenticateUser(userm: UserManager,req: LauncherLoginRequest): LauncherLoginResponse | string
{
    const user = userm.read(req.user)
    if(!user) return "Bad login"
//  if(!user.premium) return "User not premium"
    if(user.password != req.password) return "Bad login"

    user.sessionId = randomBytes(32).toString("base64")

    return {
        gameVersionTime: B173_RELEASE_DATE.getTime(),
        sessionId: user.sessionId,
        userId: user.id,
        username: user.username,
        downloadTicket: "deprecated"
    }
}
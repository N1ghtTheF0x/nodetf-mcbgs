export interface UsernameRequest
{
    username: string
}

export type SkinRequest = UsernameRequest
export type CapeRequest = UsernameRequest

export interface CheckServerRequest
{
    user: string
    sessionId: string
}

export interface JoinServerRequest extends CheckServerRequest
{
    serverId: string
}

export interface LauncherLoginRequest
{
    user: string
    password: string
    version: number
}

export type LauncherCheckRequest = CheckServerRequest
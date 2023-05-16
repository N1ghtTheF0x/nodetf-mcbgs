import { existsSync, readFileSync } from "fs"

export interface Config
{
    skinsFolder: string
    capesFolder: string
    resourcesFolder: string
    usersFolder: string
    port: number
    host: string
}

export const DEFAULT_CONFIG: Config = {
    skinsFolder: "skins",
    capesFolder: "capes",
    resourcesFolder: "resources",
    usersFolder: "users",
    port: 43434,
    host: "127.0.0.1"
}

export function readConfig(path: string)
{
    const content = existsSync(path) ? readFileSync(path,"utf-8") : null
    if(!content) return {}

    return JSON.parse(content) as Config
}
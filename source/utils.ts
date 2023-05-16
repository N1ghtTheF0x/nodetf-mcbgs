import { existsSync, mkdirSync, readFileSync, statSync } from "fs"
import { dirname, resolve } from "path"

export function makePathSafe(string: string)
{
    return string
    .replaceAll(/\/|\.\.|\./g,"_")
}

export function removeSlash(string: string)
{
    return string.startsWith("/") ? string.substring(1) : string
}

export function createFolder(path: string)
{
    const dirpath = resolve(process.cwd(),path)
    if(!existsSync(dirpath)) mkdirSync(dirpath,{recursive: true})
}

export function readFile(path: string)
{
    if(!existsSync(path)) return null
    const stats = statSync(path)
    if(!stats.isFile()) return null
    return readFileSync(path)    
}

export const B173_RELEASE_DATE: Readonly<Date> = new Date(2011,6,8)
export const LAUNCHER_VERSION = 13

export const IPV4_REGEX = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/g
export const IPV6_REGEX = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/g

export function stringifyIP(ip: string)
{
    return IPV6_REGEX.test(ip) ? `[${ip}]` : ip
}
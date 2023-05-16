import { createHash } from "crypto"
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs"
import { basename, extname, resolve } from "path"
import Manager from "./manager"
import MinecraftGameServer from "./server"

export const INVALID_ID = "-"

export interface UserData
{
    id: string
    username: string
    password: string
    sessionId: string
    serverId: string
}

class UserManager extends Manager
{
    get folder(){return this.server.config.usersFolder}
    static makeUniqueId(username: string)
    {
        return createHash("sha256").update(username).update(Buffer.from([Date.now()])).digest("hex")
    }
    constructor(server: MinecraftGameServer)
    {
        super("User",server)
    }
    create(username: string,password: string)
    {
        if(this.exists(username)) 
        {
            this.log(`Tried to create a new User with a already existing username!`)
            return "User already exists!"
        }
        const data: UserData = {
            username,password,
            serverId: INVALID_ID,sessionId: INVALID_ID,
            id: UserManager.makeUniqueId(username)
        }
        this.write(username,data)
        this.log(`User created: ${username} as ${data.id}`)
        return "OK"
    }
    exists(username: string)
    {
        return existsSync(resolve(this.folder,`${username}.json`))
    }
    read(username: string): UserData | null
    {
        const fullpath = resolve(this.folder,`${username}.json`)
        const content = existsSync(fullpath) ? readFileSync(fullpath,"utf-8") : null
        if(!content) return null

        return JSON.parse(content)
    }
    write(username: string,data: UserData)
    {
        this.log(`Writing data to ${username}...`)
        const fullpath = resolve(this.folder,`${username}.json`)
        return writeFileSync(fullpath,JSON.stringify(data,undefined,4))
    }
    update<Key extends keyof UserData>(username: string,key: Key,value: UserData[Key])
    {
        const curData = this.read(username)
        if(!curData) 
        {
            this.log(`Couldn't update user ${username}! User does not exist!`)
            return false
        }
        this.log(`Updating property "${key}" to "${key == "password" ? "HIDDEN" : value}"`)
        curData[key] = value
        if(key == "username")
        {
            const oldUsername = username
            const newUsername = value
            this.write(newUsername,curData)
            rmSync(resolve(this.folder,`${oldUsername}.json`),{force: true})
            return true
        }
        this.write(username,curData)
        return true
    }
    getAllUsernames()
    {
        const users = readdirSync(this.folder)
        return users.map((relpath) => basename(relpath,extname(relpath)))
    }
    getAllUsers()
    {
        const users = this.getAllUsernames()
        return users.map((username) => this.read(username) as UserData)
    }
    resetState()
    {
        const users = this.getAllUsernames()
        for(const user of users)
        {
            this.update(user,"serverId",INVALID_ID)
            this.update(user,"sessionId",INVALID_ID)
        }
    }
}

export default UserManager
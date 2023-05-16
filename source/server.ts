import { IncomingMessage, Server, ServerResponse, createServer } from "http"
import { PATH_ASSETS_CAPES, PATH_ASSETS_RESOURCES, PATH_ASSETS_SKINS, PATH_GAME_CHECK, PATH_GAME_JOIN, PATH_LOGIN_CHECK, PATH_LOGIN_GET } from "./endpoint"
import { basename, extname, resolve } from "path"
import { createFolder, stringifyIP } from "./utils"
import { existsSync, readFileSync, statSync } from "fs"
import { parseJoinRequestParameters } from "./server/join"
import { parseCheckRequestParameters } from "./server/check"
import { createLauncherLoginReponse, parseLauncherLoginParameters } from "./session/login"
import { Config, DEFAULT_CONFIG } from "./config"
import AssetsManager from "./assets"
import ServerManager from "./server"
import UserManager from "./user"
import SessionManager from "./session"

class MinecraftGameServer
{
    #http: Server = createServer()
    readonly config: Config
    readonly user: UserManager
    readonly assets: AssetsManager
    readonly game: ServerManager
    readonly session: SessionManager
    constructor(config: Partial<Config>)
    {   
        this.config = {...DEFAULT_CONFIG,...config}
        this.user = new UserManager(this)
        this.assets = new AssetsManager(this)
        this.game = new ServerManager(this)
        this.session = new SessionManager(this)
        this.#http.on("request",(req,res) => this.#onRequest(req,res))
    }
    #onRequest(req: IncomingMessage,res: ServerResponse)
    {
        const url = String(req.url), method = req.method ?? "GET"
        if(url.startsWith(PATH_ASSETS_SKINS))
            return this.#handleSkin(basename(url,extname(url)),res)
        else if(url.startsWith(PATH_ASSETS_CAPES))
            return this.#handleCape(basename(url,extname(url)),res)
        else if(url == PATH_ASSETS_RESOURCES || url == `${PATH_ASSETS_RESOURCES}/`)
            return this.#handleResources(res)
        else if(url.startsWith(PATH_ASSETS_RESOURCES))
            return this.#handleResource(url,res)
        else if(url.startsWith(PATH_GAME_JOIN))
            return this.#handleJoinServer(url,res)
        else if(url.startsWith(PATH_GAME_CHECK))
            return this.#handleCheckServer(url,res)
        else if(url.startsWith(PATH_LOGIN_GET))
            if(method.toUpperCase() == "POST") return this.#handleLauncherLogin(url,res)
            // else handle root goes here...
        return this.#notFound(res)
    }
    #handleSkin(skin: string,res: ServerResponse)
    {
        const file = this.assets.getSkin({username: skin})
        if(file) this.#sendData(file,"image/png",res)
        else this.#notFound(res)
    }
    #handleCape(cape: string,res: ServerResponse)
    {
        const file = this.assets.getCape({username: cape})
        if(file) this.#sendData(file,"image/png",res)
        else this.#notFound(res)
    }
    #handleResource(path: string,res: ServerResponse)
    {
        const filepath = resolve(this.assets.resourcesFolder,path.replace(`${PATH_ASSETS_RESOURCES}/`,""))
        if(!statSync(filepath).isFile()) return this.#notFound(res)
        const file = existsSync(filepath) ? readFileSync(filepath) : null
        if(file) this.#sendData(file,undefined,res)
        else this.#notFound(res)
    }
    #handleResources(res: ServerResponse)
    {
        const page = this.assets.getResources()
        this.#okStatus(res)
        res.setHeader("Content-Type","application/xml")
        res.setHeader("Content-Length",page.length)
        res.end(page)
    }
    #handleJoinServer(url: string,res: ServerResponse)
    {
        const params = parseJoinRequestParameters(url)
        res.statusCode = 200
        res.statusMessage = "OK"
        if(typeof params == "string") return res.end(params)
        res.end(this.game.canJoinServer(params))
    }
    #handleCheckServer(url: string,res: ServerResponse)
    {
        const params = parseCheckRequestParameters(url)
        this.#okStatus(res)
        if(typeof params == "string") return res.end(params)
        res.end(this.game.isUserInServer(params))
    }
    #handleLauncherLogin(url: string,res: ServerResponse)
    {
        const params = parseLauncherLoginParameters(url)
        this.#okStatus(res)
        if(typeof params == "string") return res.end(params)
        const response = this.session.authenticateUser(params)
        if(typeof response == "string") return res.end(response)
        res.end(createLauncherLoginReponse(response))
    }
    #sendData(data: Buffer | string,type: string | undefined,res: ServerResponse)
    {
        this.#okStatus(res)
        if(type) res.setHeader("Content-Type",type)
        res.setHeader("Content-Length",data.length)
        res.end(data)
    }
    #okStatus(res: ServerResponse)
    {
        res.statusCode = 200
        res.statusMessage = "OK"
    }
    #notFound(res: ServerResponse)
    {
        res.statusCode = 404
        res.statusMessage = "NOT FOUND"
        res.end()
    }
    start()
    {
        createFolder(this.config.skinsFolder)
        createFolder(this.config.capesFolder)
        createFolder(this.config.resourcesFolder)
        createFolder(this.config.usersFolder)
        this.user.resetState()
        this.#http.listen(this.config.port,this.config.host,() => console.info(`Listening to http://${stringifyIP(this.config.host)}:${this.config.port}...`))
    }
    stop()
    {
        console.info("Closing server...")
        this.#http.close()
    }
    restart()
    {
        this.stop()
        this.start()
    }
}

export default MinecraftGameServer
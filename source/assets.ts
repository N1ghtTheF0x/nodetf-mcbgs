import { resolve } from "path"
import Manager from "./manager"
import { CapeRequest, SkinRequest } from "./request"
import MinecraftGameServer from "./server"
import { makePathSafe, readFile } from "./utils"
import { readdirSync, statSync } from "fs"
import { createHash } from "crypto"
import { tag } from "./html"

class AssetsManager extends Manager
{
    get capeFolder(){return this.server.config.capesFolder}
    get skinsFolder(){return this.server.config.skinsFolder}
    get resourcesFolder(){return this.server.config.resourcesFolder}
    constructor(server: MinecraftGameServer)
    {
        super("Assets",server)
    }
    getCape(req: CapeRequest)
    {
        const path = resolve(this.capeFolder,`${makePathSafe(req.username)}.png`)
        return readFile(path)
    }
    #createMD5Hash(input: string)
    {
        return createHash("md5").update(input).digest("hex")
    }
    #createContent(path: string)
    {
        const stats = statSync(resolve(this.resourcesFolder,path))
        const relPath = (stats.isDirectory() ? `${path}/` : path).replace(`${this.resourcesFolder}/`,"")

        return tag("Contents",[
            tag("Key",[relPath]),
            tag("LastModified",[stats.mtime.toISOString()]),
            tag("ETag",[`"${this.#createMD5Hash(relPath)}"`]),
            tag("Size",[String(stats.isDirectory() ? 0 : stats.size)]),
            tag("StorageClass",["STANDARD"])
        ])
    }
    #createContents(path: string)
    {
        const fullpath = resolve(this.resourcesFolder,path)

        const contents: string[] = []

        const handles = readdirSync(fullpath,{withFileTypes: true})

        for(const handle of handles)
        {
            const handlePath = resolve(fullpath,handle.name)
            if(handle.isDirectory()) contents.push(this.#createContent(fullpath),...this.#createContents(handlePath))
            else if(handle.isFile()) contents.push(this.#createContent(handlePath))
        }

        return contents
    }
    getResources()
    {
        const contents: string[] = []

        const handles = readdirSync(this.resourcesFolder)

        for(const handle of handles)
            contents.push(this.#createContent(resolve(this.resourcesFolder,handle)),...this.#createContents(handle))

        return tag("ListBucketResult",[
            tag("Name",["MinecraftResources"]),
            tag("Prefix"),
            tag("Marker"),
            tag("MaxKeys",[String(1000)]),
            tag("IsTruncated",[String(false)]),
            ...contents
            ],
            {xlmns: "http://s3.amazonaws.com/doc/2006-03-01/"}
        )
    }
    getSkin(req: SkinRequest)
    {
        const path = resolve(this.skinsFolder,`${makePathSafe(req.username)}.png`)
        return readFile(path)
    }
}

export default AssetsManager
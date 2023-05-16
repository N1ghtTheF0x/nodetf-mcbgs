import MinecraftGameServer from "./server"

abstract class Manager
{
    constructor(readonly name: string,readonly server: MinecraftGameServer)
    {

    }
    log(...data: any)
    {
        const date = new Date()
        console.info(`[${date.toLocaleDateString()}, ${date.toLocaleTimeString()}][${this.name}]`,...data)
    }
}

export default Manager
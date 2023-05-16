import { resolve } from "path"
import { readConfig } from "./config"
import MinecraftGameServer from "./server"

const configFile = process.argv[2]

const server = new MinecraftGameServer(configFile ? readConfig(resolve(process.cwd(),configFile)) : {})

server.start()
function parseProperties(props: Record<string,any>)
{
    const entries = Object.entries(props)
    if(entries.length == 0) return ""
    var properties = ""

    for(const [key,value] of entries)
        properties += ` ${key}="${value}"`

    return properties
}


export const tag = (name: string,value: string[] = [],properties: Record<string,any> = {}) => `<${name+parseProperties(properties)}>${value.join("")}</${name}>`
export const document = (content: string[]) => tag("html",content)
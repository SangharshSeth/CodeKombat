export const DefaultValues = (language: string, data: string) => {
    switch (language.toLowerCase()) {
        case "javascript":
            return `/*\n${data}\n*/`
        case "python":
            return `'''\n${data}\n'''`
        case "java":
            return `/*\n${data}\n*/`
        case "c++":
            return `/**\n${data}\n*/`
        case "go":
            return `/*\n${data}\n*/`
        case "swift":
            return `/**\n${data}\n*/`
        case "kotlin":
            return `/**\n${data}\n*/`
        default:
            return data
    }
}
export interface EnvConf {
    getAppPort(): number
    getNodeEnv(): string
    getJwtSecret(): string
    getJwtExpiresInSeconds(): number
}
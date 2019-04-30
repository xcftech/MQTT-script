export declare class InfluxLogin {
    readonly host: string;
    readonly port: number;
    readonly username: string;
    readonly password: string;
    readonly mqttBroker: string;
    constructor(database?: string, host?: string, port?: number, username?: string, password?: string, mqttBroker?: string);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfluxLogin {
    constructor(database = 'ruuvi', host = 'live.ojousima.net', port = 8086, username = 'otso', password = 'YgL69MBmgKMD6p4kMzaVi9f7L', mqttBroker = 'playground.ruuvi.com') {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.mqttBroker = mqttBroker;
    }
}
exports.InfluxLogin = InfluxLogin;

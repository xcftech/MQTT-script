"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const influx_1 = require("influx");
const config_1 = require("../config");
const login = new config_1.InfluxLogin();
const measurementName = 'ruuvi_gwstats';
/*
[ {
  "timestamp" : "2019-04-30T12:35:00Z",
  "type" : "Gateway",
  "mac" : "AC233FC005D8",
  "gatewayFree" : 64,
  "gatewayLoad" : 0.24
}
*/
exports.GWStatOptions = {
    database: 'mqttgwstats',
    host: login.host,
    password: login.password,
    port: login.port,
    schema: [
        {
            fields: {
                gatewayFree: influx_1.FieldType.INTEGER,
                gatewayLoad: influx_1.FieldType.FLOAT,
                gatewayMac: influx_1.FieldType.INTEGER,
                gatewayMsgs: influx_1.FieldType.INTEGER,
                gatewayUniq: influx_1.FieldType.INTEGER,
            },
            measurement: measurementName,
            tags: ['gatewayID'],
        },
    ],
    username: login.username,
};
function GwStatusToInflux(gwstats) {
    const data = {
        fields: {
            gatewayFree: gwstats.gatewayFree,
            gatewayLoad: gwstats.gatewayLoad,
            gatewayMac: parseInt(gwstats.mac, 16),
        },
        measurement: measurementName,
        tags: { gatewayID: gwstats.mac },
    };
    return data;
}
exports.GwStatusToInflux = GwStatusToInflux;

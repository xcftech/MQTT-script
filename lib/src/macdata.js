"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const influx_1 = require("influx");
const config_1 = require("../config");
const login = new config_1.InfluxLogin();
const measurementName = 'ruuvi_macstats';
/*
[ {
  "timestamp" : "2019-04-30T12:35:00Z",
  "type" : "Gateway",
  "mac" : "AC233FC005D8",
  "gatewayFree" : 64,
  "gatewayLoad" : 0.24
}
*/
exports.MacStatOptions = {
    database: 'macstats',
    host: login.host,
    password: login.password,
    port: login.port,
    schema: [
        {
            fields: {
                latency: influx_1.FieldType.INTEGER,
                mac: influx_1.FieldType.INTEGER,
            },
            measurement: measurementName,
            tags: ['mac', 'gatewayID']
        },
    ],
    username: login.username,
};
function MacStatusToInflux(macstats) {
    const data = {
        fields: {
            latency: macstats.latency,
            mac: parseInt(macstats.mac, 16),
        },
        measurement: measurementName,
        tags: { 'mac': macstats.mac },
    };
    return data;
}
exports.MacStatusToInflux = MacStatusToInflux;

import { FieldType, IPoint, ISingleHostConfig } from 'influx';
import { InfluxLogin } from '../config';

const login = new InfluxLogin();
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

export const GWStatOptions: ISingleHostConfig = {
  database: 'mqttgwstats',
  host: login.host,
  password: login.password,
  port: login.port,
  schema: [
    {
      fields: {
        gatewayFree: FieldType.INTEGER,
        gatewayLoad: FieldType.FLOAT,
        gatewayMac:  FieldType.INTEGER,
        gatewayMsgs: FieldType.INTEGER,
        gatewayUniq: FieldType.INTEGER,
      },
      measurement: measurementName,
      tags: ['gatewayID']
    },
  ],
  username: login.username,
};

export function GwStatusToInflux(gwstats: any): IPoint {

  const data: IPoint = {
    fields: {
        gatewayFree: gwstats.gatewayFree,
        gatewayLoad: gwstats.gatewayLoad,
        gatewayMac:  parseInt(gwstats.mac, 16),
    },
    measurement: measurementName,
    tags: {'gatewayID': gwstats.mac},
  };

  return data;
}
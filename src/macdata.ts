import { FieldType, IPoint, ISingleHostConfig } from 'influx';
import { InfluxLogin } from '../config';

const login = new InfluxLogin();
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

export const MacStatOptions: ISingleHostConfig = {
  database: 'macstats',
  host: login.host,
  password: login.password,
  port: login.port,
  schema: [
    {
      fields: {
        latency: FieldType.INTEGER,
        mac: FieldType.INTEGER,
      },
      measurement: measurementName,
      tags: ['mac', 'gatewayID'],
    },
  ],
  username: login.username,
};

export function MacStatusToInflux(macstats: any): IPoint {
  const data: IPoint = {
    fields: {
      latency: macstats.latency,
      mac: parseInt(macstats.mac, 16),
    },
    measurement: measurementName,
    tags: { tagID: macstats.mac },
  };

  return data;
}

import { ISingleHostConfig } from "influx";

export class InfluxLogin {
  public readonly host: string;
  public readonly port: number;
  // Leave username and pw as '' if not used
  public readonly username: string;
  public readonly password: string;

  public readonly mqttBroker: string;

  public constructor(
    database: string = 'ruuvi',
    host: string = 'live.ojousima.net',
    port: number = 8086,
    username: string = 'otso',
    password: string = 'YgL69MBmgKMD6p4kMzaVi9f7L',
    mqttBroker: string = 'playground.ruuvi.com'
  ) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.mqttBroker = mqttBroker;
  }
}
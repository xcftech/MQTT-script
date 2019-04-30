import { InfluxLogin } from '../config';
import * as fs from 'fs';
import { FieldType, InfluxDB as Influx, IPoint, ISingleHostConfig, toNanoDate } from 'influx';
import * as mqtt from 'mqtt';
import { df3parser, df5parser, RuuviTagBroadcast } from 'ojousima.ruuvi_endpoints.ts';
import * as os from 'os';
import { GwStatusToInflux, GWStatOptions } from './gwdata';
import { MacStatusToInflux, MacStatOptions } from './macdata';

// Setup database connection
/*
const ruuviDB = new Influx(RuuviOptions);
ruuviDB.getDatabaseNames().then(names => {
  const dbname: string = RuuviOptions.database ? RuuviOptions.database : 'misc';
  if (0 > names.indexOf(dbname)) {
    return ruuviDB.createDatabase(dbname);
  }
});
*/
/*
Noble.on('discover', peripheral => {
  const advertisement = peripheral.advertisement;
  const id = peripheral.id;
  const localName = advertisement.localName;
  const txPowerLevel = advertisement.txPowerLevel;
  const manufacturerData = advertisement.manufacturerData;
  const serviceData = advertisement.serviceData;
  const serviceUuids = advertisement.serviceUuids;
  const rssi = peripheral.rssi;
  const timestamp = Date.now();

  if (undefined === manufacturerData) {
    return;
  }

  // Parse manufacturer ID
  const view = new DataView(manufacturerData.buffer);
  // Parse manufacturer ID
  const manufacturerID: Uint8Array = Uint8Array.from(advertisement.manufacturerData.slice(0, 2));

  // If ID is Ruuvi Innovations 0x0499
  if (manufacturerID[0] === 0x99 && manufacturerID[1] === 0x04) {
    const data: Uint8Array = Uint8Array.from(peripheral.advertisement.manufacturerData.slice(2));
    const now = new Date().getTime();

    // If data is Ruuvi DF5 data
    if (0x05 === data[0]) {
      try {
        const RuuviData: RuuviTagBroadcast = df5parser(data);
        const sample: IPoint = RuuviTagBroadcastToInflux(RuuviData);
        if (undefined === sample.tags) {
          sample.tags = {};
        }
        if (undefined === sample.fields) {
          sample.fields = {};
        }
        sample.tags.gatewayID = os.hostname();
        sample.tags.address = RuuviData.mac ? RuuviData.mac.toString(16) : id;
        sample.fields.mac = sample.tags.address;
        sample.fields.rssiDB = rssi;
        sample.tags.dataFormat = data[0].toString();
        sample.timestamp = toNanoDate((now * 1000000).toString()).getNanoTime();
        // const tx: IPoint[] = [sample];
        const dbName: string = RuuviOptions.database ? RuuviOptions.database : 'misc';
        queuePoint(dbName, sample);
      } catch (e) {
        console.error(`${e} thrown`);
      }
    }

    // If data is Ruuvi DF3 data
    if (0x03 === data[0]) {
      try {
        const RuuviData: RuuviTagBroadcast = df3parser(data);
        const sample: IPoint = RuuviTagBroadcastToInflux(RuuviData);
        if (undefined === sample.tags) {
          sample.tags = {};
        }
        if (undefined === sample.fields) {
          sample.fields = {};
        }
        sample.tags.gatewayID = os.hostname();
        sample.tags.address = RuuviData.mac ? RuuviData.mac.toString(16) : id;
        sample.fields.rssiDB = rssi;
        sample.tags.dataFormat = data[0].toString();
        sample.timestamp = toNanoDate((now * 1000000).toString()).getNanoTime();
        const tx: IPoint[] = [sample];
        const dbName: string = RuuviOptions.database ? RuuviOptions.database : 'misc';
        queuePoint(dbName, sample);
      } catch (e) {
        console.error(`${e} thrown`);
      }
    }
    
  }
});*/
// Setup database connection

const gwDB = new Influx({
  host: GWStatOptions.host,
  database: GWStatOptions.database,
  schema: GWStatOptions.schema,
  username: GWStatOptions.username,
  password: GWStatOptions.password,
});
gwDB.getDatabaseNames().then(names => {
  const dbname: string = GWStatOptions.database ? GWStatOptions.database : 'misc';
  if (0 > names.indexOf(dbname)) {
    return gwDB.createDatabase(dbname);
  }
});

const macDB = new Influx({
  host: MacStatOptions.host,
  database: MacStatOptions.database,
  schema: MacStatOptions.schema,
  username: MacStatOptions.username,
  password: MacStatOptions.password,
});
macDB.getDatabaseNames().then(names => {
  const dbname: string = MacStatOptions.database ? MacStatOptions.database : 'misc';
  if (0 > names.indexOf(dbname)) {
    return macDB.createDatabase(dbname);
  }
});

/*
 * MQTT connection
 */
const config = new InfluxLogin();
const mqttClient = mqtt.connect('mqtt://' + config.mqttBroker);

mqttClient.on('connect', function() {
  console.log('MQTT connected');
  mqttClient.subscribe('/+/status', function(err) {
    if (err) {
      console.log('err');
    }
  });
});

const macTimestamps = new Map();
mqttClient.on('message', function(topic, message) {
  const obj = JSON.parse(message.toString());
  if (Array.isArray(obj)) {
    //console.log(obj.length);
    const length = obj ? obj.length - 1 : 0;
    const point = GwStatusToInflux(obj[0]);
    const macs = [];
    for (let ii = 0; ii < obj.length; ii++) {
      if (obj[ii].mac) {
        macs.push(obj[ii].mac);
      }
    }
    const result = [];
    const map = new Map();
    for (const item of macs) {
      if (!map.has(item)) {
        map.set(item, true); // set any value to Map
        result.push({
          item,
        });
      }
    }
    //console.log(result.length);
    if (point.fields) {
      point.fields.gatewayMsgs = length;
      point.fields.gatewayUniq = result.length - 1;
    }
    const gw_samples = [];
    gw_samples.push(point);
    gwDB.writePoints(gw_samples);

    const tstamps = [];
    const mac_samples = [];
    for (const item of macs) {
      if (!macTimestamps.has(item)) {
        macTimestamps.set(item, Date.now()); // set any value to Map
      } else {
        let delta = Date.now() - macTimestamps.get(item);
        tstamps.push({ mac: item, latency: delta });
        macTimestamps.set(item, Date.now());
      }
    }
    for (let ii = 0; ii < tstamps.length; ii++) {
      let macPoint = MacStatusToInflux(tstamps[ii]);
      if (macPoint.tags) {
        macPoint.tags.gatewayID = obj[0].mac;
        mac_samples.push(macPoint);
      }
    }
    //console.log(mac_samples);
    macDB.writePoints(mac_samples);
  }
});

process.on('unhandledRejection', error => {
  console.error(`${error} thrown`);
  process.exit(1);
});

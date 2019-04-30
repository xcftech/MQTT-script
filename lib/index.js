"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
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
/*
 * MQTT connection
 */
/*
const mqttClient = mqtt.connect('mqtt://' + config.mqttBroker);

mqttClient.on('connect', function () {
 console.log("MQTT connected");
 mqttClient.subscribe('+/RuuviTag/+/RAW', function (err) {
   if (err) {
     console.log("err");
   }
 });
 mqttClient.subscribe('/+/status', function (err) {
   if (err) {
     console.log("err");
   }
 })
});

mqttClient.on('message', function (topic, message) {
}
*/
var data = fs.readFileSync('data.json', 'utf8');
var obj = JSON.parse(data);
console.log(obj[0]);
process.on('unhandledRejection', function (error) {
    console.error(error + " thrown");
    process.exit(1);
});

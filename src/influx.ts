/*
 * InfluxDB v1, needs to be written again for InfluxDB v2
 */
const Influx = require('influx');
import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';
import {
  AccelerationBroadcast,
  FFTBroadcast,
  RuuviTagBroadcast,
  getParser,
  manufacturerDataParser,
  dfafparser,
} from 'ojousima.ruuvi_endpoints.ts';
import { RuuviData } from './ruuvidata';
import { INFLUXDB_TOKEN } from '../.env';
import {
  BROKER,
  ACCELERATION_DB,
  ACCELERATION_MEASUREMENT,
  FFT_DB,
  FFT_MEASUREMENT,
  RAW_DB,
  RAW_MEASUREMENT,
  INFLUX_HOST,
  INFLUX_USER,
  INFLUX_PORT,
  INFLUX_PASSWORD,
} from '../.env';

const raw_schema = [
  {
    measurement: RAW_MEASUREMENT,
    fields: {
      rssi: Influx.FieldType.INTEGER,
      temperature: Influx.FieldType.FLOAT,
      humidity: Influx.FieldType.FLOAT,
      pressure: Influx.FieldType.FLOAT,
      accelerationX: Influx.FieldType.FLOAT,
      accelerationY: Influx.FieldType.FLOAT,
      accelerationZ: Influx.FieldType.FLOAT,
      batteryVoltage: Influx.FieldType.FLOAT,
      txPower: Influx.FieldType.INTEGER,
      movementCounter: Influx.FieldType.INTEGER,
      measurementSequenceNumber: Influx.FieldType.INTEGER,
    },
    tags: ['dataFormat', 'mac', 'gateway_id'],
  },
];

const raw_influx = new Influx.InfluxDB({
  host: INFLUX_HOST,
  database: RAW_DB,
  schema: raw_schema,
  username: INFLUX_USER,
  password: INFLUX_PASSWORD,
});

const acceleration_schema = [
  {
    measurement: ACCELERATION_MEASUREMENT,
    fields: {
      rssi: Influx.FieldType.INTEGER,
      temperature: Influx.FieldType.FLOAT,
      p2pX: Influx.FieldType.FLOAT,
      p2pY: Influx.FieldType.FLOAT,
      p2pZ: Influx.FieldType.FLOAT,
      rmsX: Influx.FieldType.FLOAT,
      rmsY: Influx.FieldType.FLOAT,
      rmsZ: Influx.FieldType.FLOAT,
      batteryVoltage: Influx.FieldType.FLOAT,
      measurementSequenceNumber: Influx.FieldType.INTEGER,
    },
    tags: ['dataFormat', 'mac', 'gateway_id'],
  },
];

const acceleration_influx = new Influx.InfluxDB({
  host: INFLUX_HOST,
  database: ACCELERATION_DB,
  schema: acceleration_schema,
  username: INFLUX_USER,
  password: INFLUX_PASSWORD,
});

const fft_schema = [
  {
    measurement: FFT_MEASUREMENT,
    fields: {
      rssi: Influx.FieldType.INTEGER,
      42: Influx.FieldType.FLOAT,
      84: Influx.FieldType.FLOAT,
      125: Influx.FieldType.FLOAT,
      167: Influx.FieldType.FLOAT,
      208: Influx.FieldType.FLOAT,
      250: Influx.FieldType.FLOAT,
      292: Influx.FieldType.FLOAT,
      334: Influx.FieldType.FLOAT,
      375: Influx.FieldType.FLOAT,
      417: Influx.FieldType.FLOAT,
      459: Influx.FieldType.FLOAT,
      500: Influx.FieldType.FLOAT,
      542: Influx.FieldType.FLOAT,
      583: Influx.FieldType.FLOAT,
      625: Influx.FieldType.FLOAT,
      667: Influx.FieldType.FLOAT,
      measurementSequenceNumber: Influx.FieldType.INTEGER,
    },
    tags: ['dataFormat', 'mac', 'gateway_id', 'type'],
  },
];

const fft_influx = new Influx.InfluxDB({
  host: INFLUX_HOST,
  database: FFT_DB,
  schema: fft_schema,
  username: INFLUX_USER,
  password: INFLUX_PASSWORD,
});

const hexStringToByte = function(str: string): Uint8Array {
  if (!str) {
    return new Uint8Array();
  }

  const a = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(a);
};

const macStringToNum = function(str: string): number {
  if (!str) {
    return 0;
  }
  const replaced = str.replace(/[^a-z0-9]/gi, '');

  return parseInt(replaced, 16);
};

const fftToInflux = function(data: FFTBroadcast, meta: RuuviData): void {
  // console.log(JSON.stringify(data));
  const influx_samples = [];
  const influx_point = {
    fields: {
      rssi: data.rssiDB,
      42: data.buckets[0],
      84: data.buckets[1],
      125: data.buckets[2],
      167: data.buckets[3],
      208: data.buckets[4],
      250: data.buckets[5],
      292: data.buckets[6],
      334: data.buckets[7],
      375: data.buckets[8],
      417: data.buckets[9],
      459: data.buckets[10],
      500: data.buckets[11],
      542: data.buckets[12],
      583: data.buckets[13],
      625: data.buckets[14],
      667: data.buckets[15],
    },
    tags: {
      mac: meta.deviceId,
      gateway_id: meta.gatewayId,
      dataFormat: data.dataFormat,
      type: data.type,
    },
    timestamp: Influx.toNanoDate((meta.timestamp * 1000000).toString()),
    measurement: FFT_MEASUREMENT,
  };
  influx_samples.push(influx_point);
  try {
    fft_influx.writePoints(influx_samples);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    }
  }
};

const rawToInflux = function(data: RuuviTagBroadcast, meta: RuuviData): void {
  // console.log(JSON.stringify(data));
  const influx_samples = [];
  const influx_point = {
    fields: {
      rssi: data.rssiDB,
      temperature: data.temperatureC,
      humidity: data.humidityRh,
      pressure: data.pressurePa,
      accelerationX: data.accelerationXG,
      accelerationY: data.accelerationYG,
      accelerationZ: data.accelerationZG,
      batteryVoltage: data.batteryVoltageV,
      txPower: data.txPowerDBm,
      movementCounter: data.movementCounter,
      measurementSequenceNumber: data.measurementSequence,
    },
    tags: {
      mac: meta.deviceId,
      gateway_id: meta.gatewayId,
      dataFormat: data.dataFormat,
    },
    timestamp: Influx.toNanoDate((meta.timestamp * 1000000).toString()),
    measurement: RAW_MEASUREMENT,
  };
  influx_samples.push(influx_point);
  try {
    raw_influx.writePoints(influx_samples);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    }
  }
};

const accelerationToInflux = function(data: AccelerationBroadcast, meta: RuuviData): void {
  const influx_samples = [];
  const influx_point = {
    fields: {
      rssi: data.rssiDB,
      p2pX: data.p2pXG,
      p2pY: data.p2pYG,
      p2pZ: data.p2pZG,
      rmsX: data.rmsXG,
      rmsY: data.rmsYG,
      rmsZ: data.rmsZG,
      batteryVoltage: data.batteryVoltageV,
      temperature: data.temperatureC,
      measurementSequenceNumber: data.measurementSequence,
    },
    tags: {
      mac: meta.deviceId,
      gateway_id: meta.gatewayId,
      dataFormat: data.dataFormat,
    },
    measurement: ACCELERATION_MEASUREMENT,
    timestamp: Influx.toNanoDate((meta.timestamp * 1000000).toString()),
  };
  influx_samples.push(influx_point);
  try {
    acceleration_influx.writePoints(influx_samples);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    }
  }
};

const feedDataToInfluxV3 = (parsedData: RuuviTagBroadcast, meta:RuuviData) => {

  // @ts-ignore
  const point = Point.measurement('raw_measurement').setFields(
    {
      rssi: parsedData.rssiDB ?? 0,
      temperature: parsedData.temperatureC ?? 0,
      humidity: parsedData.humidityRh ?? 0,
      pressure: parsedData.pressurePa ?? 0,
      accelerationX: parsedData.accelerationXG ?? 0,
      accelerationY: parsedData.accelerationYG ?? 0,
      accelerationZ: parsedData.accelerationZG ?? 0,
      batteryVoltage: parsedData.batteryVoltageV ?? 0,
      txPower: parsedData.txPowerDBm ?? 0,
      movementCounter: parsedData.movementCounter ?? 0,
      measurementSequenceNumber: parsedData.measurementSequence ?? 0,
    },
  ).setTag('mac', meta.deviceId)
  .setTag('gateway_id', meta.deviceId)
  .setTag('dataFormat', parsedData.dataFormat + "")
    .setTimestamp(Influx.toNanoDate((meta.timestamp * 1000000).toString()));

  try {
    const client = new InfluxDBClient({ host: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: INFLUXDB_TOKEN });
    const database = `Ruuvi`;
    client.write(point, database);
  } catch (e) {
    console.log(e);
  }

};

export const rDataToInflux = function(data: RuuviData) {
  // Get raw data payload
  // console.log(data.rawData);
  const payload = hexStringToByte(data.rawData.slice(data.rawData.indexOf('FF9904') + 6));

  // Parse the raw data
  const parser: manufacturerDataParser = getParser(payload);
  const parsedData = parser(payload);
  // Fill in metadata
  parsedData.rssiDB = data.rssi;
  parsedData.mac = macStringToNum(data.deviceId);
  //console.log("Got Data");

  if (parsedData instanceof FFTBroadcast) {
    fftToInflux(parsedData, data);
    console.log(data.rawData.slice(data.rawData.indexOf('FF9904') + 6));
    console.log(JSON.stringify(parsedData));
  } else if (parsedData instanceof RuuviTagBroadcast) {
    rawToInflux(parsedData, data);
    feedDataToInfluxV3(parsedData, data);
    console.log('Got RAW');
    console.log(parsedData);
  } else if (parsedData instanceof AccelerationBroadcast) {
    accelerationToInflux(parsedData, data);
    console.log('Got Acceleration');
  } else {
    //console.log("Unknown data");
  }
};

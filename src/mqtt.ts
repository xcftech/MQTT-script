import * as mqtt from 'mqtt';
import { BROKER, MQTT_USER, MQTT_PASS } from '../.env';
import { RuuviData } from './ruuvidata';
import { rDataToInflux } from './influx';

const opts: mqtt.IClientOptions = {
  username: MQTT_USER,
  password: MQTT_PASS ?? "",
};

const client: mqtt.Client = mqtt.connect(`mqtt://${BROKER}`, opts);

export const mqttInit = function (): void {
  client.on('connect', function () {
    client.subscribe('ruuvi/#', function (err) {
      if (!err) {
        console.log('MQTT Sub ok');
      } else {
        console.error(err, 'MQTT problem');
      }
    });
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    // console.log(message.toString());
    try {
      const post = JSON.parse(message.toString());
      if (!post.data) {
        console.error('Not Ruuvi data');
        return;
      }
      const ms = post.ts * 1000; // seconds, convert to ns for influx

      const data = post.data.toUpperCase();
      const tag_mac = topic.substring(topic.lastIndexOf('/') + 1);

      const sample: RuuviData = new RuuviData(post.coords, tag_mac, post.gw_mac, 'Gateway', data, post.rssi, ms);

      rDataToInflux(sample);
    } catch (e) {
      console.error('Not JSON data');
      return;
    }
  });
};

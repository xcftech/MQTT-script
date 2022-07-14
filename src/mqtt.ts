import * as mqtt from 'mqtt';
import { BROKER } from '../.env';
import { RuuviData } from './ruuvidata'
import { rDataToInflux } from './influx'

const opts: mqtt.IClientOptions = {

};

const client:mqtt.Client = mqtt.connect(`mqtt://${BROKER}`, opts);


export const mqttInit = function():void {
client.on('connect', function () {
  client.subscribe('#', function (err) {
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
  const post = JSON.parse(message.toString());
  if (!post.data) {
    console.log('invalid');
    return;
  }
  const ms = post.ts * 1000; // seconds, convert to ns for influx

  const data = post.data.toUpperCase();
  const tag_mac = topic.substring(
    topic.lastIndexOf('/') + 1
  );

  const sample:RuuviData = new RuuviData(
    post.coords,
    tag_mac,
    post.gw_mac,
    'Gateway',
    data,
    post.rssi,
    ms
  );

  rDataToInflux(sample);
});
}
import * as mqtt from 'mqtt';

const BROKER = 'test.mosquitto.org';
const opts: mqtt.IClientOptions = {

};

const client:mqtt.Client = mqtt.connect(`mqtt://${BROKER}`, opts);


 
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})
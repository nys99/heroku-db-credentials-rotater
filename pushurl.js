require('dotenv').config()

const topicName = process.env.PUBSUB_TOPIC;
const subscriptionName = process.env.PUBSUB_SUBSCRIPTION;

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

// makes an api call to google to tell them where our server endpoint is
async function modifyPushConfig() {
  const options = {
    // Set to an HTTPS endpoint of your choice. If necessary, register
    // (authorize) the domain on which the server is hosted.
    pushEndpoint: process.env.SERVER_DOMAIN,
  };

  await pubSubClient
    .topic(topicName)
    .subscription(subscriptionName)
    .modifyPushConfig(options);
  console.log(`Modified push config for subscription ${subscriptionName}.`);
}

module.exports = {
  modifyPushConfig
}

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const topicName = 'projects/gmailpushtest-319004/topics/test-topic';
const subscriptionName = 'projects/gmailpushtest-319004/subscriptions/test-topic-sub';

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function modifyPushConfig() {
  const options = {
    // Set to an HTTPS endpoint of your choice. If necessary, register
    // (authorize) the domain on which the server is hosted.
    pushEndpoint: `https://ab10fbd5e248.ngrok.io/push`,
  };

  await pubSubClient
    .topic(topicName)
    .subscription(subscriptionName)
    .modifyPushConfig(options);
  console.log(`Modified push config for subscription ${subscriptionName}.`);
}

modifyPushConfig().catch(console.error);

require('dotenv').config()

const express = require('express');
const Gmailpush = require('gmailpush');
const { processEmails } = require('./processEmails');

const app = express();

// Initialize with OAuth2 config and Pub/Sub topic
const gmailpush = new Gmailpush({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  pubsubTopic: process.env.PUBSUB_TOPIC
});

const users = [
  {
    email: process.env.EMAIL,
    token: {
      access_token: process.env.ACCESS_TOKEN,
      refresh_token: process.env.REFRESH_TOKEN,
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      token_type: 'Bearer'
    }
  }
];

app.post(
  // Use URL set as Pub/Sub Subscription endpoint
  '/push',
  // Parse JSON request payload
  express.json(),
  (req, res) => {
    // Acknowledge Gmail push notification webhook
    res.sendStatus(200);

    // Get Email address contained in the push notification
    const email = gmailpush.getEmailAddress(req.body);

    // Get access token for the Email address
    const token = users.find((user) => user.email === email).token;

    gmailpush
      .getMessages({
        notification: req.body,
        token
      })
      .then((messages) => {
        processEmails(messages)
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});


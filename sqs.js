// sqs.js
const AWS = require('aws-sdk');

// Initialize SQS
const sqs = new AWS.SQS({ region: process.env.AWS_REGION });

// get the SQS queue URL from environment variables
const queueUrl = process.env.SQS_QUEUE_URL;

// receive messages from SQS
function receiveMessages(handleMessage) {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10, // MAX 10
    WaitTimeSeconds: 20,     // 20s
  };

  sqs.receiveMessage(params, async (err, data) => {
    if (err) {
      console.error('Error receiving messages:', err);
    } else if (data.Messages) {
      for (const message of data.Messages) {
        console.log('Received message:', message.Body);

        // analyze message
        const messageData = JSON.parse(message.Body);

        // handle message
        await handleMessage(messageData);

        // delete message from queue
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };
        sqs.deleteMessage(deleteParams, (err) => {
          if (err) {
            console.error('Error deleting message:', err);
          } else {
            console.log('Deleted message from queue');
          }
        });
      }
    } else {
      console.log('No messages received');
    }
  });
}

// send message to SQS
function sendMessage(messageBody) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  };

  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.error('Error sending message to SQS:', err);
        reject(err);
      } else {
        console.log('Message sent to SQS:', data.MessageId);
        resolve(data.MessageId);
      }
    });
  });
}

module.exports = {
  receiveMessages,
  sendMessage,
};

const { CloudWatchClient, PutMetricDataCommand } = require("@aws-sdk/client-cloudwatch");

// Initialize CloudWatch client
const cloudWatchClient = new CloudWatchClient({ region: process.env.AWS_REGION });

// Define a function to send custom metrics to CloudWatch
const sendCustomMetric = async (metricName, value, unit = 'Count', dimensions = []) => {
    const params = {
        MetricData: [
            {
                MetricName: metricName,
                Dimensions: dimensions,
                Unit: unit,
                Value: value
            },
        ],
        Namespace: 'CustomMetrics/n11232331-TransImage' 
    };

    try {
        const command = new PutMetricDataCommand(params);
        await cloudWatchClient.send(command);
        console.log(`Successfully sent metric: ${metricName} with value: ${value}`);
    } catch (error) {
        console.error(`Error sending metric: ${metricName}`, error);
    }
};

module.exports = {
    sendCustomMetric
};

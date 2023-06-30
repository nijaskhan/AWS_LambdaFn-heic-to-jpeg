const AWS = require('aws-sdk');
const convert = require('heic-convert');

const s3 = new AWS.S3();

exports.handler = async (event, context) => {
    const key = event.Records[0].s3.object.key;
    const bucketName = event.Records[0].s3.bucket.name;

    try {
        const s3Object = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
        console.log(s3Object);
        const outputImage = await convert({
            buffer: s3Object.Body,
            format: 'PNG'
        });

        await s3.putObject({
            Bucket: bucketName,
            Key: 'convertedImg.jpg',
            ContentType: 'image/png',
            Body: outputImage
        }).promise();
    } catch (err) {
        console.log("An error occurred:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(key),
    };
    return response;
};
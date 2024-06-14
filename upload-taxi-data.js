require('dotenv').config();
const axios = require('axios');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucketName = 'taxi-data-raw';
const baseUrl = 'https://d37ci6vzurychx.cloudfront.net/trip-data';
const years = ['2018'];

const uploadFile = async (url, key) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: response.data,
    };
    await s3.putObject(params).promise();
    console.log(`Uploaded ${key} to ${bucketName}`);
  } catch (error) {
    console.error(`Error uploading ${key}:`, error.message);
  }
};

const main = async () => {
  for (const year of years) {
    for (let month = 1; month <= 12; month++) {
      const formattedMonth = month.toString().padStart(2, '0');
      const fileName = `yellow_tripdata_${year}-${formattedMonth}.parquet`;
      const fileUrl = `${baseUrl}/${fileName}`;
      await uploadFile(fileUrl, fileName);
    }
  }
};

main();

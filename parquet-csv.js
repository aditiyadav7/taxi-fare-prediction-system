require('dotenv').config();
const { exec } = require('child_process');
const AWS = require('aws-sdk');

const year = process.argv[2];
if (!year) {
    console.error('Please specify a year as an argument. e.g., node parquet-csv.js 2018');
    process.exit(1);
}

const sourceBucket = 'taxi-data-raw'; 
const targetBucket = 'clean-taxi-data';  

async function listParquetFiles(year) {
    const s3 = new AWS.S3();
    const params = {
        Bucket: sourceBucket,
        Prefix: `yellow_tripdata_${year}-`
    };
    return s3.listObjectsV2(params).promise().then(data => data.Contents.map(item => item.Key));
}

async function convertAndUploadFiles(files) {
    files.forEach(file => {
        const command = `python3 process.py`;
        exec(command, {
            env: {
                ...process.env,
                SOURCE_BUCKET: sourceBucket,
                FILE_NAME: file,
                TARGET_BUCKET: targetBucket
            }
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }
            console.log(`Stdout: ${stdout}`);
        });
    });
}

async function main() {
    const files = await listParquetFiles(year);
    if (files.length > 0) {
        await convertAndUploadFiles(files);
    } else {
        console.log(`No files found for year ${year}.`);
    }
}

main();

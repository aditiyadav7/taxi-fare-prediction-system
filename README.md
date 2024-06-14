# Taxi Fare Prediction Pipeline

## Overview
This repository contains a pipeline for processing historical taxi trip data. It uploads raw data to AWS S3, transforms it from Parquet to CSV format using PySpark, performs data cleaning and feature engineering, trains a machine learning model to predict fares, and visualizes the results.

## Prerequisites
- Node.js
- Python with PySpark
- AWS CLI with S3 access configured
- Google Colab or Jupyter Notebook environment
- Required Node.js packages: dotenv, axios, aws-sdk
- Required Python packages: pyspark (others as per the `process.py` script, not provided)

## Setup
1. Clone the repository to your local machine.
2. Create a `.env` file in the root of the project directory with your AWS credentials:


AWS_ACCESS_KEY_ID=<your_access_key>
AWS_SECRET_ACCESS_KEY=<your_secret_key>



3. Install Node.js dependencies with `npm install`.

## Usage

### Step 1: Uploading Raw Data to S3
- Run `node upload-taxi-data.js` to upload the raw NYC TLC taxi data to your S3 bucket for the specified year.

### Step 2: Data Conversion and Cleaning
- Execute `node parquet-csv.js <year>` to list, convert, and clean parquet files from the raw S3 bucket, then upload the cleaned CSV files to another S3 bucket.

### Step 3: Feature Engineering and Model Training
- Open your Google Colab/Jupyter Notebook which contains the scripts for further data cleaning, exploratory data analysis (EDA), feature engineering, and machine learning model training.
- Use the `Run all` feature to execute all cells in the notebook.

### Step 4: Making Predictions and Visualization
- The notebook should contain cells that utilize the trained model to make predictions and visualize the results using Matplotlib and Seaborn.

## Additional Notes
- Make sure you have correct IAM permissions for accessing and modifying S3 buckets.
- Ensure that the paths and bucket names in the scripts match those in your AWS environment.
- Monitor logs for errors and adjust IAM policies or script configurations as needed.



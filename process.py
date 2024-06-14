from pyspark.sql import SparkSession
import os

def convert_and_upload(source_bucket, file_name, target_bucket):
    spark = SparkSession.builder \
        .appName("Taxi Fare Prediction Data Processing") \
        .config("spark.hadoop.fs.s3a.access.key", os.getenv('AWS_ACCESS_KEY_ID')) \
        .config("spark.hadoop.fs.s3a.secret.key", os.getenv('AWS_SECRET_ACCESS_KEY')) \
        .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem") \
        .getOrCreate()

    parquet_path = f"s3a://{source_bucket}/{file_name}"
    df = spark.read.parquet(parquet_path)
    
    cleaned_df = df.selectExpr(
        "concat(tpep_pickup_datetime, '_', VendorID) as key",
        "fare_amount",
        "tpep_pickup_datetime as pickup_datetime",
        "pickup_longitude",
        "pickup_latitude",
        "dropoff_longitude",
        "dropoff_latitude",
        "passenger_count"
    ).filter(
        (df.passenger_count > 0) &
        (df.fare_amount > 0)
    )

    # Data partitioning for optimized storage and querying
    cleaned_df = cleaned_df.repartition("pickup_datetime")
    
    csv_path = f"s3a://{target_bucket}/{file_name.replace('.parquet', '_clean.csv')}"
    cleaned_df.write.option("header", "true").csv(csv_path)

    print(f"Uploaded {file_name.replace('.parquet', '_clean.csv')} to {target_bucket}")
    spark.stop()

if __name__ == "__main__":
    source_bucket = os.getenv('SOURCE_BUCKET')
    file_name = os.getenv('FILE_NAME')
    target_bucket = os.getenv('TARGET_BUCKET')
    convert_and_upload(source_bucket, file_name, target_bucket)
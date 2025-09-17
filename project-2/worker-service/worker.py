import os
import redis
import psycopg2
import time
import json

# Redis connection
r = redis.Redis(
    host=os.getenv('QUEUE_HOST', 'queue'),
    port=6379,
    db=0
)

# Database connection
conn = psycopg2.connect(
    host=os.getenv('DB_HOST', 'database'),
    database=os.getenv('DB_NAME', 'myapp'),
    user=os.getenv('DB_USER', 'postgres'),
    password=os.getenv('DB_PASSWORD', 'postgres')
)

def process_job(job_data):
    """Process a job from the queue"""
    job_id = job_data['id']
    title = job_data['title']
    
    print(f"Processing job {job_id}: {title}")
    
    # Update job status in database
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE jobs SET status = 'processing' WHERE id = %s",
            (job_id,)
        )
        conn.commit()
    
    # Simulate work
    time.sleep(2)
    
    # Mark job as completed
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE jobs SET status = 'completed' WHERE id = %s",
            (job_id,)
        )
        conn.commit()
    
    print(f"Completed job {job_id}")

def main():
    print("Worker service started")
    
    while True:
        # Get job from queue (blocking)
        _, job_json = r.brpop('jobs')
        job_data = json.loads(job_json)
        
        try:
            process_job(job_data)
        except Exception as e:
            print(f"Error processing job: {e}")

if __name__ == "__main__":
    main()
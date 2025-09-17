FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create non-root user
RUN addgroup --system --gid 1001 python && \
    adduser --system --uid 1001 --ingroup python python && \
    chown -R python:python /app
USER python

CMD ["python", "worker.py"]
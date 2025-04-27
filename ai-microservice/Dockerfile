FROM python:3.10-slim
WORKDIR /app

COPY requirements.txt .
COPY arel-api.py .
COPY .env .env

RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "arel-api:app"]

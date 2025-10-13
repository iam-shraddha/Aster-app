#!/bin/sh
# Wait for MySQL to be ready
echo "Waiting for MySQL..."
/wait-for-it.sh mysql:3306 --timeout=60 --strict -- echo "MySQL is up!"

# Start backend in background
echo "Starting Spring Boot backend..."
java -jar myapp.jar &

# Start frontend
echo "Starting React frontend..."
serve -s /app/frontend -l 3000

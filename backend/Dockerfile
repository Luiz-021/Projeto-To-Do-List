FROM python:3.13-slim

WORKDIR /app


RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      default-libmysqlclient-dev \
      build-essential \
      default-mysql-client && \
    rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY . .


EXPOSE 8000


CMD ["gunicorn", "todo_project.wsgi:application", "--bind", "0.0.0.0:8000"]
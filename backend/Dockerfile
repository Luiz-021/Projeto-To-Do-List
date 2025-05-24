FROM python:3.13-slim

WORKDIR /app

# Dependências de sistema para compilar mysqlclient
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      default-libmysqlclient-dev \
      build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copia e instala as dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Expõe a porta do Django/Gunicorn
EXPOSE 8000

# Comando padrão para iniciar o serviço
CMD ["gunicorn", "todo_project.wsgi:application", "--bind", "0.0.0.0:8000"]

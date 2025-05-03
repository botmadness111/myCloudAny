FROM python:3.13-slim


WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Создаем директорию для статических файлов
RUN mkdir -p app/static

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
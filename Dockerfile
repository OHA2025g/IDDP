FROM python:3.10-slim-buster

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

RUN pip install poetry && poetry install --no-root --no-dev

COPY . .

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# WB Tariffs Service

Сервис для получения тарифов коробов Wildberries и выгрузки в Google Sheets.

## Что делает
- Каждый час запрашивает тарифы коробов через WB API
- Сохраняет данные в PostgreSQL (обновляет в пределах одного дня)
- Выгружает тарифы в указанные Google-таблицы на лист `stocks_coefs`

## Настройка

1. Скопируйте `.env.example` в `.env`:
```bash
   cp .env.example .env
```

2. Заполните `.env`:
   - `WB_API_TOKEN` — токен WB API
   - `GOOGLE_SHEETS_IDS` — ID Google-таблиц через запятую
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — email сервисного аккаунта Google
   - `GOOGLE_PRIVATE_KEY` — приватный ключ сервисного аккаунта

3. Создайте Google-таблицы, добавьте лист `stocks_coefs`, 
   расшарьте каждую на email сервисного аккаунта.

## Запуск
```bash
docker compose up --build
```

## Проверка работы
- Логи: `docker compose logs -f app`
- БД: `docker compose exec db psql -U postgres -c "SELECT * FROM box_tariffs LIMIT 10;"`
- Google-таблицы: откройте таблицу, проверьте лист `stocks_coefs`
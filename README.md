# Проект по автоматизации тестирования тестового сайта OrangeHRM

## Содержание

- [Тест-кейсы](#-тест-кейсы)
- [Запуск автотестов](#-запуск-автотестов)
- [Генерация отчётов](#-генерация-отчётов)
- [Запуск в GitHub Actions](#-запуск-в-github-actions)
- [Пример Allure-отчёта](#-пример-allure-отчёта)
- [Пример Allure TestOps-отчёта](#-пример-allure-testops-отчёта)
- [Уведомления в Telegram](#-уведомления-в-telegram-с-использованием-бота)

Тесты написаны на **JavaScript** с использованием фреймворка **Playwright**.

Для удалённого запуска настроен **GitHub Actions**: прогон тестов, формирование Allure-отчёта, публикация на GitHub Pages, отправка результатов в **Allure TestOps** и уведомления в **Telegram** при помощи бота.

Тестируемое приложение: [OrangeHRM](https://www.orangehrm.com/) (демо-стенд opensource-demo.orangehrmlive.com). В проекте также есть API-тесты для [API Challenges](https://apichallenges.herokuapp.com/).

---

## 🕵️‍♂️ Тест-кейсы

### UI (OrangeHRM)

**Авторизация**

- ✔️ Успешный вход по логину и паролю
- ✔️ Неуспешный вход при неверном пароле
- ✔️ Неуспешный вход при неверном логине

**PIM (управление сотрудниками)**

- ✔️ Добавление сотрудника в Employee List
- ✔️ Поиск добавленного сотрудника в Employee List по Employee Id
- ✔️ Поиск добавленного сотрудника в Employee List по Employee Name
- ✔️ Редактирование сотрудника
- ✔️ Удаление сотрудника

### API (API Challenges)

- ✔️ POST /todos (400) — проверка ответа при лишнем поле
- ✔️ POST /todos/{id} (200) — создание и обновление todo
- ✔️ GET /todos (200) XML
- ✔️ GET /challenger/guid (существующий X-CHALLENGER)
- ✔️ PUT /challenger/guid CREATE

---

## ▶️ Запуск автотестов

### Запуск тестов из терминала

**Все тесты:**

```bash
npm test
```

**Только UI (OrangeHRM):**

```bash
npx playwright test --project=chromium
```

**Только API:**

```bash
npx playwright test --project=api-challenges
```

**Только smoke-тесты:**

```bash
npm run test:smoke
```

---

## 📊 Генерация отчётов

### Allure из терминала

После прогона:

```bash
npm run allure:serve
```

Отчёт будет собран из `allure-results` и откроется в браузере.

Генерация отчёта в папку без автозапуска:

```bash
npm run allure:generate
npm run allure:open
```

---

## GitHub Actions

### Запуск в GitHub Actions

Тесты запускаются автоматически при **push** и **pull request** в ветки `main` / `master`, а также вручную через **workflow_dispatch** (вкладка Actions → Playwright Tests → Run workflow).

После прогона Allure-отчёт публикуется на **GitHub Pages**, результаты при необходимости отправляются в Allure TestOps, в Telegram уходит файл отчёта и текстовая сводка.

---

## Allure Report

### Пример Allure-отчёта

В CI отчёт собирается в single-file и публикуется на **GitHub Pages**. Локально — через `npm run allure:serve` или `npm run allure:open`.

---

## Allure TestOps

### Пример Allure TestOps-отчёта

Результаты передаются в **Allure TestOps** через allurectl (при настроенных секретах `ALLURE_ENDPOINT`, `ALLURE_TOKEN`, `ALLURE_PROJECT_ID` в GitHub Actions).

---

## Telegram

### Уведомления в Telegram с использованием бота

После завершения прогона в CI бот отправляет в чат:

1. **Файл** — Allure-отчёт (single-file HTML).
2. **Сообщение** — сводка: статус прогона, количество пройденных/упавших/пропущенных тестов, ссылки на Allure-отчёт и на run в GitHub Actions.

Сводка формируется скриптом `scripts/telegram-summary.js`. В репозитории должны быть заданы секреты: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

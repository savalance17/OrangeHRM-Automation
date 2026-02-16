# Run Guide

## Запуск
1. Очищаем результаты прошлых прогонов
```bash
npm run allure:clean
```

2. Запускаем всё
```bash
npm run test
```

3. Генерируем отчет Allure, если нужен
```bash
npm run allure:generate
```

4. Открываем отчет
```bash
npm run allure:open
```

## Другие варианты запуска
1. Запуск Playwright с UI
```bash
npm run test:ui
```

2. Запуск в headed режиме
```bash
npm run test:headed
```

3. Запуск в debug режиме
```bash
npm run test:debug
```

4. Запуск smoke
```bash
npm run test:smoke
```

5. Запуск конкретного набора
```bash
npx playwright test tests/ui.spec.js
```

6. Запуск нескольких наборов
```bash
npx playwright test tests/ui.spec.js tests/api.spec.js
```

7. Запуск всех наборов из папки
```bash
npx playwright test tests/
```

8. Запуск с трассировкой
```bash
npx playwright test tests/ui.spec.js --trace on
```

9. Показать отчет встроенного репортера Playwright
```bash
npx playwright show-report
```

**Как запускать по тегам**
```bash
npm run test:smoke
npm run test:critical
npm run test:tag -- @api
```

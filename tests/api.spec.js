import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ChallengerService, TodosService } from '../support/apichallenges/api/index.js';

test.describe('API Challenges', () => {
  let token;

  test.beforeAll(async ({ request }) => {
    const challengerService = new ChallengerService(request);
    let response;

    await test.step('Создание сессии challenger', async () => {
      response = await challengerService.post();
    });

    await test.step('Проверка ответа и сохранение токена', async () => {
      expect(response.status()).toBe(201);
      const headers = await response.headers();
      token = headers['x-challenger'];
      expect(token).toBeTruthy();
    });
  });

  test('15 - POST /todos (400) extra', { tag: ['@api', '@post'] }, async ({ request }) => {
    const todosService = new TodosService(request);
    let response;

    await test.step('Отправить POST /todos с лишним полем priority', async () => {
      response = await todosService.postTodo(token, {
        title: 'a title',
        description: 'optional',
        priority: 'extra',
      });
    });

    await test.step('Проверить статус ответа 400', async () => {
      expect(response.status()).toBe(400);
    });
  });

  test('17 - POST /todos/{id} (200)', { tag: ['@api', '@post'] }, async ({ request }) => {
    const todosService = new TodosService(request);
    let id;
    let createRes;
    let created;
    let updateRes;
    let updated;

    await test.step('Создать todo', async () => {
      createRes = await todosService.postTodo(token, {
        title: 'Todo to update',
        description: 'Original description',
        doneStatus: false,
      });
    });

    await test.step('Проверить создание todo', async () => {
      expect(createRes.status()).toBe(201);
      created = await createRes.json();
    });

    await test.step('Извлечь id todo', async () => {
      id = created.id ?? created.todos?.[0]?.id;
      expect(id).toBeDefined();
    });

    await test.step('Обновить todo по id', async () => {
      updateRes = await todosService.postTodoById(token, id, {
        title: 'Updated title',
      });
    });

    await test.step('Проверить обновление todo', async () => {
      expect(updateRes.status()).toBe(200);
      updated = await updateRes.json();
      expect(updated.title ?? updated.todos?.[0]?.title).toBe('Updated title');
    });
  });

  test('25 - GET /todos (200) XML', { tag: ['@api', '@get'] }, async ({ request }) => {
    const todosService = new TodosService(request);
    let response;
    let text;

    await test.step('Запросить todos в XML формате', async () => {
      response = await todosService.getTodos(token, { accept: 'application/xml' });
    });

    await test.step('Проверить статус ответа 200', async () => {
      expect(response.status()).toBe(200);
    });

    await test.step('Проверить XML в ответе', async () => {
      text = await response.text();
      expect(text).toMatch(/<\?xml|<\/?todos?/i);
    });
  });

  test('34 - GET /challenger/guid (existing X-CHALLENGER)', { tag: ['@api', '@get'] }, async ({ request }) => {
    const challengerService = new ChallengerService(request);
    let response;
    let body;

    await test.step('Запросить данные challenger по guid', async () => {
      response = await challengerService.getChallengerGuid(token);
    });

    await test.step('Проверить статус ответа 200', async () => {
      expect(response.status()).toBe(200);
    });

    await test.step('Проверить payload challenger', async () => {
      body = await response.json();
      expect(body.xChallenger).toBe(token);
      expect(body).toHaveProperty('challengeStatus');
    });
  });

  test('36 - PUT /challenger/guid CREATE', { tag: ['@api', '@put'] }, async ({ request }) => {
    const challengerService = new ChallengerService(request);
    const newToken = faker.string.uuid();
    let response1;
    let body;
    let response2;

    await test.step('Получить текущий payload challenger', async () => {
      response1 = await challengerService.getChallengerGuid(token);
      body = await response1.json();
    });

    await test.step('Заменить xChallenger на новый guid', async () => {
      body.xChallenger = newToken;
    });

    await test.step('Отправить PUT /challenger/{guid}', async () => {
      response2 = await challengerService.putChallengerGuid(body, newToken);
    });

    await test.step('Проверить создание challenger (201)', async () => {
      expect(response2.status()).toBe(201);
      expect(body.xChallenger).toBe(newToken);
    });
  });
});

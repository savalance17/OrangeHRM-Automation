import { test, expect } from '../support/apichallenges/fixtures/apiFixture.js';
import { faker } from '@faker-js/faker';

/** @typedef {import('../support/apichallenges/api/ApiFacade.js').default} ApiFacade */

test.describe('API Challenges', () => {
    let token;

    test.beforeEach(async (/** @type {{ api: ApiFacade }} */ { api }) => {
        const response = await api.challenger.post();

        expect(response.status()).toBe(201);
        const headers = await response.headers();
        token = headers['x-challenger'];
        expect(token).toBeTruthy();
    });

    test('15 - POST /todos (400) extra', { tag: ['@api', '@post'] }, async (/** @type {{ api: ApiFacade }} */ { api }) => {
        const response = await api.todos.postTodo(token, {
            title: 'a title',
            description: 'optional',
            priority: 'extra',
        });

        expect(response.status()).toBe(400);
    });

    test('17 - POST /todos/{id} (200)', { tag: ['@api', '@post'] }, async (/** @type {{ api: ApiFacade }} */ { api }) => {
        let id;
        let createRes;
        let created;
        let updateRes;
        let updated;

        createRes = await api.todos.postTodo(token, {
            title: 'Todo to update',
            description: 'Original description',
            doneStatus: false,
        });

        expect(createRes.status()).toBe(201);
        created = await createRes.json();

        id = created.id ?? created.todos?.[0]?.id;
        expect(id).toBeDefined();

        updateRes = await api.todos.postTodoById(token, id, {
            title: 'Updated title',
        });

        expect(updateRes.status()).toBe(200);
        updated = await updateRes.json();
        expect(updated.title ?? updated.todos?.[0]?.title).toBe('Updated title');
    });

    test('25 - GET /todos (200) XML', { tag: ['@api', '@get'] }, async (/** @type {{ api: ApiFacade }} */ { api }) => {
        const response = await api.todos.getTodos(token, { accept: 'application/xml' });

        expect(response.status()).toBe(200);

        const text = await response.text();
        expect(text).toMatch(/<\?xml|<\/?todos?/i);
    });

    test('34 - GET /challenger/guid (existing X-CHALLENGER)', { tag: ['@api', '@get'] }, async (/** @type {{ api: ApiFacade }} */ { api }) => {
        const response = await api.challenger.getChallengerGuid(token);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.xChallenger).toBe(token);
        expect(body).toHaveProperty('challengeStatus');
    });

    test('36 - PUT /challenger/guid CREATE', { tag: ['@api', '@put'] }, async (/** @type {{ api: ApiFacade }} */ { api }) => {
        const newToken = faker.string.uuid();
        let body;
        let response2;

        const response1 = await api.challenger.getChallengerGuid(token);
        body = await response1.json();

        body.xChallenger = newToken;

        response2 = await api.challenger.putChallengerGuid(body, newToken);

        expect(response2.status()).toBe(201);
        expect(body.xChallenger).toBe(newToken);
    });
});

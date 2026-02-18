/**
 * API Challenges: Challenger session (POST /challenger, GET/PUT /challenger/{guid}, database).
 */
const CHALLENGER_PATH = '/challenger';

/**
 * Сервис для работы с Challenger API: создание сессии, получение/обновление guid, database.
 */
export class ChallengerService {
    /**
     * @param {import('@playwright/test').APIRequestContext} request - контекст запросов Playwright
     */
    constructor(request) {
        this.request = request;
    }

    /**
     * Создаёт сессию challenger (POST /challenger). В ответе заголовок X-CHALLENGER с токеном.
     * @returns {Promise<import('@playwright/test').APIResponse>}
     */
    async post() {
        return this.request.post(CHALLENGER_PATH);
    }

    /**
     * Получает данные challenger по guid (GET /challenger/{guid}).
     * @param {string} guid - токен X-CHALLENGER
     * @returns {Promise<import('@playwright/test').APIResponse>}
     */
    async getChallengerGuid(guid) {
        return this.request.get(`${CHALLENGER_PATH}/${guid}`, {
            headers: { 'X-CHALLENGER': guid },
        });
    }

    /**
     * Обновляет challenger по guid (PUT /challenger/{guid}).
     * @param {Object} body - тело запроса (payload challenger)
     * @param {string} guid - токен X-CHALLENGER
     * @returns {Promise<import('@playwright/test').APIResponse>}
     */
    async putChallengerGuid(body, guid) {
        return this.request.put(`${CHALLENGER_PATH}/${guid}`, {
            headers: { 'X-CHALLENGER': guid },
            data: body,
        });
    }

    /**
     * Получает данные database по guid (GET /challenger/database/{guid}).
     * @param {string} guid - токен X-CHALLENGER
     * @returns {Promise<import('@playwright/test').APIResponse>}
     */
    async getDatabaseGuid(guid) {
        return this.request.get(`${CHALLENGER_PATH}/database/${guid}`, {
            headers: { 'X-CHALLENGER': guid },
        });
    }

    /**
     * Обновляет database по guid (PUT /challenger/database/{guid}).
     * @param {Object} body - тело запроса
     * @param {string} guid - токен X-CHALLENGER
     * @returns {Promise<import('@playwright/test').APIResponse>}
     */
    async putDatabaseGuid(body, guid) {
        return this.request.put(`${CHALLENGER_PATH}/database/${guid}`, {
            headers: { 'X-CHALLENGER': guid },
            data: body,
        });
    }
}

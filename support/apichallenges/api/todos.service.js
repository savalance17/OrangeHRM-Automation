/**
 * API Challenges: Todos (GET /todos и др.).
 */
export class TodosService {
    constructor(request) {
        this.request = request;
    }

    /** GET /todos. options.accept — например 'application/xml' для челленджа 25. */
    async getTodos(xChallenger, options = {}) {
        const headers = { 'X-CHALLENGER': xChallenger };
        if (options.accept) headers['Accept'] = options.accept;
        return this.request.get('/todos', { headers });
    }

    /** POST /todos — создать todo (201). */
    async postTodo(xChallenger, data) {
        return this.request.post('/todos', {
            headers: { 'X-CHALLENGER': xChallenger, 'Content-Type': 'application/json' },
            data,
        });
    }

    /** POST /todos/{id} — частичное обновление todo (200). */
    async postTodoById(xChallenger, id, data) {
        return this.request.post(`/todos/${id}`, {
            headers: { 'X-CHALLENGER': xChallenger, 'Content-Type': 'application/json' },
            data,
        });
    }
}

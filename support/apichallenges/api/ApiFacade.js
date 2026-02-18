import { ChallengerService } from './challenger.service.js';
import { TodosService } from './todos.service.js';

/**
 * Фасад для API Challenges: сервисы Challenger и Todos.
 */
export default class ApiFacade {
    constructor(request) {
        this.challenger = new ChallengerService(request);
        this.todos = new TodosService(request);
    }
}

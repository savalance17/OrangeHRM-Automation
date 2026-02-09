/**
 * API Challenges: Challenger session (POST /challenger, GET/PUT /challenger/{guid}, database).
 */
const CHALLENGER_PATH = '/challenger';

export class ChallengerService {
  constructor(request) {
    this.request = request;
  }

  async post() {
    return this.request.post(CHALLENGER_PATH);
  }

  async getChallengerGuid(guid) {
    return this.request.get(`${CHALLENGER_PATH}/${guid}`, {
      headers: { 'X-CHALLENGER': guid },
    });
  }

  async putChallengerGuid(body, guid) {
    return this.request.put(`${CHALLENGER_PATH}/${guid}`, {
      headers: { 'X-CHALLENGER': guid },
      data: body,
    });
  }

  async getDatabaseGuid(guid) {
    return this.request.get(`${CHALLENGER_PATH}/database/${guid}`, {
      headers: { 'X-CHALLENGER': guid },
    });
  }

  async putDatabaseGuid(body, guid) {
    return this.request.put(`${CHALLENGER_PATH}/database/${guid}`, {
      headers: { 'X-CHALLENGER': guid },
      data: body,
    });
  }
}

export class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async fetchData(endpoint = '') {
        const url = this.baseUrl + endpoint;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status} al consultar: ${url}`);
        }
        return await response.json();
    }
}
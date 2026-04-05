import { ApiService } from './ApiService.js';
export class DivisasService extends ApiService {
    constructor() {
        super('https://open.exchangerate-api.com/v6/latest/');
        this.tasas = {};
        this.base = 'EUR';
        this.fechaActualizacion = null;
    }
    async cargarTasas(monedaBase = 'EUR') {
        const data = await this.fetchData(monedaBase);
        this.tasas = data.rates;
        this.base = monedaBase;
        this.fechaActualizacion = new Date(data.time_last_update_utc);
        return this.tasas;
    }
    convertir(cantidad, origen, destino) {
        if (!Object.keys(this.tasas).length) {
            throw new Error('Tasas no cargadas. Llama primero a cargarTasas().');
        }
        const enBase = origen === this.base ? cantidad : cantidad / this.tasas[origen];
        const resultado = destino === this.base ? enBase : enBase * this.tasas[destino];
        return parseFloat(resultado.toFixed(4));
    }
    obtenerTasasDestacadas(monedas = ['USD', 'GBP', 'JPY', 'CHF', 'MXN', 'ARS', 'CLP', 'BRL']) {
        return monedas
            .filter(m => this.tasas[m])
            .map(m => ({ moneda: m, tasa: this.tasas[m] }));
    }
    obtenerMonedas() {
        return ['EUR', ...Object.keys(this.tasas).filter(m => m !== 'EUR')];
    }
    obtenerFechaFormateada() {
        if (!this.fechaActualizacion) return '';
        return this.fechaActualizacion.toLocaleDateString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }
}
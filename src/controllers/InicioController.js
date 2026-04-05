import { BaseController }  from './BaseController.js';
import { DivisasService }  from '../api/DivisasService.js';
import { DomManager }      from '../dom/DomManager.js';
export class InicioController extends BaseController {
    constructor(contenedor) {
        super(contenedor);
        this.servicio = new DivisasService();
    }
    async iniciar() {
        this._inicializarBase(false);          
        this._renderizarEstructura();
        await this._cargarDivisas();
        this._agregarEventos();
    }
    _renderizarEstructura() {
        this.contenedor.innerHTML =
            DomManager.htmlHero() +
            DomManager.htmlWidgetDivisas();
    }
    async _cargarDivisas() {
        try {
            await this.servicio.cargarTasas('EUR');
            this._poblarSelectores();
            this._renderizarGrid();
            this._actualizarFecha();
            this._calcularYMostrar();
        } catch (err) {
            console.error('[InicioController] Error API:', err.message);
            DomManager.mostrarError(
                document.getElementById('tasas-grid'),
                'No se pudieron cargar los tipos de cambio. Comprueba tu conexión.'
            );
            DomManager.setText(
                document.getElementById('resultado-conversion'),
                'Servicio no disponible'
            );
        }
    }
    _poblarSelectores() {
        const monedas = this.servicio.obtenerMonedas();
        DomManager.poblarSelectMonedas(
            document.getElementById('select-origen'),  monedas, 'EUR');
        DomManager.poblarSelectMonedas(
            document.getElementById('select-destino'), monedas, 'USD');
    }
    _renderizarGrid() {
        const grid = document.getElementById('tasas-grid');
        DomManager.vaciar(grid);
        this.servicio.obtenerTasasDestacadas().forEach(({ moneda, tasa }) =>
            DomManager.insertar(grid, DomManager.crearTarjetaTasa(moneda, tasa))
        );
    }
    _actualizarFecha() {
        DomManager.setText(
            document.getElementById('widget-fecha'),
            'Actualizado: ' + this.servicio.obtenerFechaFormateada()
        );
    }
    _calcularYMostrar() {
        const cantidad = parseFloat(document.getElementById('input-cantidad')?.value);
        const origen   = document.getElementById('select-origen')?.value;
        const destino  = document.getElementById('select-destino')?.value;
        const elRes    = document.getElementById('resultado-conversion');
        if (!cantidad || isNaN(cantidad)) return;
        try {
            const resultado = this.servicio.convertir(cantidad, origen, destino);
            DomManager.setText(elRes,
                `${cantidad.toLocaleString('es-ES')} ${origen}  =  ` +
                `${resultado.toLocaleString('es-ES', { maximumFractionDigits: 4 })} ${destino}`
            );
        } catch (err) {
            DomManager.setText(elRes, err.message);
        }
    }
    _agregarEventos() {
        ['input-cantidad', 'select-origen', 'select-destino'].forEach(id =>
            document.getElementById(id)
                ?.addEventListener('input', () => this._calcularYMostrar())
        );
    }
}
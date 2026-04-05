import { BaseController }                       from './BaseController.js';
import { DivisasService }                       from '../api/DivisasService.js';
import { DomManager }                           from '../dom/DomManager.js';
import { guardarTransaccion, mostrarToast }     from '../utils/StorageManager.js';
export class RegistroController extends BaseController {
    constructor(contenedor) {
        super(contenedor);
        this.servicio = new DivisasService();
    }
    async iniciar() {
        this._inicializarBase(true);
        this._renderizarFormulario();
        await this._cargarDivisas();
        this._agregarEventos();
        document.getElementById('fecha').valueAsDate = new Date();
    }
    _renderizarFormulario() {
        this.contenedor.innerHTML = DomManager.htmlFormulario();
    }
    async _cargarDivisas() {
        try {
            await this.servicio.cargarTasas('EUR');
            DomManager.poblarSelectMonedas(
                document.getElementById('moneda'),
                this.servicio.obtenerMonedas(), 'EUR'
            );
        } catch (err) {
            console.error('[RegistroController] Error API:', err.message);
        }
    }
    _actualizarInfoConversion() {
        const infoEl = document.getElementById('conversion-info');
        const monto  = parseFloat(document.getElementById('monto')?.value);
        const moneda = document.getElementById('moneda')?.value;
        if (!infoEl) return;
        if (!monto || isNaN(monto) || moneda === 'EUR') {
            infoEl.textContent = ''; return;
        }
        try {
            const enEur = this.servicio.convertir(monto, moneda, 'EUR');
            infoEl.textContent =
                `≈ ${enEur.toLocaleString('es-ES', { minimumFractionDigits: 2 })} EUR`;
        } catch { infoEl.textContent = ''; }
    }
    _guardar(e) {
        e.preventDefault();
        const tipo      = document.querySelector('input[name="tipo"]:checked')?.value;
        const monto     = parseFloat(document.getElementById('monto')?.value);
        const moneda    = document.getElementById('moneda')?.value;
        const categoria = document.getElementById('categoria')?.value;
        const fecha     = document.getElementById('fecha')?.value;
        if (!monto || isNaN(monto) || !fecha) {
            mostrarToast('⚠️ Completa todos los campos antes de guardar.');
            return;
        }
        const montoEnEur = moneda === 'EUR'
            ? monto
            : this.servicio.convertir(monto, moneda, 'EUR');
        guardarTransaccion({ tipo, monto, moneda, montoEnEur, categoria, fecha });
        mostrarToast('Transacción guardada ✓');
        document.getElementById('form-transaccion').reset();
        document.getElementById('fecha').valueAsDate = new Date();
        document.getElementById('conversion-info').textContent = '';
    }
    _agregarEventos() {
        ['monto', 'moneda'].forEach(id =>
            document.getElementById(id)
                ?.addEventListener('input', () => this._actualizarInfoConversion())
        );
        document.getElementById('form-transaccion')
            ?.addEventListener('submit', (e) => this._guardar(e));
    }
}
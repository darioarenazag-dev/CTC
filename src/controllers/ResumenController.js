import { BaseController } from './BaseController.js';
import { DomManager } from '../dom/DomManager.js';
import {
    calcularResumen, formatearEuros,
    filtrarTransacciones, eliminarTransaccion,
    exportarCSV, exportarPDF, mostrarToast
} from '../utils/StorageManager.js';
export class ResumenController extends BaseController {
    constructor(contenedor) {
        super(contenedor);
        this._filtros = { tipo: 'todos', categoria: 'todas', fechaDesde: '', fechaHasta: '', texto: '' };
    }
    iniciar() {
        this._inicializarBase(true);
        this.contenedor.innerHTML = DomManager.htmlMetricas();
        this._actualizarTotalesGlobales();
        this._renderizarGrafico();
        this._aplicarFiltros();
        this._agregarEventos();
    }
    _actualizarTotalesGlobales() {
        const { ingresos, gastos, ahorro } = calcularResumen();
        DomManager.setText(document.getElementById('total-ingresos'), formatearEuros(ingresos));
        DomManager.setText(document.getElementById('total-gastos'), formatearEuros(gastos));
        DomManager.setText(document.getElementById('total-ahorro'), formatearEuros(ahorro));
    }
    _renderizarGrafico() {
        const todas = calcularResumen().transacciones;
        const porCategoria = {};
        todas.forEach(t => {
            if (!porCategoria[t.categoria]) porCategoria[t.categoria] = { ingresos: 0, gastos: 0 };
            if (t.tipo === 'ingreso') porCategoria[t.categoria].ingresos += Number(t.montoEnEur);
            else porCategoria[t.categoria].gastos += Number(t.montoEnEur);
        });
        const datos = Object.entries(porCategoria)
            .map(([categoria, v]) => ({ categoria, ...v }))
            .filter(d => d.ingresos > 0 || d.gastos > 0);
        const wrap = document.getElementById('grafico-wrap');
        const card = document.getElementById('grafico-card');
        if (!wrap) return;
        if (!datos.length) { if (card) card.style.display = 'none'; return; }
        wrap.innerHTML = DomManager.htmlGrafico(datos);
    }
    _aplicarFiltros() {
        const transacciones = filtrarTransacciones(this._filtros)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const lista = document.getElementById('lista-transacciones');
        DomManager.vaciar(lista);
        const resumen = document.getElementById('filtros-resumen');
        const total = calcularResumen().transacciones.length;
        if (resumen) {
            resumen.textContent = transacciones.length < total
                ? `Mostrando ${transacciones.length} de ${total} transacciones`
                : '';
        }
        if (!transacciones.length) {
            DomManager.insertar(lista, DomManager.crearEstadoVacio());
            return;
        }
        transacciones.forEach(t =>
            DomManager.insertar(lista, DomManager.crearItemTransaccion(t, (id) => this._eliminar(id)))
        );
    }
    _eliminar(id) {
        eliminarTransaccion(id);
        this._actualizarTotalesGlobales();
        this._renderizarGrafico();
        this._aplicarFiltros();
        mostrarToast('Transacción eliminada ✓');
    }
    _agregarEventos() {
        document.getElementById('filtro-texto')
            ?.addEventListener('input', e => { this._filtros.texto = e.target.value; this._aplicarFiltros(); });
        document.getElementById('filtro-tipo')
            ?.addEventListener('change', e => { this._filtros.tipo = e.target.value; this._aplicarFiltros(); });
        document.getElementById('filtro-categoria')
            ?.addEventListener('change', e => { this._filtros.categoria = e.target.value; this._aplicarFiltros(); });
        document.getElementById('filtro-desde')
            ?.addEventListener('change', e => { this._filtros.fechaDesde = e.target.value; this._aplicarFiltros(); });
        document.getElementById('filtro-hasta')
            ?.addEventListener('change', e => { this._filtros.fechaHasta = e.target.value; this._aplicarFiltros(); });
        document.getElementById('btn-limpiar-filtros')
            ?.addEventListener('click', () => {
                this._filtros = { tipo: 'todos', categoria: 'todas', fechaDesde: '', fechaHasta: '', texto: '' };
                document.getElementById('filtro-texto').value = '';
                document.getElementById('filtro-tipo').value = 'todos';
                document.getElementById('filtro-categoria').value = 'todas';
                document.getElementById('filtro-desde').value = '';
                document.getElementById('filtro-hasta').value = '';
                this._aplicarFiltros();
            });
        document.getElementById('btn-export-csv')
            ?.addEventListener('click', () => {
                const t = filtrarTransacciones(this._filtros);
                if (!t.length) { mostrarToast('⚠️ No hay transacciones para exportar.'); return; }
                exportarCSV(t);
                mostrarToast('CSV exportado ✓');
            });
        document.getElementById('btn-export-pdf')
            ?.addEventListener('click', () => {
                const t = filtrarTransacciones(this._filtros);
                if (!t.length) { mostrarToast('⚠️ No hay transacciones para exportar.'); return; }
                const { ingresos, gastos, ahorro } = calcularResumen();
                exportarPDF(t, { ingresos, gastos, ahorro });
            });
    }
}
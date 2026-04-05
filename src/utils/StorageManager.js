import { claveTransaccionesUsuario } from './AuthManager.js';
export function leerTransacciones() {
    const clave = claveTransaccionesUsuario();
    return JSON.parse(localStorage.getItem(clave) || '[]');
}
export function guardarTransaccion(transaccion) {
    const clave = claveTransaccionesUsuario();
    const anteriores = leerTransacciones();
    anteriores.push({ id: Date.now(), ...transaccion });
    localStorage.setItem(clave, JSON.stringify(anteriores));
}
export function eliminarTransaccion(id) {
    const clave = claveTransaccionesUsuario();
    const filtradas = leerTransacciones().filter(t => t.id !== id);
    localStorage.setItem(clave, JSON.stringify(filtradas));
}
export function calcularResumen() {
    const transacciones = leerTransacciones();
    const ingresos = transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((acc, t) => acc + t.montoEnEur, 0);
    const gastos = transacciones
        .filter(t => t.tipo === 'gasto')
        .reduce((acc, t) => acc + t.montoEnEur, 0);
    return {
        ingresos: ingresos.toFixed(2),
        gastos: gastos.toFixed(2),
        ahorro: (ingresos - gastos).toFixed(2),
        transacciones
    };
}
export function formatearEuros(valor) {
    return '€' + Number(valor).toLocaleString('es-ES', { minimumFractionDigits: 2 });
}
export function formatearFecha(fechaISO) {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}
export function mostrarToast(mensaje, duracion = 3000) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), duracion);
}
export function filtrarTransacciones({ tipo = 'todos', categoria = 'todas', fechaDesde = '', fechaHasta = '', texto = '' } = {}) {
    return leerTransacciones().filter(t => {
        if (tipo !== 'todos' && t.tipo !== tipo) return false;
        if (categoria !== 'todas' && t.categoria !== categoria) return false;
        if (fechaDesde && t.fecha < fechaDesde) return false;
        if (fechaHasta && t.fecha > fechaHasta) return false;
        if (texto) {
            const q = texto.toLowerCase();
            if (!t.categoria.toLowerCase().includes(q) &&
                !String(t.monto).includes(q) &&
                !t.moneda.toLowerCase().includes(q)) return false;
        }
        return true;
    });
}
export function exportarCSV(transacciones) {
    const cabecera = ['Fecha', 'Tipo', 'Categoría', 'Monto', 'Moneda', 'Monto EUR'];
    const filas = transacciones.map(t => [
        t.fecha,
        t.tipo,
        t.categoria,
        t.monto,
        t.moneda,
        Number(t.montoEnEur).toFixed(2)
    ]);
    const csv = [cabecera, ...filas]
        .map(f => f.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacciones_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
export function exportarPDF(transacciones, resumen) {
    const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const filas = [...transacciones]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .map(t => {
            const signo = t.tipo === 'ingreso' ? '+' : '-';
            const color = t.tipo === 'ingreso' ? '#16a34a' : '#dc2626';
            const fechaStr = new Date(t.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            return `<tr>
                <td>${fechaStr}</td>
                <td><span style="text-transform:capitalize">${t.tipo}</span></td>
                <td>${t.categoria}</td>
                <td>${Number(t.monto).toLocaleString('es-ES')} ${t.moneda}</td>
                <td style="color:${color};font-weight:600">${signo}€${Number(t.montoEnEur).toLocaleString('es-ES',{minimumFractionDigits:2})}</td>
            </tr>`;
        }).join('');
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>Resumen ControlaTusCuentas</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; color: #0f172a; padding: 2rem; max-width: 900px; margin: 0 auto; }
        h1 { font-size: 1.6rem; margin-bottom: 0.25rem; color: #0f2352; }
        .sub { color: #64748b; font-size: 0.85rem; margin-bottom: 2rem; }
        .metricas { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .metrica { flex: 1; border-radius: 10px; padding: 1rem 1.25rem; border: 1px solid #e2e8f0; }
        .metrica.ingreso { border-left: 4px solid #16a34a; }
        .metrica.gasto   { border-left: 4px solid #dc2626; }
        .metrica.ahorro  { border-left: 4px solid #2563eb; }
        .metrica-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: .05em; color: #64748b; font-weight: 600; }
        .metrica-val { font-size: 1.4rem; font-weight: 700; margin-top: 0.2rem; }
        .metrica.ingreso .metrica-val { color: #16a34a; }
        .metrica.gasto   .metrica-val { color: #dc2626; }
        .metrica.ahorro  .metrica-val { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th { background: #f1f5f9; padding: 0.6rem 0.75rem; text-align: left; font-size: 0.72rem; text-transform: uppercase; letter-spacing: .05em; color: #64748b; }
        td { padding: 0.6rem 0.75rem; border-bottom: 1px solid #f1f5f9; }
        tr:last-child td { border-bottom: none; }
        .footer { margin-top: 2rem; font-size: 0.75rem; color: #94a3b8; text-align: center; }
    </style></head><body>
    <h1>ControlaTusCuentas</h1>
    <p class="sub">Resumen exportado el ${fecha}</p>
    <div class="metricas">
        <div class="metrica ingreso"><div class="metrica-label">Ingresos</div><div class="metrica-val">€${Number(resumen.ingresos).toLocaleString('es-ES',{minimumFractionDigits:2})}</div></div>
        <div class="metrica gasto"><div class="metrica-label">Gastos</div><div class="metrica-val">€${Number(resumen.gastos).toLocaleString('es-ES',{minimumFractionDigits:2})}</div></div>
        <div class="metrica ahorro"><div class="metrica-label">Balance</div><div class="metrica-val">€${Number(resumen.ahorro).toLocaleString('es-ES',{minimumFractionDigits:2})}</div></div>
    </div>
    <table><thead><tr><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Monto original</th><th>Monto EUR</th></tr></thead>
    <tbody>${filas}</tbody></table>
    <p class="footer">© ${new Date().getFullYear()} ControlaTusCuentas — Exportado automáticamente</p>
    </body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
}
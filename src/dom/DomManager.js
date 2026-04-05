export class DomManager {
    static crear(tag, attrs = {}, innerHTML = '') {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    }
    static vaciar(el) { if (el) el.innerHTML = ''; }
    static setText(el, texto) { if (el) el.textContent = texto; }
    static insertar(padre, hijo) { if (padre && hijo) padre.appendChild(hijo); }
    static mostrarError(contenedor, mensaje) {
        if (contenedor)
            contenedor.innerHTML = `<p class="api-error">${mensaje}</p>`;
    }
    static htmlMarca() {
        return `<a href="index.html" class="header-marca">Controla<span>Tus</span>Cuentas</a>`;
    }
    static htmlBtnTema() {
        return `
        <button id="btn-tema" aria-label="Activar modo oscuro" title="Activar modo oscuro">
            <span class="btn-tema-icono"></span>
            <span class="btn-tema-label">Oscuro</span>
        </button>`;
    }
    static htmlBtnUsuario(usuario) {
        const inicial = usuario.nombre.charAt(0).toUpperCase();
        return `
        <div class="usuario-menu">
            <button class="usuario-avatar" id="btn-usuario-menu"
                    aria-label="Menú de usuario" title="${usuario.nombre}">
                ${inicial}
            </button>
            <div class="usuario-dropdown" id="usuario-dropdown">
                <div class="usuario-info">
                    <span class="usuario-nombre">${usuario.nombre}</span>
                    <span class="usuario-email">${usuario.email}</span>
                </div>
                <hr class="usuario-hr">
                <button class="usuario-salir" id="btn-cerrar-sesion">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Cerrar sesión
                </button>
            </div>
        </div>`;
    }
    static htmlBtnAcceder() {
        return `
        <button class="btn-acceder" id="btn-acceder" aria-label="Iniciar sesión o crear cuenta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Acceder
        </button>`;
    }
    static htmlModalLogin(modo = 'login') {
        const esLogin = modo === 'login';
        return `
        <div class="login-modal-overlay" id="login-modal-overlay"></div>
        <div class="login-modal" id="login-modal" role="dialog"
             aria-modal="true" aria-label="Iniciar sesión" style="position:fixed">
            <button class="login-modal-cerrar" id="login-modal-cerrar" aria-label="Cerrar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <div class="login-modal-marca">
                <span class="login-modal-marca-texto">
                    Controla<span>Tus</span>Cuentas
                </span>
            </div>
            <div class="login-modal-tabs">
                <button id="modal-tab-login"
                        class="login-modal-tab ${esLogin ? 'activo' : ''}">
                    Iniciar sesión
                </button>
                <button id="modal-tab-registro"
                        class="login-modal-tab ${!esLogin ? 'activo' : ''}">
                    Crear cuenta
                </button>
            </div>
            <form id="modal-form-auth" novalidate>
                ${!esLogin ? `
                <div class="form-grupo">
                    <label for="modal-auth-nombre">Nombre</label>
                    <input type="text" id="modal-auth-nombre" placeholder="Tu nombre"
                           autocomplete="name" required>
                </div>` : ''}
                <div class="form-grupo">
                    <label for="modal-auth-email">Email</label>
                    <input type="email" id="modal-auth-email" placeholder="tu@email.com"
                           autocomplete="email" required>
                </div>
                <div class="form-grupo">
                    <label for="modal-auth-password">Contraseña</label>
                    <div class="input-password">
                        <input type="password" id="modal-auth-password"
                               placeholder="${esLogin ? 'Tu contraseña' : 'Mínimo 6 caracteres'}"
                               autocomplete="${esLogin ? 'current-password' : 'new-password'}"
                               required>
                        <button type="button" class="btn-ver-password"
                                id="modal-btn-ver-password" aria-label="Ver contraseña">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>
                </div>
                ${!esLogin ? `
                <div class="form-grupo">
                    <label for="modal-auth-password2">Repetir contraseña</label>
                    <div class="input-password">
                        <input type="password" id="modal-auth-password2"
                               placeholder="Repite la contraseña"
                               autocomplete="new-password" required>
                    </div>
                </div>` : ''}
                <div class="login-modal-error" id="modal-auth-error"></div>
                <button type="submit" class="boton boton-full login-modal-submit">
                    ${esLogin ? 'Entrar' : 'Crear cuenta'}
                </button>
            </form>
            <p class="login-modal-pie">
                ${esLogin
                ? '¿No tienes cuenta? <button class="auth-link" id="modal-tab-registro-pie">Regístrate</button>'
                : '¿Ya tienes cuenta? <button class="auth-link" id="modal-tab-login-pie">Inicia sesión</button>'
            }
            </p>
        </div>`;
    }
    static htmlAuth(modo) {
        const esLogin = modo === 'login';
        return `
        <div class="auth-wrapper">
            <div class="auth-card">
                <div class="auth-brand">
                    <h1>Controla<span>Tus</span>Cuentas</h1>
                    <p>Gestiona tus finanzas de forma simple y clara.</p>
                </div>
                <div class="auth-tabs">
                    <button id="tab-login"
                            class="auth-tab ${esLogin ? 'activo' : ''}">
                        Iniciar sesión
                    </button>
                    <button id="tab-registro"
                            class="auth-tab ${!esLogin ? 'activo' : ''}">
                        Crear cuenta
                    </button>
                </div>
                <form id="form-auth" novalidate>
                    ${!esLogin ? `
                    <div class="form-grupo">
                        <label for="auth-nombre">Nombre</label>
                        <input type="text" id="auth-nombre" placeholder="Tu nombre"
                               autocomplete="name" required>
                    </div>` : ''}
                    <div class="form-grupo">
                        <label for="auth-email">Email</label>
                        <input type="email" id="auth-email" placeholder="tu@email.com"
                               autocomplete="email" required>
                    </div>
                    <div class="form-grupo">
                        <label for="auth-password">Contraseña</label>
                        <div class="input-password">
                            <input type="password" id="auth-password"
                                   placeholder="${esLogin ? 'Tu contraseña' : 'Mínimo 6 caracteres'}"
                                   autocomplete="${esLogin ? 'current-password' : 'new-password'}"
                                   required>
                            <button type="button" class="btn-ver-password"
                                    id="btn-ver-password" aria-label="Ver contraseña">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ${!esLogin ? `
                    <div class="form-grupo">
                        <label for="auth-password2">Repetir contraseña</label>
                        <div class="input-password">
                            <input type="password" id="auth-password2"
                                   placeholder="Repite la contraseña"
                                   autocomplete="new-password" required>
                        </div>
                    </div>` : ''}
                    <div class="auth-error" id="auth-error"></div>
                    <button type="submit" class="boton boton-full auth-submit">
                        ${esLogin ? 'Entrar' : 'Crear cuenta'}
                    </button>
                </form>
                <p class="auth-pie">
                    ${esLogin
                ? '¿No tienes cuenta? <button class="auth-link" id="tab-registro">Regístrate</button>'
                : '¿Ya tienes cuenta? <button class="auth-link" id="tab-login">Inicia sesión</button>'
            }
                </p>
            </div>
        </div>`;
    }
    static htmlHero() {
        return `
        <div class="hero">
            <h2>Tu dinero,<br>bajo control</h2>
            <p>Registra ingresos y gastos, y consulta tipos de cambio en tiempo real.</p>
            <a href="registro.html" class="boton">Registrar transacción</a>
        </div>`;
    }
    static htmlWidgetDivisas() {
        return `
        <div class="widget-divisas">
            <div class="widget-header">
                <span class="widget-titulo">
                    <span class="punto-vivo"></span>
                    Tipos de cambio en vivo
                </span>
                <span class="widget-fecha" id="widget-fecha"></span>
            </div>
            <div class="conversor">
                <input type="number" id="input-cantidad" value="1" min="0" step="any">
                <select id="select-origen"></select>
                <span class="conversor-flecha">→</span>
                <select id="select-destino"></select>
            </div>
            <div class="resultado-conversion" id="resultado-conversion">Cargando…</div>
            <div class="tasas-grid" id="tasas-grid"></div>
        </div>`;
    }
    static crearTarjetaTasa(moneda, tasa) {
        return DomManager.crear('div', { class: 'tasa-item' }, `
            <span class="tasa-moneda">${moneda}</span>
            <span class="tasa-valor">${tasa.toFixed(4)}</span>
        `);
    }
    static poblarSelectMonedas(select, monedas, valorPorDefecto = 'EUR') {
        if (!select) return;
        select.innerHTML = monedas
            .map(m => `<option value="${m}">${m}</option>`)
            .join('');
        select.value = valorPorDefecto;
    }
    static htmlFormulario() {
        return `
        <div class="pagina-titulo">
            <h2>Nueva transacción</h2>
        </div>
        <p class="pagina-subtitulo">Registra un ingreso o gasto en cualquier moneda.</p>
        <div class="form-card">
            <form id="form-transaccion">
                <div class="form-grupo">
                    <label>Tipo</label>
                    <div class="tipo-selector">
                        <input type="radio" name="tipo" id="tipo-ingreso"
                               value="ingreso" class="tipo-opcion" checked>
                        <label for="tipo-ingreso" class="tipo-label ingreso">↑ Ingreso</label>
                        <input type="radio" name="tipo" id="tipo-gasto"
                               value="gasto" class="tipo-opcion">
                        <label for="tipo-gasto" class="tipo-label gasto">↓ Gasto</label>
                    </div>
                </div>
                <div class="form-grupo">
                    <label for="monto">Monto</label>
                    <div class="fila-monto">
                        <input type="number" id="monto" name="monto"
                               placeholder="0.00" min="0" step="any">
                        <select id="moneda" name="moneda"></select>
                    </div>
                    <div class="conversion-info" id="conversion-info"></div>
                </div>
                <div class="form-grupo">
                    <label for="categoria">Categoría</label>
                    <select id="categoria" name="categoria">
                        <option>Salario</option>
                        <option>Alimentación</option>
                        <option>Transporte</option>
                        <option>Ocio</option>
                        <option>Salud</option>
                        <option>Vivienda</option>
                        <option>Otros</option>
                    </select>
                </div>
                <div class="form-grupo">
                    <label for="fecha">Fecha</label>
                    <input type="date" id="fecha" name="fecha">
                </div>
                <button type="submit" class="boton boton-full">
                    Guardar transacción
                </button>
            </form>
        </div>`;
    }
    static htmlMetricas() {
        return `
        <div class="pagina-titulo resumen-titulo-row">
            <h2>Resumen</h2>
            <div class="export-btns">
                <button class="boton boton-sm boton-outline" id="btn-export-csv">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    CSV
                </button>
                <button class="boton boton-sm boton-outline" id="btn-export-pdf">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    PDF
                </button>
            </div>
        </div>
        <p class="pagina-subtitulo">Todos los importes convertidos a EUR.</p>
        <div class="metricas-grid">
            <div class="metrica ingreso">
                <div>
                    <div class="metrica-etiqueta">Ingresos</div>
                    <div class="metrica-valor" id="total-ingresos">€0.00</div>
                </div>
            </div>
            <div class="metrica gasto">
                <div>
                    <div class="metrica-etiqueta">Gastos</div>
                    <div class="metrica-valor" id="total-gastos">€0.00</div>
                </div>
            </div>
            <div class="metrica ahorro">
                <div>
                    <div class="metrica-etiqueta">Balance</div>
                    <div class="metrica-valor" id="total-ahorro">€0.00</div>
                </div>
            </div>
        </div>
        <div class="grafico-card" id="grafico-card">
            <div class="grafico-titulo">
                <span>Ingresos vs Gastos por categoría</span>
            </div>
            <div class="grafico-wrap" id="grafico-wrap"></div>
        </div>
        <div class="filtros-card">
            <div class="filtros-fila">
                <input type="search" id="filtro-texto" placeholder="Buscar por categoría, moneda…" class="filtro-input">
                <select id="filtro-tipo" class="filtro-select">
                    <option value="todos">Todos</option>
                    <option value="ingreso">Ingresos</option>
                    <option value="gasto">Gastos</option>
                </select>
                <select id="filtro-categoria" class="filtro-select">
                    <option value="todas">Categorías</option>
                    <option>Salario</option>
                    <option>Alimentación</option>
                    <option>Transporte</option>
                    <option>Ocio</option>
                    <option>Salud</option>
                    <option>Vivienda</option>
                    <option>Otros</option>
                </select>
                <input type="date" id="filtro-desde" class="filtro-input" title="Desde">
                <input type="date" id="filtro-hasta" class="filtro-input" title="Hasta">
                <button class="boton boton-sm boton-outline" id="btn-limpiar-filtros">✕ Limpiar</button>
            </div>
            <div class="filtros-resumen" id="filtros-resumen"></div>
        </div>
        <div id="lista-transacciones" class="lista-transacciones"></div>
        <a href="registro.html" class="boton" style="margin-top:1.5rem; display:inline-flex;">
            + Nueva transacción
        </a>`;
    }
    static htmlGrafico(datos) {
        if (!datos.length) return '<p class="grafico-vacio">Sin datos para mostrar.</p>';
        const max = Math.max(...datos.map(d => Math.max(d.ingresos, d.gastos)), 1);
        const barras = datos.map(d => {
            const hI = Math.round((d.ingresos / max) * 120);
            const hG = Math.round((d.gastos / max) * 120);
            return `<div class="grafico-grupo">
                <div class="grafico-barras">
                    <div class="barra barra-ingreso" style="height:${hI}px" title="Ingresos: €${d.ingresos.toFixed(2)}"></div>
                    <div class="barra barra-gasto"   style="height:${hG}px" title="Gastos: €${d.gastos.toFixed(2)}"></div>
                </div>
                <span class="grafico-label">${d.categoria.slice(0, 6)}</span>
            </div>`;
        }).join('');
        return `<div class="grafico-leyenda">
            <span class="leyenda-item"><span class="leyenda-dot ingreso"></span>Ingresos</span>
            <span class="leyenda-item"><span class="leyenda-dot gasto"></span>Gastos</span>
        </div>
        <div class="grafico-barras-wrap">${barras}</div>`;
    }
    static crearItemTransaccion(transaccion, onEliminar) {
        const { id, tipo, categoria, fecha, montoEnEur, monto, moneda } = transaccion;
        const signo = tipo === 'ingreso' ? '+' : '-';
        const importe = Number(montoEnEur).toLocaleString('es-ES', { minimumFractionDigits: 2 });
        const original = moneda !== 'EUR' ? `<span class="trans-original">${Number(monto).toLocaleString('es-ES')} ${moneda}</span>` : '';
        const fechaStr = new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
        const el = DomManager.crear('div', { class: `transaccion-item ${tipo}`, 'data-id': id }, `
            <div class="trans-info">
                <span class="trans-categoria">${categoria}</span>
                <span class="trans-fecha">${fechaStr}</span>
                ${original}
            </div>
            <div class="trans-derecha">
                <span class="trans-monto ${tipo}">${signo}€${importe}</span>
                <button class="btn-eliminar-trans" aria-label="Eliminar transacción" title="Eliminar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                </button>
            </div>
        `);
        el.querySelector('.btn-eliminar-trans')?.addEventListener('click', () => onEliminar && onEliminar(id));
        return el;
    }
    static crearEstadoVacio() {
        return DomManager.crear('div', { class: 'estado-vacio' }, `
            <span>📭</span>
            Aún no hay transacciones registradas.
        `);
    }
}
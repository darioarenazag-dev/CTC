const CLAVE_TEMA = 'ctc-tema';
const TEMA_OSCURO = 'oscuro';
const TEMA_CLARO = 'claro';
const SVG_BOMBILLA_ON = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M9 21h6M12 3a6 6 0 0 1 4 10.47V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-3.53A6 6 0 0 1 12 3z"
        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.5 14.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="12" cy="9" r="1.5" fill="currentColor" opacity="0.6"/>
</svg>`;
const SVG_BOMBILLA_OFF = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M9 21h6M12 3a6 6 0 0 1 4 10.47V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-3.53A6 6 0 0 1 12 3z"
        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        opacity="0.45"/>
  <path d="M9.5 14.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
  <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" opacity="0.5"/>
</svg>`;
export function leerTema() {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado) return guardado;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? TEMA_OSCURO
        : TEMA_CLARO;
}
export function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem(CLAVE_TEMA, tema);
}
export function alternarTema() {
    const actual = leerTema();
    const nuevo = actual === TEMA_OSCURO ? TEMA_CLARO : TEMA_OSCURO;
    aplicarTema(nuevo);
    return nuevo;
}
export function actualizarBoton(boton, tema) {
    if (!boton) return;
    const esOscuro = tema === TEMA_OSCURO;
    const iconoEl = boton.querySelector('.btn-tema-icono');
    const labelEl = boton.querySelector('.btn-tema-label');
    if (iconoEl) iconoEl.innerHTML = esOscuro ? SVG_BOMBILLA_OFF : SVG_BOMBILLA_ON;
    if (labelEl) labelEl.textContent = esOscuro ? 'Claro' : 'Oscuro';
    boton.setAttribute('aria-label',
        esOscuro ? 'Activar modo claro' : 'Activar modo oscuro');
    boton.setAttribute('title',
        esOscuro ? 'Activar modo claro' : 'Activar modo oscuro');
}
export function inicializarTema(boton) {
    const temaInicial = leerTema();
    aplicarTema(temaInicial);
    actualizarBoton(boton, temaInicial);
    boton?.addEventListener('click', () => {
        const nuevoTema = alternarTema();
        actualizarBoton(boton, nuevoTema);
    });
}
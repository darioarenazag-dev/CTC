import { DomManager } from '../dom/DomManager.js';
import { inicializarTema } from '../utils/ThemeManager.js';
import { registrarUsuario, iniciarSesion, haySesion } from '../utils/AuthManager.js';
export class AuthController {
    constructor(contenedor) {
        this.contenedor = contenedor;
        this.modo = 'login';
    }
    iniciar() {
        if (haySesion()) {
            window.location.href = 'index.html';
            return;
        }
        this._renderizar();
        this._agregarEventos();
    }
    _renderizar() {
        this.contenedor.innerHTML = DomManager.htmlAuth(this.modo);
    }
    _cambiarModo(modo) {
        this.modo = modo;
        this._renderizar();
        this._agregarEventos();
    }
    _agregarEventos() {
        document.getElementById('tab-login')
            ?.addEventListener('click', () => this._cambiarModo('login'));
        document.getElementById('tab-registro')
            ?.addEventListener('click', () => this._cambiarModo('registro'));
        document.getElementById('form-auth')
            ?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.modo === 'login'
                    ? this._handleLogin()
                    : this._handleRegistro();
            });
    }
    _handleLogin() {
        const email = document.getElementById('auth-email')?.value.trim();
        const password = document.getElementById('auth-password')?.value;
        const resultado = iniciarSesion({ email, password });
        if (!resultado.ok) {
            this._mostrarError(resultado.error);
            return;
        }
        window.location.href = 'index.html';
    }
    _handleRegistro() {
        const nombre = document.getElementById('auth-nombre')?.value.trim();
        const email = document.getElementById('auth-email')?.value.trim();
        const password = document.getElementById('auth-password')?.value;
        const password2 = document.getElementById('auth-password2')?.value;
        if (password !== password2) {
            this._mostrarError('Las contraseñas no coinciden.');
            return;
        }
        const resultado = registrarUsuario({ nombre, email, password });
        if (!resultado.ok) {
            this._mostrarError(resultado.error);
            return;
        }
        iniciarSesion({ email, password });
        window.location.href = 'index.html';
    }
    _mostrarError(mensaje) {
        const errorEl = document.getElementById('auth-error');
        if (!errorEl) return;
        errorEl.textContent = mensaje;
        errorEl.classList.add('visible');
        clearTimeout(this._errorTimer);
        this._errorTimer = setTimeout(() => {
            errorEl.classList.remove('visible');
        }, 4000);
    }
}
import { DomManager } from '../dom/DomManager.js';
import { inicializarTema } from '../utils/ThemeManager.js';
import {
    protegerPagina, obtenerSesion,
    cerrarSesion, registrarUsuario,
    iniciarSesion, haySesion
} from '../utils/AuthManager.js';
export class BaseController {
    constructor(contenedor) {
        this.contenedor = contenedor;
        this._modoModal = 'login';
    }
    _inicializarBase(protegida = true) {
        if (protegida) protegerPagina('login.html');
        document.getElementById('tema-slot').innerHTML = DomManager.htmlBtnTema();
        inicializarTema(document.getElementById('btn-tema'));
        const marcaSlot = document.getElementById('marca-slot');
        if (marcaSlot) marcaSlot.innerHTML = DomManager.htmlMarca();
        const sesion = obtenerSesion();
        const usuarioSlot = document.getElementById('usuario-slot');
        if (usuarioSlot) {
            if (sesion) {
                usuarioSlot.innerHTML = DomManager.htmlBtnUsuario(sesion);
                this._inicializarMenuUsuario();
            } else {
                usuarioSlot.innerHTML = DomManager.htmlBtnAcceder();
                this._inicializarModalLogin();
            }
        }
    }
    _inicializarMenuUsuario() {
        const btnMenu = document.getElementById('btn-usuario-menu');
        const dropdown = document.getElementById('usuario-dropdown');
        const btnSalir = document.getElementById('btn-cerrar-sesion');
        btnMenu?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.toggle('abierto');
        });
        document.addEventListener('click', () => {
            dropdown?.classList.remove('abierto');
        });
        btnSalir?.addEventListener('click', () => {
            cerrarSesion();
            window.location.reload();
        });
    }
    _inicializarModalLogin() {
        const wrapper = document.createElement('div');
        wrapper.id = 'login-modal-root';
        wrapper.innerHTML = DomManager.htmlModalLogin('login');
        document.body.appendChild(wrapper);
        this._bindModalEventos();
        document.getElementById('btn-acceder')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this._abrirModal();
        });
    }
    _abrirModal() {
        document.getElementById('login-modal-overlay')?.classList.add('abierto');
        document.getElementById('login-modal')?.classList.add('abierto');
        setTimeout(() => {
            document.getElementById('modal-auth-email')?.focus();
        }, 100);
    }
    _cerrarModal() {
        document.getElementById('login-modal-overlay')?.classList.remove('abierto');
        document.getElementById('login-modal')?.classList.remove('abierto');
    }
    _reconstruirModal(modo) {
        this._modoModal = modo;
        const root = document.getElementById('login-modal-root');
        if (!root) return;
        root.innerHTML = DomManager.htmlModalLogin(modo);
        this._bindModalEventos();
        this._abrirModal();
    }
    _bindModalEventos() {
        document.getElementById('login-modal-cerrar')
            ?.addEventListener('click', () => this._cerrarModal());
        document.getElementById('login-modal-overlay')
            ?.addEventListener('click', () => this._cerrarModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this._cerrarModal();
        }, { once: true });
        document.getElementById('modal-tab-login')
            ?.addEventListener('click', () => this._reconstruirModal('login'));
        document.getElementById('modal-tab-registro')
            ?.addEventListener('click', () => this._reconstruirModal('registro'));
        document.getElementById('modal-tab-registro-pie')
            ?.addEventListener('click', () => this._reconstruirModal('registro'));
        document.getElementById('modal-tab-login-pie')
            ?.addEventListener('click', () => this._reconstruirModal('login'));
        document.getElementById('modal-form-auth')
            ?.addEventListener('submit', (e) => {
                e.preventDefault();
                this._modoModal === 'login'
                    ? this._handleModalLogin()
                    : this._handleModalRegistro();
            });
        document.getElementById('modal-btn-ver-password')
            ?.addEventListener('click', () => {
                const inp = document.getElementById('modal-auth-password');
                if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
            });
    }
    _handleModalLogin() {
        const email = document.getElementById('modal-auth-email')?.value.trim();
        const password = document.getElementById('modal-auth-password')?.value;
        const resultado = iniciarSesion({ email, password });
        if (!resultado.ok) { this._mostrarModalError(resultado.error); return; }
        window.location.reload();
    }
    _handleModalRegistro() {
        const nombre = document.getElementById('modal-auth-nombre')?.value.trim();
        const email = document.getElementById('modal-auth-email')?.value.trim();
        const password = document.getElementById('modal-auth-password')?.value;
        const password2 = document.getElementById('modal-auth-password2')?.value;
        if (password !== password2) {
            this._mostrarModalError('Las contraseñas no coinciden.'); return;
        }
        const resultado = registrarUsuario({ nombre, email, password });
        if (!resultado.ok) { this._mostrarModalError(resultado.error); return; }
        iniciarSesion({ email, password });
        window.location.reload();
    }
    _mostrarModalError(mensaje) {
        const el = document.getElementById('modal-auth-error');
        if (!el) return;
        el.textContent = mensaje;
        el.classList.add('visible');
        clearTimeout(this._modalErrorTimer);
        this._modalErrorTimer = setTimeout(() => el.classList.remove('visible'), 4000);
    }
}
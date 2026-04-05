const CLAVE_USUARIOS = 'ctc-usuarios';
const CLAVE_SESION   = 'ctc-sesion';
function hashSimple(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16); 
}
function leerUsuarios() {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || '[]');
}
function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}
function buscarUsuario(email) {
    return leerUsuarios().find(u => u.email.toLowerCase() === email.toLowerCase());
}
export function registrarUsuario({ nombre, email, password }) {
    if (!nombre.trim() || !email.trim() || !password)
        return { ok: false, error: 'Todos los campos son obligatorios.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { ok: false, error: 'El email no tiene un formato válido.' };
    if (password.length < 6)
        return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    if (buscarUsuario(email))
        return { ok: false, error: 'Ya existe una cuenta con ese email.' };
    const usuarios = leerUsuarios();
    const nuevoUsuario = {
        id:           Date.now().toString(),
        nombre:       nombre.trim(),
        email:        email.toLowerCase().trim(),
        passwordHash: hashSimple(password),
        creadoEn:     new Date().toISOString(),
    };
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    return { ok: true, usuario: nuevoUsuario };
}
export function iniciarSesion({ email, password }) {
    if (!email.trim() || !password)
        return { ok: false, error: 'Introduce tu email y contraseña.' };
    const usuario = buscarUsuario(email);
    if (!usuario)
        return { ok: false, error: 'No existe ninguna cuenta con ese email.' };
    if (usuario.passwordHash !== hashSimple(password))
        return { ok: false, error: 'Contraseña incorrecta.' };
    const sesion = {
        id:     usuario.id,
        nombre: usuario.nombre,
        email:  usuario.email,
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return { ok: true, usuario: sesion };
}
export function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}
export function obtenerSesion() {
    const raw = localStorage.getItem(CLAVE_SESION);
    return raw ? JSON.parse(raw) : null;
}
export function haySesion() {
    return obtenerSesion() !== null;
}
export function protegerPagina(rutaLogin = 'login.html') {
    if (!haySesion()) {
        window.location.href = rutaLogin;
    }
}
export function claveTransaccionesUsuario() {
    const sesion = obtenerSesion();
    return sesion ? `ctc-transacciones-${sesion.id}` : 'ctc-transacciones-anonimo';
}
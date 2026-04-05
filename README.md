# ControlaTusCuentas

Es un aplicación web ligera y funcional diseñada para ayudar a los usuarios en la gestión de sus finanzas personales. Con soporte multidivisa, autenticación simulada, modo oscuro y exportación de datos.

---

## Descripción

ControlaTusCuentas permite registrar ingresos y gastos en cualquier moneda, consultar tipos de cambio en tiempo real y obtener un resumen visual del estado financiero personal. Toda la información se almacena localmente en el navegador del usuario, sin necesidad de servidor.

---

## Características

- Registro de transacciones en cualquier divisa con conversión automática a EUR
- Consulta de tipos de cambio en tiempo real mediante la API de ExchangeRate
- Conversor de divisas interactivo en la página de inicio
- Resumen financiero con métricas de ingresos, gastos y balance
- Gráfico de barras agrupadas por categoría (sin dependencias externas)
- Sistema de filtrado por tipo, categoría, rango de fechas y texto libre
- Eliminación de transacciones desde el resumen
- Exportación de datos a CSV y PDF
- Autenticación simulada con registro, login y sesión por usuario
- Modo oscuro/claro con persistencia en `localStorage`
- Diseño Mobile First con header adaptable: dos filas en móvil, una fila centrada en desktop
- Sin dependencias de frameworks externos (vanilla JS con ES Modules)

---

## Estructura del proyecto

```
/
├── index.html              # Página de inicio con conversor y tipos de cambio
├── login.html              # Página de autenticación (login / registro)
├── registro.html           # Formulario de registro de transacciones
├── resumen.html            # Resumen, filtros, gráfico y exportación
├── style.css               # Estilos globales (Mobile First + modo oscuro)
└── src/
    ├── api/
    │   ├── ApiService.js         # Cliente HTTP base (fetch)
    │   └── DivisasService.js     # Lógica de divisas (hereda ApiService)
    ├── controllers/
    │   ├── BaseController.js     # Controlador base: auth, tema, modal login
    │   ├── AuthController.js     # Controlador de login.html
    │   ├── InicioController.js   # Controlador de index.html
    │   ├── RegistroController.js # Controlador de registro.html
    │   └── ResumenController.js  # Controlador de resumen.html
    ├── dom/
    │   └── DomManager.js         # Generación y manipulación del DOM
    └── utils/
        ├── AuthManager.js        # Registro, login, sesión (localStorage)
        ├── StorageManager.js     # Transacciones, filtros, exportación
        └── ThemeManager.js       # Modo oscuro/claro
```

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de las páginas |
| CSS3 | Estilos, variables CSS, Grid, Flexbox, Media Queries |
| JavaScript ES2020 | Lógica de la aplicación con ES Modules |
| Fetch API | Consumo de API externa de divisas |
| localStorage | Persistencia de usuarios, sesión, transacciones y preferencias |
| ExchangeRate API | Tipos de cambio en tiempo real (`open.exchangerate-api.com`) |

---

## API externa

La aplicación consume la API pública de ExchangeRate para obtener los tipos de cambio:

```
GET https://open.exchangerate-api.com/v6/latest/EUR
```

No requiere clave de API. Los datos se actualizan una vez al día en el servidor externo.

---

## Arquitectura

El proyecto sigue el patrón **MVC** implementado con clases de JavaScript:

- **Model**: `AuthManager`, `StorageManager`, `DivisasService` — gestionan datos y lógica de negocio.
- **View**: `DomManager` — genera todo el HTML dinámico mediante métodos estáticos.
- **Controller**: `BaseController` y sus subclases — coordinan modelo y vista, y gestionan eventos.

La herencia se usa entre `ApiService → DivisasService` y `BaseController → InicioController / RegistroController / ResumenController / AuthController`.

---

## POO: clases principales

| Clase | Hereda de | Responsabilidad |
|---|---|---|
| `ApiService` | — | Cliente HTTP base con `fetchData()` |
| `DivisasService` | `ApiService` | Carga tasas, convierte monedas, filtra destacadas |
| `BaseController` | — | Protección de ruta, tema, modal de login, menú usuario |
| `InicioController` | `BaseController` | Página de inicio y conversor |
| `RegistroController` | `BaseController` | Formulario de transacciones |
| `ResumenController` | `BaseController` | Filtros, gráfico, métricas, exportación |
| `AuthController` | — | Formulario de login/registro en página dedicada |
| `DomManager` | — | Métodos estáticos de generación de HTML |

---

## Instalación y uso

No requiere instalación ni servidor. Basta con abrir `index.html` en un navegador moderno con soporte de ES Modules.

Si se usa desde el sistema de archivos local (`file://`), algunos navegadores bloquean los ES Modules. Se recomienda servir con cualquier servidor estático:

```bash
# Con Node.js
npx serve .

# Con Python
python3 -m http.server 8080
```

A continuación abrir `http://localhost:8080` en el navegador.

---

## Autenticación simulada

El sistema de autenticación no utiliza backend. Los usuarios se almacenan en `localStorage` con las contraseñas hasheadas mediante el algoritmo djb2. Cada usuario tiene sus transacciones aisladas en su propia clave de `localStorage`.

---

## Exportación de datos

Desde la página de Resumen se pueden exportar las transacciones (aplicando los filtros activos) en dos formatos:

- **CSV**: descarga directa, compatible con Excel, LibreOffice y Google Sheets. Incluye BOM UTF-8 para correcta visualización de caracteres especiales.
- **PDF**: abre una ventana con el resumen maquetado y lanza el diálogo de impresión del navegador, desde el que se puede guardar como PDF.

---

## Requisitos del navegador

Cualquier navegador moderno con soporte de:

- ES Modules (`type="module"`)
- CSS Custom Properties
- CSS Grid y Flexbox
- `fetch` API
- `localStorage`

---


## Autor

- Darío Arenaza

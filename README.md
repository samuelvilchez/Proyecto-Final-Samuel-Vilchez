# InvGest IA

## Título del Proyecto y Descripción General

**InvGest IA** es una aplicación web de gestión inteligente de inventarios diseñada para centrales de abasto, pequeños comercios y operaciones que necesitan controlar existencias sin depender de sistemas empresariales complejos.

El software centraliza el catálogo de productos, proveedores, movimientos de inventario y cuentas de usuarios. También analiza el historial de ventas para calcular cobertura estimada y sugerir cantidades de reposición considerando la demanda promedio y el plazo de entrega de cada proveedor. Resuelve el problema de las decisiones reactivas ante faltantes, excedentes o falta de trazabilidad, y permite separar permisos entre administradores, delegados y dependientes.

La interfaz funciona en el navegador y conserva una copia local mediante `localStorage`. Para sincronizar cada cambio con `data.json`, utiliza el servidor local incluido en `server.py`.

## Tecnologías y Librerías Utilizadas

- **HTML5:** estructura semántica de las vistas, formularios, tablas y elementos interactivos.
- **CSS3:** diseño responsivo, variables visuales, estados, animaciones y organización adaptable de la interfaz.
- **JavaScript:** lógica de aplicación, autenticación local, permisos, renderizado dinámico, filtros, movimientos y persistencia.
- **JSON:** datos iniciales de proveedores, productos, movimientos, usuarios y reposiciones.
- **Web Storage API:** persistencia local de datos y recuperación de la sesión activa mediante `localStorage`.
- **Fetch API:** lectura y persistencia de `data.json`, sincronización periódica y comunicación con el proxy de Gemini.
- **Google Gemini API:** recomendaciones de reorden opcionales basadas en existencias, ventas recientes y plazo de proveedor.
- **Blob y URL APIs:** generación y descarga de reportes CSV.
- **Google Fonts:** tipografías DM Sans y Manrope cargadas desde CDN.
- **Python 3:** servidor HTTP local, sin dependencias externas, que sirve la aplicación y actualiza `data.json`.
- **Python/Pandas o frameworks adicionales:** no forman parte de la implementación actual. El proyecto utiliza JavaScript nativo y no requiere Node.js, Pandas, React, Angular ni una base de datos externa.

## Estructura del Repositorio

- **`index.html`:** contiene la estructura de inicio de sesión, navegación, panel general, inventario, reposición inteligente y reportes.
- **`app.js`:** concentra el estado de la aplicación y controla carga de datos, autenticación, permisos, renderizado, eventos, reglas de reposición y persistencia.
- **`style.css`:** define toda la apariencia visual, los componentes responsivos y los estados de la interfaz.
- **`data.json`:** proporciona el catálogo inicial, proveedores, movimientos, usuarios y reposiciones.
- **`server.py`:** sirve los archivos del proyecto, lee y guarda `data.json` mediante `GET/POST /api/data` y reenvía análisis a Gemini mediante `POST /api/gemini/replenishment`.
- **`README.md`:** explica la instalación, configuración, estructura y uso de la aplicación.

## Instrucciones de Instalación y Configuración

### Ejecución en una estación de trabajo local

1. Instale un navegador moderno, como Chrome, Edge o Firefox.
2. Instale Python 3 si desea utilizar el servidor HTTP local. Compruebe la instalación con:

```bash
python --version
```

3. Descargue o clone el repositorio y abra una terminal dentro de la carpeta del proyecto:

```bash
cd "avance-proyecto-samuel vilchez"
```

4. Inicie el servidor local incluido:

```bash
python server.py
```

No use `python -m http.server` ni Live Server si necesita que se actualice `data.json`; esos servidores estáticos no aceptan la escritura del archivo.

5. Abra el navegador y visite:

```text
http://localhost:5500
```

No se recomienda abrir `index.html` directamente mediante `file://`, porque algunos navegadores restringen `fetch()` y pueden impedir la carga de `data.json`.

### Configuración inicial

- Al iniciar y cada 3 segundos, la aplicación lee el estado más reciente del servidor; así `localhost` y `127.0.0.1` usan los mismos datos aunque el navegador mantenga almacenamientos separados.
- Cada cambio se guarda primero en `localStorage` y se envía al servidor local para actualizar `data.json`.
- Si se abre con `file://` o con un servidor estático, los cambios permanecen solo en `localStorage`.
- Para restaurar los datos iniciales, elimine la clave `invgest-ia-data-v1` desde las herramientas de desarrollo del navegador.
- La sesión activa se conserva mediante la clave `invgest-ia-session-v1`; cerrar sesión elimina esa sesión.
- Las actualizaciones también se reflejan en otras sesiones que estén conectadas al mismo servidor local. No se sincronizan entre servidores distintos.

### Configurar Gemini

1. Obtenga una clave API desde Google AI Studio.
2. Inicie sesión y use el botón redondo **IA** junto al nombre de usuario.
3. Pegue la clave y seleccione **Cargar modelos disponibles**; elija un modelo que acepte la clave y seleccione **Guardar y analizar**.
4. Gemini recibe únicamente los datos necesarios del inventario y devuelve mínimos sugeridos, cantidades, prioridad y motivos. El código fuente no se envía.
5. La clave se mantiene solo en memoria de la página y se borra al cerrar sesión o recargarla. No se guarda en `localStorage` ni en `data.json`.
6. Sin clave, sin conexión o si Gemini falla, la reposición sigue usando el cálculo local.

El servidor incluido escucha solo en `127.0.0.1`; está pensado para uso local. No use esta configuración con claves de producción ni exponga el servidor directamente a internet.

### Usuarios disponibles

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin123` | Administrador |
| `dependiente` | `Venta123` | Dependiente |
| `delegado` | `Delegado123` | Delegado |

### Despliegue

Un hosting estático como GitHub Pages no puede sobrescribir `data.json`; allí la aplicación solo guardará cambios en el navegador. Para escritura compartida o despliegue multiusuario se necesita alojar `server.py` detrás de un servicio backend con autenticación y almacenamiento adecuados. El servidor incluido está pensado para uso local y solo escucha en `127.0.0.1`.

## Guía Rápida de Uso

1. Inicie la aplicación y espere a que aparezca la pantalla de inicio de sesión.
2. Introduzca el usuario y la contraseña de su cuenta.
3. Revise las métricas, productos críticos y movimientos recientes en **Panel general**.
4. Abra **Inventario** para buscar productos, filtrar por categoría o nivel de stock y consultar proveedores.
5. Si cuenta con permisos de administrador o delegado:
   - Use **Nuevo producto** para registrar una existencia.
   - Seleccione **Editar** en una fila para modificar sus datos.
   - Use el formulario de proveedores para agregar un nuevo proveedor.
6. Abra **Reposición IA** para revisar el cálculo local o configurar Gemini desde el botón **IA** de la barra superior.
7. Use **Solicitar relleno** para acumular solicitudes opcionales; los usuarios con permisos también pueden aprobar un pedido.
8. Entre a **Reportes** para filtrar movimientos por fechas y tipo.
9. Use **Exportar CSV** para descargar el resultado filtrado; los acentos se conservan mediante el encabezado Unicode incluido en el archivo.
10. Si su cuenta es administradora, abra **Usuarios** para crear cuentas, cambiar roles, activar, desactivar o eliminar usuarios. No se puede eliminar la sesión actual ni dejar el sistema sin un administrador activo.
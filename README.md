# UISBET — Casino Online

Aplicación web de casino donde los usuarios pueden registrarse, comprar fichas y acceder a distintos juegos de azar (Ruleta y Baccarat).

---

## Tecnologías utilizadas

- React 19 + Vite
- React Bootstrap / Bootstrap 5
- React Router DOM
- Node.js + Express
- MySQL (vía XAMPP)
- JWT + bcryptjs

---

## Requisitos previos

Solo se asume que tienes instalado **Visual Studio Code**. Sigue cada paso en el orden indicado.

---

## Paso 1 — Abrir PowerShell como Administrador y habilitar scripts

Antes de instalar cualquier cosa, es necesario habilitar la ejecución de scripts en Windows.

1. Presiona `Windows + S` y busca **PowerShell**.
2. Haz clic derecho sobre **Windows PowerShell** y selecciona **Ejecutar como administrador**.
3. En la ventana que se abre, escribe el siguiente comando y presiona Enter:

```
Set-ExecutionPolicy RemoteSigned
```

4. Cuando pregunte si deseas confirmar, escribe `S` y presiona Enter.

---

## Paso 2 — Instalar Node.js (incluye npm)

1. Ve a [https://nodejs.org](https://nodejs.org) y descarga
2. Ejecuta el instalador y sigue los pasos. No cambies ninguna opción por defecto.
3. Una vez instalado, abre una nueva terminal de PowerShell y verifica la instalación:

```
node -v
npm -v
```

Ambos comandos deben mostrar un número de versión. Si es así, Node.js y npm quedaron instalados correctamente.

---

## Paso 3 — Instalar Express de forma global

Con PowerShell abierto, ejecuta:

```
npm install express -g
```

Esto instala Express globalmente en el sistema para que esté disponible desde cualquier carpeta.

---

## Paso 4 — Instalar XAMPP

XAMPP es el programa que levanta el servidor de MySQL que el proyecto necesita para la base de datos.

1. Ve a [https://www.apachefriends.org](https://www.apachefriends.org) y descarga **XAMPP para Windows**.
2. Al terminar la instalación, abre el **XAMPP Control Panel**.

---

## Paso 5 — Activar Apache y MySQL en XAMPP

Dentro del Panel de Control de XAMPP:

1. Haz clic en el botón **Start** que está al lado de **Apache**. Debe ponerse en verde.
2. Haz clic en el botón **Start** que está al lado de **MySQL**. Debe ponerse en verde.

> Deja el Panel de XAMPP abierto mientras trabajas con el proyecto. Si cierras XAMPP, la base de datos se apaga y el backend dejará de funcionar.

---

## Paso 6 — Clonar o descargar el proyecto

Abre la terminal de VS Code (`Ctrl + ñ` o `Terminal > Nueva terminal`) y navega hasta la carpeta donde quieres guardar el proyecto. Luego clona el repositorio:

```
git clone https://github.com/santiagomelendez1/UISBET
```

Entra a la carpeta del proyecto:

```
cd UISBET
```

---

## Paso 7 — Instalar dependencias del backend y correrlo

En la terminal, entra a la carpeta del backend:

```
cd UISBET/backend
```

Instala todas las dependencias del backend:

```
npm install
```

Una vez que termine, corre el servidor backend:

```
npm run dev
```

Deberías ver en la terminal el mensaje:

```
Servidor backend ejecutándose en http://localhost:4000
```

> Deja esta terminal abierta. El backend debe seguir corriendo mientras usas la aplicación.

---

## Paso 8 — Instalar dependencias del frontend y correrlo

Abre una **segunda terminal** en VS Code (`+` en el panel de terminales). Asegúrate de estar en la carpeta raíz del proyecto (`UISBET/`).

```
cd UISBET/frontend
```

Instala todas las dependencias del frontend:

```
npm install
```

Una vez que termine, corre el servidor de desarrollo del frontend:

```
npm run dev
```

---

## Paso 9 — Abrir la aplicación

Abre tu navegador y ve a:

```
http://localhost:5173
```

La aplicación debería cargarse correctamente.

---

## Credenciales de acceso

El backend inserta automáticamente un usuario administrador la primera vez que arranca:

| Campo      | Valor              |
|------------|--------------------|
| Correo     | admin@uisbet.com   |
| Contraseña | 1234               |

Con este usuario puedes acceder al panel de administración (Usuarios, Paquetes y Compras).

---

## Resumen de puertos

| Servicio  | Puerto                    |
|-----------|---------------------------|
| Frontend  | http://localhost:5173      |
| Backend   | http://localhost:4000      |
| MySQL     | localhost:3306 (XAMPP)    |

---

## Funcionalidades

- Registro e inicio de sesión con JWT
- Compra de paquetes de fichas
- Juego de Ruleta europea con animación SVG
- Juego de Baccarat con reglas oficiales de la tercera carta
- Saldo en tiempo real sincronizado con la base de datos
- Historial de compras del usuario
- Panel de administración: CRUD de usuarios, paquetes y compras
- Rutas privadas según rol (usuario / administrador)
- Galería de imágenes servida desde el backend
- Sección de equipo con modales por integrante

---

## Autores

- David Santiago Meléndez — Coordinador y full-stack developer
- Iván Herrera — Frontend y diseño
- Santiago Fonseca — Frontend y diseño
- Diego Niño — Backend y base de datos

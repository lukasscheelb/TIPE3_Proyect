# Gestión de Propiedades

Aplicación de escritorio para gestionar propiedades inmobiliarias de forma local. La interfaz está hecha con React y Vite, y el ejecutable de escritorio se genera con Electron.

El sistema guarda la información en archivos JSON locales y almacena las imágenes dentro de carpetas del proyecto o de la instalación, según el modo de uso.

## Requisitos Previos

Para desarrollar, ejecutar o generar el instalador desde el código fuente necesitas instalar:

- Git
- Node.js LTS
- Visual Studio Code, recomendado
- Python 3, opcional, solo si quieres usar el servidor Python de desarrollo

## 1. Instalar Git

Descarga Git desde:

```text
https://git-scm.com/download/win
```

Durante la instalación puedes dejar las opciones por defecto. Es importante que Git quede disponible desde PowerShell o la terminal de VS Code.

Verifica la instalación:

```powershell
git --version
```

## 2. Instalar Node.js

Descarga la versión LTS desde:

```text
https://nodejs.org/
```

Instala Node.js con las opciones por defecto. Esto también instala `npm`.

Verifica la instalación:

```powershell
node -v
npm -v
```

## 3. Clonar el Repositorio

Abre PowerShell o la terminal de VS Code y ejecuta:

```powershell
cd "C:\Users\lukas\Desktop\VSC - Projects"
git clone https://github.com/lukasscheelb/TIPE3_Proyect.git
cd TIPE3_Proyect
```

Si usas otra carpeta, cambia la ruta del primer `cd`.

## 4. Instalar Dependencias

Dentro de la carpeta del proyecto ejecuta:

```powershell
npm install
```

Este comando descarga las dependencias necesarias, incluyendo React, Vite, Electron y Electron Builder.

## 5. Ejecutar Como Aplicación de Escritorio

Para abrir la aplicación como programa de PC:

```powershell
npm run desktop
```

Este comando:

- Compila el frontend.
- Abre una ventana de escritorio con Electron.
- Levanta internamente el servidor local para leer y guardar propiedades.

## 6. Generar el Instalador

Para crear un instalador de Windows:

```powershell
npm run dist:desktop
```

El instalador se genera en:

```text
release/
```

El archivo esperado tendrá un nombre similar a:

```text
Gestión de Propiedades Setup 0.0.0.exe
```

También se genera una versión sin instalar en:

```text
release/win-unpacked/
```

Puedes abrir directamente:

```text
release/win-unpacked/Gestión de Propiedades.exe
```

## 7. Modo Desarrollo Web

Si quieres trabajar en la interfaz con recarga automática:

```powershell
npm run dev
```

En otra terminal, si quieres usar el servidor Python:

```powershell
npm run server
```

Luego abre la URL que muestra Vite, normalmente:

```text
http://127.0.0.1:5173
```

## 8. Modo Desarrollo Con Electron

Para usar Electron mientras Vite está abierto:

Terminal 1:

```powershell
npm run dev
```

Terminal 2:

```powershell
npm run desktop:dev
```

## Almacenamiento de Datos

Las propiedades se guardan como archivos JSON.

En modo desarrollo:

```text
Propiedades/
```

Ejemplo:

```text
Propiedades/1.json
Propiedades/2.json
Propiedades/3.json
```

Las imágenes se guardan en:

```text
Propiedades/imagenes/
```

La fotografía de la ficha física también se guarda como imagen local y queda referenciada en el JSON de la propiedad mediante el campo:

```text
fichaImagen
```

## Datos en la Aplicación Instalada

Cuando la aplicación se instala como programa de Windows, Electron copia las propiedades iniciales y luego guarda los datos en la carpeta de usuario de Windows.

Esto es normal y recomendado, porque una aplicación instalada no debe modificar archivos dentro de `Program Files`.

La ubicación exacta suele estar dentro de:

```text
C:\Users\TU_USUARIO\AppData\Roaming\Gestión de Propiedades\
```

## Estructura Principal

```text
TIPE3_Proyect/
  electron/
    main.cjs
  Propiedades/
    1.json
    2.json
    3.json
    imagenes/
    escaneos/
  src/
    components/
    data/
    pages/
    services/
    styles/
    utils/
  backend_server.py
  package.json
  vite.config.js
```

## Comandos Disponibles

```powershell
npm run dev
```

Ejecuta Vite en modo desarrollo web.

```powershell
npm run server
```

Ejecuta el servidor Python local.

```powershell
npm run build
```

Compila el frontend en la carpeta `dist`.

```powershell
npm run desktop
```

Compila y abre la aplicación como programa de escritorio.

```powershell
npm run desktop:dev
```

Abre Electron usando el servidor de desarrollo de Vite.

```powershell
npm run dist:desktop
```

Genera el instalador de Windows con Electron Builder.

## Notas Importantes

- No se debe subir `node_modules` a GitHub.
- No se debe subir `release` ni `dist`; se generan localmente.
- No se deben subir instaladores `.exe` generados.
- Las fotos agregadas por el usuario se guardan localmente y no se suben al repositorio.
- Si el puerto `8000` está ocupado, la aplicación puede conectarse a otro servidor local abierto en ese puerto.

## Subir Cambios a GitHub

Después de modificar el proyecto:

```powershell
git status
git add .
git commit -m "Descripción del cambio"
git push
```

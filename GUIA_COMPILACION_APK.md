# Guía de Compilación de APK Nativo — UniApuntes UNP
**Cátedra:** Aplicaciones Móviles  
**Institución:** Universidad Nacional del Pilar (UNP)  
**Docente:** Prof. Ariel Bulacio  
**Año:** 2026  

---

## 📱 ¿Qué es un APK independiente (Standalone)?
Un archivo **APK** (`.apk`) permite instalar **UniApuntes** directamente en cualquier celular Android de forma nativa y permanente, **sin necesidad de tener instalado Expo Go** ni estar conectado a la misma red WiFi de la computadora.

---

## ⚙️ Archivos de Configuración Ya Creados en el Proyecto
El proyecto ya cuenta con toda la infraestructura oficial lista para compilar:
1. **`eas.json`**: Configurado con el perfil `preview` que genera un archivo APK directo (`"buildType": "apk"`).
2. **`app.json`**: Configurado con el paquete oficial `"package": "com.uniapuntes.unp"`, versión `1.0.0` y permisos de almacenamiento y notificaciones.
3. **`package.json`**: Scripts agregados:
   - `npm run build:apk`
   - `npm run build:aab`
   - `npm run eas:login`

---

## 🚀 Pasos para Generar el APK en 1 Clic (EAS Cloud Build)

EAS Build compila el código en los servidores en la nube de Expo de forma gratuita, sin necesidad de tener instalado Android Studio, Java SDK ni Gradle en tu computadora.

### Paso 1: Crear una cuenta gratuita en Expo (si aún no tenés una)
Ingresá a [https://expo.dev/signup](https://expo.dev/signup) y registrate con tu correo o cuenta de GitHub.

### Paso 2: Iniciar sesión en EAS desde tu terminal
En la terminal de PowerShell dentro de la carpeta `Api`:
```bash
npx eas-cli login
```
Ingresá tu usuario y contraseña de Expo.

### Paso 3: Lanzar la compilación del APK
Ejecutá el siguiente comando:
```bash
npx eas-cli build -p android --profile preview
```
*Si te pregunta:*
- `Generate a new Android Keystore?` 👉 Presioná **Enter** (`[Y]` / Sí). EAS creará la clave criptográfica de firma de forma automática y segura.
- `Would you like to automatically create an EAS project?` 👉 Presioná **Enter** (`[Y]`).

### Paso 4: Descargar e Instalar en tu Celular
1. La terminal te mostrará el avance del build en la nube (toma entre 5 y 10 minutos).
2. Al finalizar, la terminal imprimirá un enlace de descarga directo y un código QR:
   ```text
   ✔ Build finished
   Android APK: https://expo.dev/artifacts/eas/.../uniapuntes.apk
   ```
3. Abrí el enlace en el navegador de tu celular (Chrome) o escaneá el QR.
4. Tocá **Descargar** e **Instalar**.
5. Si Android te muestra una advertencia de seguridad por ser una app de desarrollo universitario fuera de Play Store:
   - Tocá **"Más detalles"** ➔ **"Instalar de todas formas"**.
6. ¡Listo! La app **UniApuntes** aparecerá con su icono azul y nombre en el menú de aplicaciones de tu teléfono.

---

## 📦 Compilación para Google Play Store (.AAB)
Si en el futuro deseás publicar la aplicación en Google Play Console:
```bash
npx eas-cli build -p android --profile production
```
Esto generará un archivo **Android App Bundle (`.aab`)** optimizado con compresión dinámica por arquitectura de procesador.

---

## 🛠️ Comandos Rápidos de Referencia

| Comando | Acción |
| :--- | :--- |
| `npm run start` | Inicia el servidor de desarrollo local para Expo Go |
| `npx expo start -c` | Inicia limpiando la caché de Metro (recomendado tras actualizar) |
| `npm run build:apk` | Compila el instalador `.apk` independiente |
| `npm run build:aab` | Compila el paquete `.aab` para Google Play Store |
| `npm run eas:login` | Conecta tu terminal a tu cuenta de Expo |

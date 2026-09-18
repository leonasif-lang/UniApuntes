# UniApuntes

> "Compartí conocimiento. Encontrá lo que necesitás."

Aplicación móvil desarrollada como parte de la materia **Aplicaciones Móviles** de la **Tecnicatura Universitaria en Desarrollo de Software** en la **Universidad Nacional del Pilar (2026)**.  
**Docente:** Ariel Bulacio.

---

## Problema

En el ámbito universitario, los recursos académicos y materiales de estudio suelen encontrarse dispersos en múltiples canales desarticulados:
- Grupos de WhatsApp
- Canales de Telegram
- Redes sociales
- Contactos personales
- Foros informales

Esto dificulta que los estudiantes encuentren rápidamente apuntes confiables, resúmenes actualizados, cursos complementarios o asesorías académicas cuando más lo necesitan.

---

## Solución

**UniApuntes** es una aplicación móvil diseñada específicamente para la comunidad estudiantil universitaria. Su propósito es centralizar en un único lugar organizado y accesible todo el material académico:
- 📚 Apuntes de cátedras
- 📝 Resúmenes estructurados
- 📖 Cursos de refuerzo
- 🎓 Asesorías entre pares y tutores

---

## Tecnologías

- **React Native** (v0.86)
- **Expo** (SDK 57)
- **JavaScript** (ES6+)
- **React Native Safe Area Context**
- **Expo Vector Icons** (Ionicons)

---

## Estado del Proyecto

**Etapa 1 — MVP Funcional (Minimum Viable Product)**

Esta primera versión establece las bases de la interfaz, experiencia de usuario y arquitectura limpia con datos locales en memoria (sin dependencias de backend ni bases de datos externas en esta fase).

---

## Funcionalidades del MVP

1. **Pantalla de Inicio (`HomeScreen`)**:
   - Saludo personalizado institucional: *"Hola, Leonardo 👋"*.
   - Buscador integrado con acción directa.
   - Navegación por categorías (Apuntes, Asesorías, Cursos, Resúmenes).
   - Chips interactivos de materias populares (Programación, Matemática Discreta, Base de Datos, Desarrollo Web).
   - Listado de publicaciones recientes con acceso a detalle.

2. **Buscador interactivo**:
   - Búsqueda por materia, título, autor o tipo (por ejemplo, *"Programación"*).

3. **Pantalla de Resultados (`ResultsScreen`)**:
   - Encabezado con navegación de retorno (`←`).
   - Indicador dinámico de búsqueda (`Resultados para: "Programación"`).
   - Filtros visuales interactivos: *Materia*, *Tipo* y *Precio*.
   - Tarjetas de resultados con valoración (⭐), autor, materia y precio destacado.

4. **Pantalla de Detalle (`DetailScreen`)**:
   - Información completa del recurso universitario.
   - Reseña, materia, autor y descripción del material.
   - Botón **`CONTACTAR`** con feedback visual e informativo (*"Solicitud de contacto enviada."*).
   - Botón interactivo **`♡ GUARDAR` / `♥ GUARDADO`** con persistencia en estado local.
   - Botón de retorno `← Volver`.

5. **Barra de Navegación Inferior (`BottomNavigation`)**:
   - Pestañas activas: **Inicio** y **Buscar**.
   - Pestañas preparadas para siguientes fases: **Publicar**, **Mensajes** y **Perfil** (con aviso modal: *"Esta funcionalidad estará disponible próximamente."*).

---

## Estructura del Proyecto

```text
src/
├── components/
│   ├── SearchBar.js          # Barra de búsqueda con botón y limpieza
│   ├── CategoryCard.js       # Tarjetas de categorías temáticas
│   ├── PublicationCard.js    # Tarjeta de publicación/recurso
│   ├── FilterButton.js       # Chips de filtro en resultados
│   ├── PrimaryButton.js      # Botón de acción (Contactar, Guardar/Guardado)
│   └── BottomNavigation.js   # Barra de navegación inferior
│
├── screens/
│   ├── HomeScreen.js         # Inicio
│   ├── ResultsScreen.js      # Resultados de búsqueda
│   └── DetailScreen.js       # Detalle de publicación
│
├── data/
│   └── publications.js       # Dataset de prueba local
│
├── navigation/
│   └── AppNavigator.js       # Navegación móvil (Stack + Tabs)
│
└── styles/
    └── theme.js              # Paleta de colores, tipografías y sombras
```

---

## Cómo Ejecutar la Aplicación

### Requisitos previos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- Celular físico con la app **Expo Go** instalada (disponible en Google Play Store y Apple App Store) o un emulador Android / simulador iOS / navegador web.

### 1. Clonar el repositorio o abrir la carpeta del proyecto
```bash
git clone https://github.com/TU_USUARIO/uniapuntes.git
cd uniapuntes
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo Expo
```bash
npx expo start
```
O en Windows PowerShell:
```powershell
npm.cmd start
```

### 4. Probar en un teléfono celular
1. Abre la aplicación **Expo Go** en tu celular.
2. En **Android**: escanea el código QR que aparece en la terminal o en la ventana del navegador.
3. En **iOS**: abre la app de Cámara nativa, escanea el código QR y pulsa en la notificación para abrir en Expo Go.
*(Asegúrate de que la computadora y el teléfono estén conectados a la misma red Wi-Fi).*

### 5. Probar en el navegador Web (opcional)
```bash
npm.cmd run web
```
Presiona `w` en la consola para abrir inmediatamente en el navegador web local.

---

## Guía para Subir el Proyecto a GitHub

Si deseas subir este proyecto a un nuevo repositorio de GitHub:

```bash
# 1. Inicializar git si aún no está inicializado
git init

# 2. Agregar todos los archivos
git add .

# 3. Realizar el primer commit
git commit -m "feat: MVP funcional de UniApuntes (Etapa 1)"

# 4. Vincular con tu repositorio remoto en GitHub
git branch -M main
git remote add origin https://github.com/TU_USUARIO/uniapuntes.git

# 5. Subir los cambios
git push -u origin main
```

---

## Próximas Etapas (Roadmap)

- [ ] Registro de estudiantes con correo institucional (.edu / unp).
- [ ] Autenticación y Login seguro.
- [ ] Perfiles de usuario personalizables con reputación académica.
- [ ] Publicación interactiva de apuntes con carga de archivos PDF e imágenes.
- [ ] Base de datos persistente (Supabase / Firebase / PostgreSQL).
- [ ] Lista de Favoritos persistente entre sesiones.
- [ ] Sistema de mensajería y chat directo entre estudiantes.
- [ ] Notificaciones push de solicitudes y consultas.
- [ ] Sistema de valoraciones y reseñas con comentarios de cursada.

---

## Licencia

Este proyecto está desarrollado con fines educativos y de extensión académica para la Universidad Nacional del Pilar.

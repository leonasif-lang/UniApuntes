# PLAN Y MATRIZ DE CASOS DE PRUEBA (TESTING)
## APLICACIÓN MÓVIL: UNIAPUNTES
### "Compartí conocimiento. Encontrá lo que necesitás."

---

### INFORMACIÓN ACADÉMICA
- **Institución:** Universidad Nacional del Pilar (UNP)
- **Carrera:** Tecnicatura Universitaria en Desarrollo de Software
- **Cátedra:** Aplicaciones Móviles
- **Año:** 2026
- **Docente:** Prof. Ariel Bulacio
- **Estándar Aplicado:** Basado en IEEE 829 (Test Case Specification)
- **Tipo de Pruebas:** Funcionales, de Integración, de Interfaz (UI/UX) y de Persistencia Local

---

## 1. RESUMEN EJECUTIVO DE CASOS DE PRUEBA

| ID Caso | Módulo | Descripción / Objetivo | Prioridad | Estado |
| :--- | :--- | :--- | :---: | :---: |
| **TC-AUTH-01** | Autenticación | Inicio de la aplicación con sesión cerrada (Login obligatorio). | Alta | ✅ APROBADO |
| **TC-AUTH-02** | Autenticación | Inicio de sesión exitoso con credenciales válidas. | Alta | ✅ APROBADO |
| **TC-AUTH-03** | Autenticación | Validación de campos obligatorios vacíos en Login. | Media | ✅ APROBADO |
| **TC-AUTH-04** | Autenticación | Validación de formato de correo electrónico institucional. | Media | ✅ APROBADO |
| **TC-AUTH-05** | Autenticación | Acceso rápido mediante "Cuenta Demo (Leonardo)". | Alta | ✅ APROBADO |
| **TC-AUTH-06** | Autenticación | Acceso exploratorio en "Modo Invitado". | Alta | ✅ APROBADO |
| **TC-AUTH-07** | Autenticación | Registro de nuevo estudiante universitario. | Alta | ✅ APROBADO |
| **TC-AUTH-08** | Autenticación | Validación de longitud mínima de contraseña (>= 4 caracteres). | Media | ✅ APROBADO |
| **TC-AUTH-09** | Autenticación | Funcionalidad de ver / ocultar contraseña (ícono de ojo). | Baja | ✅ APROBADO |
| **TC-AUTH-10** | Autenticación | Cierre de sesión seguro con Modal de confirmación. | Alta | ✅ APROBADO |
| **TC-HOME-01** | Inicio / UI | Saludo dinámico personalizado según el usuario conectado. | Alta | ✅ APROBADO |
| **TC-HOME-02** | Inicio / UI | Visualización del imagotipo oficial `UniApuntes` en cabecera. | Media | ✅ APROBADO |
| **TC-HOME-03** | Inicio / UI | Navegación al Perfil al presionar el avatar superior. | Media | ✅ APROBADO |
| **TC-HOME-04** | Inicio / UI | Filtro rápido por categorías (Apuntes, Asesorías, Cursos, Resúmenes). | Alta | ✅ APROBADO |
| **TC-HOME-05** | Inicio / UI | Filtro rápido por chips de materias populares. | Media | ✅ APROBADO |
| **TC-HOME-06** | Navegación | Navegación completa entre las 5 pestañas fijas de la barra inferior. | Alta | ✅ APROBADO |
| **TC-BUSQ-01** | Búsqueda | Búsqueda reactiva de recursos por materia ("Programación"). | Alta | ✅ APROBADO |
| **TC-BUSQ-02** | Búsqueda | Búsqueda de recursos por autor o título ("Daniela"). | Media | ✅ APROBADO |
| **TC-BUSQ-03** | Búsqueda | Limpieza de texto en la barra de búsqueda (botón 'x'). | Baja | ✅ APROBADO |
| **TC-BUSQ-04** | Búsqueda | Activación y visualización de chips de filtro en Resultados. | Media | ✅ APROBADO |
| **TC-BUSQ-05** | Búsqueda | Retorno a pantalla anterior mediante botón `←`. | Alta | ✅ APROBADO |
| **TC-DET-01** | Detalle | Visualización de ficha técnica, autor, materia y badge GRATIS. | Alta | ✅ APROBADO |
| **TC-DET-02** | Detalle / Fav | Guardar recurso: alternar de `♡ GUARDAR` a `♥ GUARDADO`. | Alta | ✅ APROBADO |
| **TC-DET-03** | Detalle / Fav | Desmarcar recurso: alternar de `♥ GUARDADO` a `♡ GUARDAR`. | Alta | ✅ APROBADO |
| **TC-DET-04** | Detalle / Msg | Presionar "CONTACTAR" e inicio automático de conversación. | Alta | ✅ APROBADO |
| **TC-DET-05** | Detalle / Msg | Modal de contacto: redirección directa a la pantalla de Chat. | Alta | ✅ APROBADO |
| **TC-PUB-01** | Publicación | Apertura del formulario de publicación desde la pestaña ➕. | Alta | ✅ APROBADO |
| **TC-PUB-02** | Publicación | Validación de campos obligatorios (Título y Descripción). | Media | ✅ APROBADO |
| **TC-PUB-03** | Publicación | Simulación de archivo adjunto PDF con peso en MB. | Media | ✅ APROBADO |
| **TC-PUB-04** | Publicación | Creación de apunte e incorporación inmediata al Home en tiempo real. | Alta | ✅ APROBADO |
| **TC-MSG-01** | Mensajería | Visualización de bandeja de consultas y mensajes no leídos. | Alta | ✅ APROBADO |
| **TC-MSG-02** | Mensajería | Filtro de conversaciones por nombre de compañero o apunte. | Media | ✅ APROBADO |
| **TC-MSG-03** | Chat | Apertura de conversación con historial de burbujas enviadas y recibidas. | Alta | ✅ APROBADO |
| **TC-MSG-04** | Chat | Envío de mensaje personalizado y actualización de pantalla. | Alta | ✅ APROBADO |
| **TC-MSG-05** | Chat | Envío de respuestas rápidas universitarias de 1 toque. | Media | ✅ APROBADO |
| **TC-MSG-06** | Chat | Simulación de respuesta automática de cortesía del compañero. | Media | ✅ APROBADO |
| **TC-PROF-01** | Perfil | Visualización de datos académicos (Carrera, UNP, Cátedra, Docente). | Alta | ✅ APROBADO |
| **TC-PROF-02** | Perfil / Fav | Contador y lista de "Mis Apuntes Guardados" en el perfil. | Alta | ✅ APROBADO |
| **TC-PROF-03** | Perfil / Fav | Acceso directo a la publicación desde la lista de guardados. | Media | ✅ APROBADO |
| **TC-PERS-01** | Persistencia | Persistencia de publicaciones nuevas mediante AsyncStorage y Cloud Firestore. | Alta | ✅ APROBADO |
| **TC-PERS-02** | Persistencia | Persistencia de favoritos guardados tras recargar la aplicación. | Alta | ✅ APROBADO |
| **TC-THEME-01** | UI / Tema | Alternancia fluida entre Modo Claro y Modo Oscuro con persistencia en storage. | Alta | ✅ APROBADO |
| **TC-SUBJ-01** | Catálogo / Filtro | Búsqueda y filtrado de nuevas materias: Psicología, Enfermería y Diseño de Paisaje. | Alta | ✅ APROBADO |
| **TC-LEGAL-01** | Legal / Normativa | Despliegue interactivo de Términos y Condiciones de uso universitario. | Media | ✅ APROBADO |
| **TC-LEGAL-02** | Legal / Disclaimer | Lectura del Disclaimer y deslinde de responsabilidad pedagógica UNP. | Media | ✅ APROBADO |
| **TC-ONBOARD-01** | Onboarding | Carrusel interactivo de bienvenida con reseña y pilares de la plataforma. | Alta | ✅ APROBADO |
| **TC-RECOV-01** | Autenticación | Recuperación de cuenta institucional y restablecimiento de contraseña vía Firebase. | Alta | ✅ APROBADO |
| **TC-BACKEND-01** | Backend / Cloud | Conexión en tiempo real a Cloud Firestore y Firebase Authentication. | Alta | ✅ APROBADO |

---

## 2. ESPECIFICACIÓN DETALLADA DE CASOS DE PRUEBA CRÍTICOS

---

### CASO DE PRUEBA: TC-AUTH-01
- **Nombre:** Inicio de aplicación con sesión cerrada
- **Módulo:** Autenticación
- **Objetivo:** Garantizar que la aplicación inicie siempre en la pantalla de Login con las opciones de acceso cuando se abre por primera vez o se recarga.
- **Precondiciones:** La app se encuentra recién abierta en el navegador o dispositivo móvil.
- **Pasos:**
  1. Abrir la URL `http://localhost:8081` o iniciar en Expo Go.
  2. Observar la pantalla inicial mostrada.
- **Datos de prueba:** N/A.
- **Resultado Esperado:** Se visualiza la pantalla `LoginScreen` con el imagotipo oficial de UniApuntes, el slogan universitario, los campos de inicio de sesión y los botones de Demo e Invitado. No se permite acceso al Home sin identificarse.
- **Resultado Obtenido:** La aplicación arranca directamente en el Login.
- **Estado:** ✅ APROBADO

---

### CASO DE PRUEBA: TC-AUTH-05
- **Nombre:** Acceso rápido mediante Cuenta Demo
- **Módulo:** Autenticación
- **Objetivo:** Permitir el ingreso con 1 toque para facilitar demostraciones y defensas académicas.
- **Precondiciones:** Usuario ubicado en `LoginScreen`.
- **Pasos:**
  1. Presionar el botón *"Ingresar como Leonardo (Demo)"*.
- **Datos de prueba:** Cuenta preconfigurada (`leonardo@unp.edu.ar`).
- **Resultado Esperado:** 
  1. Se actualiza el estado `isAuthenticated = true`.
  2. Se transiciona inmediatamente a `HomeScreen`.
  3. El saludo superior indica *"Hola, Leonardo 👋"*.
  4. El avatar superior muestra la inicial **"L"**.
- **Resultado Obtenido:** Transición instantánea y datos del usuario Leonardo reflejados en toda la app.
- **Estado:** ✅ APROBADO

---

### CASO DE PRUEBA: TC-AUTH-10
- **Nombre:** Cierre de sesión seguro con Modal de confirmación
- **Módulo:** Autenticación / Perfil
- **Objetivo:** Verificar que el usuario pueda cerrar sesión de forma segura sin fallos de plataforma (compatible Web, Android, iOS).
- **Precondiciones:** Usuario con sesión iniciada en la pantalla `ProfileScreen`.
- **Pasos:**
  1. Presionar el botón *"Cerrar Sesión"*.
  2. Verificar que se despliega el Modal interactivo de confirmación con las opciones *"Cancelar"* y *"Sí, Cerrar"*.
  3. Presionar *"Sí, Cerrar"*.
- **Datos de prueba:** N/A.
- **Resultado Esperado:** 
  1. Se ejecuta `logout()`.
  2. Se limpia el usuario en memoria.
  3. Se redirige inmediatamente a `LoginScreen`.
- **Resultado Obtenido:** El modal interactivo funciona de manera fluida y devuelve al Login.
- **Estado:** ✅ APROBADO

---

### CASO DE PRUEBA: TC-BUSQ-01
- **Nombre:** Búsqueda reactiva de recursos por materia
- **Módulo:** Búsqueda y Resultados
- **Objetivo:** Comprobar que el buscador devuelva los recursos correspondientes al término ingresado.
- **Precondiciones:** Usuario autenticado en `HomeScreen`.
- **Pasos:**
  1. Escribir *"Programación"* en el campo *"¿Qué estás buscando?"*.
  2. Presionar el botón *"Buscar"* o presionar la tecla Enter.
- **Datos de prueba:** Término `"Programación"`.
- **Resultado Esperado:**
  1. Navega a `ResultsScreen`.
  2. El encabezado muestra `Resultados para: "Programación"`.
  3. Se listan al menos 2 publicaciones coincidentes: *"Apuntes de Programación I"* (Daniela) y *"Asesoría de Python"* (Leonardo).
- **Resultado Obtenido:** Coincidencia exacta de publicaciones en pantalla de resultados.
- **Estado:** ✅ APROBADO

---

### CASO DE PRUEBA: TC-DET-02
- **Nombre:** Alternar estado de guardado (Favoritos)
- **Módulo:** Pantalla de Detalle / Favoritos
- **Objetivo:** Verificar que el botón de guardar alterne de forma reactiva y guarde el recurso en la lista de favoritos.
- **Precondiciones:** Usuario en la pantalla `DetailScreen` de *"Apuntes de Programación I"*.
- **Pasos:**
  1. Verificar estado inicial: botón blanco con texto `♡ GUARDAR`.
  2. Presionar el botón `♡ GUARDAR`.
  3. Navegar a la pestaña `Perfil`.
- **Datos de prueba:** ID del recurso: `1`.
- **Resultado Esperado:**
  1. El botón cambia a color rojo sólido con texto `♥ GUARDADO` e ícono de corazón lleno.
  2. En `ProfileScreen`, el contador de guardados incrementa a `1`.
  3. En la sección *"Mis Apuntes Guardados"*, aparece la tarjeta de *"Apuntes de Programación I"*.
- **Resultado Obtenido:** Estado reactivo inmediato y persistencia comprobada en la sección de favoritos.
- **Estado:** ✅ APROBADO

---

### CASO DE PRUEBA: TC-DET-04
- **Nombre:** Acción Contactar y apertura de Chat
- **Módulo:** Detalle / Mensajería
- **Objetivo:** Verificar la integración entre la consulta de un apunte y el módulo de mensajería académica.
- **Precondiciones:** Usuario en `DetailScreen` de *"Apuntes de Programación I"* (Autora: Daniela).
- **Pasos:**
  1. Presionar el botón azul *"CONTACTAR"*.
  2. Observar el modal emergente *"¡Solicitud Enviada!"*.
  3. Presionar la opción *"Abrir Chat"*.
- **Datos de prueba:** Recurso: *"Apuntes de Programación I"*.
- **Resultado Esperado:**
  1. Se genera una conversación en `MessagesContext` con Daniela.
  2. Se abre `ChatScreen` con el nombre de Daniela y el banner *"Consulta sobre: Apuntes de Programación I"*.
  3. Se visualiza el mensaje inicial enviado automáticamente.
- **Resultado Obtenido:** Redirección fluida y chat activo con la autora.
- **Estado:** ✅ APROBADO

---

### CASO DE PRUEBA: TC-PUB-04
- **Nombre:** Creación y publicación de nuevo material en tiempo real
- **Módulo:** Publicación (➕)
- **Objetivo:** Validar que un estudiante pueda publicar un apunte y que aparezca de inmediato en la app.
- **Precondiciones:** Usuario autenticado ubicado en `PublishScreen`.
- **Pasos:**
  1. Ingresar Título: *"Resumen Final de Algoritmos y Estructuras"*.
  2. Seleccionar Categoría: *"Resumen"* (📝).
  3. Seleccionar Materia: *"Programación"*.
  4. Ingresar Descripción: *"Incluye árboles binarios, pilas, colas y complejidad algorítmica."*.
  5. Presionar *"Subir archivo del apunte"* (simula PDF de 2.4 MB).
  6. Presionar *"PUBLICAR AHORA"*.
- **Datos de prueba:** Objeto de publicación completo.
- **Resultado Esperado:**
  1. Muestra alerta de éxito *"¡Publicación Exitosa!"*.
  2. Redirige a `HomeScreen`.
  3. La nueva publicación aparece al principio de *"Publicaciones recientes"*.
  4. Al seleccionarla, abre `DetailScreen` con todos los datos cargados y autor correspondiente.
- **Resultado Obtenido:** El apunte se crea y es visible inmediatamente para toda la aplicación.
- **Estado:** ✅ APROBADO

---

### CASO DE PRUEBA: TC-MSG-05
- **Nombre:** Envío de respuestas rápidas en el Chat
- **Módulo:** Chat
- **Objetivo:** Comprobar el envío con 1 toque de preguntas frecuentes universitarias.
- **Precondiciones:** Usuario dentro de `ChatScreen`.
- **Pasos:**
  1. En la barra de respuestas rápidas, presionar *"¿Tenés el apunte en PDF?"*.
- **Datos de prueba:** Cadena de respuesta rápida.
- **Resultado Esperado:**
  1. El mensaje se añade inmediatamente a la lista como burbuja azul en el extremo derecho.
  2. Tras 1.8 segundos, se recibe una respuesta automática simulada del compañero.
- **Resultado Obtenido:** Interacción dinámica y respuesta simulada recibida con éxito.
- **Estado:** ✅ APROBADO

---

## 3. MATRIZ DE TRAZABILIDAD DE REQUERIMIENTOS

| Requerimiento del Proyecto | Casos de Prueba Asociados | Porcentaje de Cobertura |
| :--- | :--- | :---: |
| **R01: Autenticación y Perfil** | TC-AUTH-01 al TC-AUTH-10, TC-PROF-01 | 100% |
| **R02: Búsqueda y Filtros** | TC-BUSQ-01 al TC-BUSQ-05, TC-HOME-04, TC-HOME-05 | 100% |
| **R03: Detalle y Acceso Gratuito** | TC-DET-01, TC-DET-06 | 100% |
| **R04: Favoritos / Guardado Local** | TC-DET-02, TC-DET-03, TC-PROF-02, TC-PROF-03, TC-PERS-02 | 100% |
| **R05: Publicación de Recursos** | TC-PUB-01 al TC-PUB-04, TC-PERS-01 | 100% |
| **R06: Mensajería entre Estudiantes** | TC-DET-04, TC-DET-05, TC-MSG-01 al TC-MSG-06 | 100% |
| **R07: Navegación de 5 Pestañas** | TC-HOME-06 | 100% |

---

## 4. CONCLUSIÓN Y DICTAMEN DE TESTING
- **Total de Casos Diseñados y Ejecutados:** 40 casos de prueba.
- **Casos Aprobados:** 40 (100%).
- **Casos Rechazados / Bloqueantes:** 0 (0%).
- **Dictamen Final:** El sistema móvil **UniApuntes** cumple satisfactoriamente con la totalidad de los criterios funcionales, de navegación, de interfaz visual universitaria y de persistencia local exigidos para la evaluación final de la cátedra **Aplicaciones Móviles** de la **Universidad Nacional del Pilar**.

# Aplicación de Gestión de Tareas e Incidencias

Este proyecto es una **aplicación de gestión de tareas** diseñada para la empresa Atarfil. Permite la **gestión de tareas periódicas y extraordinarias**, el **registro de incidencias** y el **seguimiento del trabajo de los operadores**.

## Funcionalidades Principales

- **Roles de Usuario:**  
  - **Operador**: Visualiza y ejecuta tareas asignadas, reporta incidencias.
  - **Administrador**: Gestiona usuarios, asigna tareas y revisa incidencias.

- **Gestión de Tareas:**  
  - **Tareas Periódicas**: Se generan automáticamente según su frecuencia (diaria, semanal, mensual, semestral, anual).  
  - **Tareas Extraordinarias**: Se asignan manualmente a operadores específicos.  
  - **Estado de las tareas**: Las tareas pueden estar **pendientes, en pausa o completadas**.  

- **Incidencias:**  
  - Los operadores pueden **reportar incidencias** en las tareas con detalles como **tipo de actuación, material necesario y observaciones**.  

- **Generación de Reportes:**  
  - Se pueden exportar informes en **PDF** con las tareas completadas e incidencias registradas.  

---

## **Requisitos Previos**
Antes de instalar la aplicación, asegúrese de tener instalado:

- **Servidor Backend:**
  - [Node.js](https://nodejs.org/) (v16 o superior)
  - [PostgreSQL](https://www.postgresql.org/) con `pgAdmin4`
  - **Dependencias:** Express, pg, cron, multer

- **Frontend:**
  - [Ionic](https://ionicframework.com/docs/cli) + Angular
  - Android Studio para compilar en dispositivos móviles (Android)

- **Herramientas Adicionales:**
  - [Git](https://git-scm.com/)

---

## **Instalación y Configuración**

### 1️⃣ **Clonar el Repositorio**
git clone https://github.com/atganalytical/gestion_tareas_produccion.git

cd repositorio

---

### 2️⃣ **Restaurar la Base de Datos**
**Opciones para importar la base de datos:**
  1. Desde un archivo .sql (formato plano)

  - En pgAdmin4, crear una nueva base de datos gestor_tareas.
   
  - Ir a Query Tool y ejecutar el archivo .sql.

  
  2. Desde un archivo .tar (respaldo completo de pgAdmin)
  
  - En pgAdmin4, hacer clic derecho en gestor_tareas → Restore.
   
  - Seleccionar el archivo .tar y seguir las instrucciones.

---

### 3️⃣ **Configurar el Backend**
**Instalar dependencias**
  
  npm install

**Configurar PostgreSQL**

1. Editar server.js con las credenciales de la base de datos:
   ```
   const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'atarfil',
      password: 'password',
      port: 5432,
    });

2. Editar db.config.js con las credenciales de la base de datos:
   ```
   module.exports = {
     HOST: 'localhost',
     USER: 'postgres',
     PASSWORD: 'password',
     DB: 'atarfil',
     dialect: 'postgres',
     pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
     }
   };

3. Editar environments/environment.ts para el manejo del acceso de usuario a la aplicación:
   ```
   export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/'
   };

4. Editar environments/environment.prod.ts para el manejo del acceso de usuario a la aplicación:
   ```
   export const environment = {
    production: true,
    apiUrl: 'http://localhost:3000'
   };
---

### 4️⃣ **Configurar el Frontend**
**Instalar dependencias**

  npm install

---

## **Despliegue en Producción**
**Ejecutar la Aplicación**

  npm start

🌍 La aplicación web se abrirá automáticamente en el puerto 4200 y el backend estará disponible en el puerto 3000.

---

## **Importación de datos desde Excel a PostgreSQL**
El sistema permite cargar registros masivos (materiales, actuaciones y usuarios) desde archivos Excel mediante scripts automatizados. Esto facilita la inicialización o actualización de la base de datos.

**Archivos de ejemplo**

En la carpeta del proyecto 'EXCEL' están las plantillas con algunos ejemplos con las columnas necesarias, listo para ser rellenado.

---

**▶️ Cómo usar los scripts**

1. Instala las dependencias necesarias:
   ```
   npm install pg xlsx bcrypt
2. Ejecuta el script correspondiente:
   ```
   node importar_materiales.js
   node importar_actuaciones.js
   node importar_usuarios.js

---

## **Compilación de la APK**
Para poder extraer la APK hay que hacer algunos ajustes en varios archivos dentro de la carpeta `/android` de nuestro proyecto.

**Archivos a cambiar**

1. Editar `/android/app/src/main/AndroidManifest.xml` de manera que la cabecera de la etiquieta 'application' quede de la siguiente manera:
   ```
    <application android:networkSecurityConfig="@xml/network_security_config" android:allowBackup="true" android:icon="@mipmap/ic_launcher" android:label="@string/app_name" android:roundIcon="@mipmap/ic_launcher_round" android:supportsRtl="true" android:theme="@style/AppTheme" android:usesCleartextTraffic="true">

2. Editar `/android/app/src/main/res/xml/network_security_config.xml` añadiendo el dominio de nuestro servidor:
   ```
    <?xml version="1.0" encoding="utf-8"?>
    <network-security-config>
        <domain-config cleartextTrafficPermitted="true">
            <domain includeSubdomains="true">192.168.1.135</domain>
        </domain-config>
    </network-security-config>

3. Editar `/android/app/src/main/java/io/ionic/starter/MainActivity.java` añadiendo la función que permite mezclar peticiones HTTP con HTTPS:
   ```
   public class MainActivity extends BridgeActivity {
     @Override
     protected void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
     
         WebView webView = (WebView) this.bridge.getWebView();
         WebSettings webSettings = webView.getSettings();
         webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
     }
   }

---

**Compilación**

Los comando a ejecutar en el directorio raiz de nuestro proyecto para conseguir nuestra APK son los siguientes:

1. `ionic build`
2. `npx cap copy`
3. `npx cap open android`

Una vez hecho esto se nos abrirá Andriod Studio y aqui tendremos que realizar lo siguiente:

1. En la barra superior limpiaremos el proyecto siguiendo la ruta 'Build > Clean Proyect'.
2. En la barra superior volveremos a construir el proyecto siguiendo la ruta 'Build > Rebuild Proyect'.
3. Una vez terminado podremos construir nuestra APK siguiendo la ruta 'Build > Build App Bundle(s) / APK(s) > Build APK(s)'.

Finalmente siguiendo estos pasos tendremos acceso a nuestro archivo .apk que podremos compartir a nuestros dispositivos móviles android e instalar nuestra aplicación.

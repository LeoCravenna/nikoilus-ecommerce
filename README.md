# 🛍️ Nikoilus E-commerce

Este es un proyecto de tienda online desarrollado con **React**, **Firebase**, **Vite** y otras tecnologías modernas. Permite a los usuarios explorar productos, agregarlos al carrito, generar un pedido, y para el rol administrador, gestionar productos desde un panel exclusivo.

---

## 📦 Tecnologías utilizadas

- React 19
- Vite
- Firebase (Firestore, Auth)
- React Router DOM
- SweetAlert2
- React Toastify
- Cloudinary (para almacenamiento de imágenes)
- ESLint

---

## 🚀 Demo

https://nikoilus.netlify.app/

---

## 🛠️ Instalación

1. **Cloná el repositorio:**

```bash
git clone https://github.com/LeoCravenna/nikoilus-ecommerce.git
cd nikoilus-ecommerce

2. **Instalá las dependencias:**

npm install

3. **Configurá el archivo .env :**

Debés crear un archivo .env en la raíz del proyecto y agregar tu API key de Firebase:
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id

4. **Ejecutá el entorno de desarrollo:**

npm run dev

La aplicación estará disponible en http://localhost:5173.

---

## ✨ Funcionalidades principales
 
👥 Roles

Cliente: puede navegar, agregar productos al carrito, confirmar compra.

Administrador: puede acceder al panel /admin para crear, editar y eliminar productos.

🛒 Funciones de cliente

Carrito persistente (usando Context API)

Vista de detalle de productos

Checkout con validaciones

Confirmación visual del pedido

Generación de orden en Firebase

🔐 Panel de administración

Filtro por nombre, categoría y rango de precio

Agregar, editar o eliminar productos

Carga de imágenes a Cloudinary

Vista previa de imágenes antes de guardar

Feedback visual (toasts, loaders y alertas)

---

## 📁 Estructura del proyecto

src/
├── assets/              # Imágenes y recursos estáticos
├── auth/                # Rutas protegidas por rol
├── components/          # Componentes reutilizables (Header, Footer, Cart, etc.)
├── context/             # Context API para carrito y autenticación
├── firebase/            # Configuración de Firebase
├── pages/               # Páginas principales (Home, Login, Admin, etc.)
├── utils/               # Funciones auxiliares como formatPrice
├── App.jsx              # Enrutamiento general
└── main.jsx             # Punto de entrada

---

## 🧪 Scripts disponibles

npm run dev: Ejecuta el servidor de desarrollo

npm run build: Compila el proyecto para producción

npm run preview: Visualiza la versión de producción localmente

npm run lint: Linter con ESLint

---

## 📃 Licencia

Este proyecto está licenciado bajo la MIT License.
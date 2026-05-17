# CMR - Clientes

📦 CMR Clientes - Full Stack App

Sistema de gestión de clientes y productos desarrollado con React, Next.js, GraphQL, Apollo Client y MongoDB.

🚀 Tecnologías usadas
⚛️ React
🔺 Next.js
🔗 Apollo Client / Server
🌐 GraphQL
🗄️ MongoDB
🟢 Node.js
🎨 CSS / Styled Components (o el que estés usando)

## Sección 20: Next.js y Apollo Client - Trabajando con la sección de Pedidos

En esta ocasión para el uso de formularios usaremos React-Select. el cual permite crear un desplegable de opciones.
Para ello debemos instalar el paquete de React-Select y luego importarlo en el componente que lo usaremos.

```bash
npm install react-select
```

- Tiene funcionalidades de búsqueda y filtro.
  - Single: Seleccionar una sola opción
  - Multi: Seleccionar varias opciones
  - Creatable: Permite crear nuevas opciones

## Sección 20: 119. Configurando useReducer para manejar el state de pedidos

En este caso usaremos un useReducer en ves de Redux para manejar el state de los pedidos, junto a contextApi.

## Agregaremos gráficas a nuestro proyecto con recharts

Esta funcionalidad solo sera para el administrador el cual tendrá acceso a la sección de estadísticas.
Para ello debemos instalar el paquete de recharts y luego importarlo en el componente que lo usaremos.

```bash
npm install recharts
```

## Funcionalidad en tiempo real de Apollo Client

- startPolling: Permite realizar consultas cada cierto intervalo de tiempo
- stopPolling: Detener las consultas en tiempo real

Esta dos funcionalidades la usaremos para las gráficas de estadísticas del mejor vendedor y el mejor cliente.

## Deployment en Heroku para el Backend

Debemos usar e instalar el cli de Heroku.

```bash
npm install -g heroku
```
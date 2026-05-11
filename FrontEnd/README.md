# CMR

## Validación de formularios con Formik y Yup

Formik es una librería para construir formularios en React.  
Permite manejar el estado de los formularios de manera sencilla y cómoda.

Yup es una biblioteca para validación de formularios en JavaScript.  
Permite definir reglas de validación para los campos del formulario y validar los datos ingresados por el usuario.

Para instalar estas dos librerías se utiliza el siguiente comando:

```bash
npm install formik yup
```

---

## GraphQL y Apollo

### ¿Qué es GraphQL?

GraphQL es un **lenguaje de consulta para APIs** que permite solicitar exactamente los datos necesarios, ni más ni menos.

A diferencia de REST, donde cada endpoint devuelve respuestas fijas, en GraphQL el cliente define la estructura de la respuesta.

Esto hace que las consultas sean:

- Más eficientes
- Más flexibles
- Más ligeras en red

---

### ¿Qué es Apollo?

Apollo es un **ecosistema de herramientas para trabajar con GraphQL**.

Su objetivo es facilitar la comunicación entre el frontend y el backend utilizando GraphQL.

Apollo se divide principalmente en dos partes:

- Apollo Client (Frontend)
- Apollo Server (Backend)

---

### ¿Qué es Apollo Server?

Apollo Server es la parte del backend que permite crear una API GraphQL.

Con él se pueden:

- Definir tipos de datos (Schema)
- Crear consultas (Queries)
- Crear modificaciones (Mutations)
- Conectar bases de datos u otros servicios

En resumen:

> Apollo Server es el encargado de exponer los datos mediante GraphQL.

---

### ¿Qué es Apollo Client?

Apollo Client es la herramienta del frontend que permite consumir una API GraphQL.

Con él podemos:

- Realizar Queries y Mutations
- Manejar estados de carga y errores
- Guardar respuestas en caché
- Sincronizar datos entre componentes

---

### ¿Qué sucede sin Apollo Client?

Sin Apollo Client:

- Cada componente tendría su propia lógica de requests
- No existiría una caché centralizada
- Habría más código repetido
- Aumentaría la probabilidad de errores
- El proyecto sería menos escalable

---

### En resumen

Apollo Client se utiliza porque:

> Centraliza, optimiza y simplifica toda la comunicación entre el frontend y GraphQL, evitando que el desarrollador tenga que manejar toda esa complejidad manualmente.

En resumen:

> Apollo Client es el encargado de consumir y gestionar los datos que provienen del servidor GraphQL.

---

## Autenticación

Para enviar el JWT en los headers de cada request instalaremos `apollo-link-context`:

```bash
npm install apollo-link-context
```

Esta librería permite agregar o modificar headers dentro del contexto de Apollo Client.

Generalmente se configura directamente en el `ApolloClient`.

---

## SweetAlert2

Para las eliminaciones y alertas utilizaremos la librería `sweetalert2`:

```bash
npm install sweetalert2
```

---

## Actualizar clientes

Formik no actualiza automáticamente los valores iniciales cuando los datos cambian dinámicamente.

Por esta razón, al obtener el `id` desde la URL y cargar la información del cliente, es necesario reinicializar el formulario para mostrar correctamente los datos.
 Por este motivo no se debe reutilizar el componente como el de nuevo cliente para editar clientes, como si se lo hemos echo en otros casos.

### No usaremos `useFormik`

Para manejar los valores iniciales utilizaremos el componente `Formik` que proporciona la librería, en lugar del hook `useFormik`.

De esta manera podremos trabajar directamente dentro del `return` sin afectar las reglas de los hooks, evitando ejecutar hooks de forma condicional después de una carga o renderizado dinámico de datos.


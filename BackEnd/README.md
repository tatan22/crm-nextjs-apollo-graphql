# Apolo y graphql

## Terminología en GraphQL

Existen 4 terminologías principales en GraphQL:

- **Query**: Petición de información
- **Mutation**: Actualización de información
- **Resolver**: Función que resuelve la petición
- **Schema**: Estructura de la información

### Query

En un **CRUD** un query nos permite leer los registros, el query seria la `Read` de un **CRUD**.
Es la forma de extraer la información existente desde la base de datos o REST API.

- En el Query declaras que campos o datos vas a requerir para tu consulta y también
soporta parámetros (input) para filtrar la información.

El query en graphql  es universal, por lo tanto es igual en angular, node o react,
si la base datos en NOSQL o SQL.

#### Ejemplo de Query

```graphql
query {
  obtenerProducto {
    id
    name
    price
    stock
  }
}
```

Repuesta

```json
{
  
  "data": {
    "obtenerProducto": [
      {
        "id": 1,
        "name": "Pasta",
        "price": 10,
        "stock": 10
      }
    ]
  }
}
```

**NOTA**: Existe la contraparte de Query que es la **Mutation**, que es la forma de actualizar la información existente en la base de datos o REST API.

### Mutation

Mutation se utiliza para las otras 3 acciones del **CRUD**, son las acciones de **Create**, **Update** y **Delete**.
Similares a un PUT/PATCH, POST/DELETE de una REST API o un DELETE, UPDATE e INSERT de SQL.

Al igual que el Query son independientes del lenguaje, así que son iguales si tu backend es Node, php o python o si tu base de datos es SQL o NOSQL.

#### Ejemplo de Mutation

```graphql
mutation eliminarProducto($id: ID!) {
  eliminarProducto(id: $id) 
}
```

Repuesta

```json
{
  "data": {
    "eliminarProducto": true
  }
}
```

Los Queries y Mutations se alamacenan en un **Schema**, que es la estructura de la información.

### Schema

Es lo que describe tus tipos de objetos, queries y datos de tu aplicación.
query es el único que es obligatorio en un Schema.

El schema en graphql utiliza un typing en el que le defines si un campo será de tipo String, Int, Boolean u otro tipo de dato.
El schema y el resolver están muy relacionados, en schema define la forma de los  datos mientras que el resolver se encarga de la comunicación con el lenguaje del servidor y la base de datos.

#### Ejemplo de Schema

Definir los campos que va a tener un cliente

```graphql
type Cliente {
  id: ID!
  nombre: String!
  apellido: String!
  empresa: String
  email: [Email] <-- Array de Objetos 
  telefono: String
}
type Email {
  email: String
}
```

Nota: Esta estructura debe ser similar a la estructura de la base de datos.

### Resolver

- Son funciones que son responsables de retornar los valores que existen en tu schema.
- Queries y Mutations por si solos no hacen mucho, requieren un backend para realizar las operaciones en la base de datos.
- Los nombres de los resolver deben ser iguales a los definidos en el Schema.

#### Ejemplo de Resolver

```graphql
obtenerClientes: async () => {
  const clientes = await Cliente.find({});
  return clientes;  
},
```

Veamos juntos Schema y Resolver

```graphql
  type Query {
    obtenerClientes(id: ID!): Cliente
  }
  type Cliente {
    id: ID!
    nombre: String!
    apellido: String!
    empresa: String
    email: [Email] <-- Array de Objetos 
    telefono: String
  }

  obtenerClientes: async (_, { id }) => {
    // consultar Cliente
    const cliente = await Cliente.findById(id);
    return cliente;
  }
```

## Conección a la base de datos con Mongoose

Para ello debemos instalar Mongoose y para las variables de entorno debemos instalar dotenv

```bash
npm install mongoose
npm install dotenv

# Para hacerlo en una sola linea
npm install mongoose dotenv

# Crear archivo .env
touch .env
```

## Tipos de datos en GraphQL y Mongoose

Existen 5 tipos de datos en GraphQL:

- INT = número entero (1, 2, 3, 4, 5)
- FLOAT = número decimal (1.1, 2.2, 3.3, 4.4, 5.5)
- STRING = cadena de texto ("hola", "adios", "que tal")
- ID = identificador (1, 2, 3, 4, 5)
- BOOLEAN = verdadero o falso (true, false)

> Nota: Por este motivo a la fecha le asignamos el tipo de dato String, ya que no tenemos un tipo de dato de fecha en GraphQL

Existen 5 tipos de datos en Mongoose:

- Number = número entero (1, 2, 3, 4, 5)
- String = cadena de texto ("hola", "adios", "que tal")
- Boolean = verdadero o falso (true, false)
- ObjectId = identificador (1, 2, 3, 4, 5)
- Date = fecha (2022-11-01T12:00:00.000Z)

### Hasheo de password

Para el hacheo de password debemos instalar bcryptjs

```bash
npm install bcryptjs
```

### JWT

Para el JWT debemos instalar jsonwebtoken

```bash
npm install jsonwebtoken
```
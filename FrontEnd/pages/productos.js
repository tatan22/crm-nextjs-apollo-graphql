import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import Producto from "../components/Producto";
import Link from "next/link";

const OBTENER_PRODUCTOS = gql`
	query obtenerProductos {
		obtenerProductos {
			id
			nombre
			precio
			existencia
		}
	}
`;
const Productos = () => {
	// consultar los productos
	const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
	if (loading) return <p>Cargando...</p>;
	if (error) return <p>Error: {error.message}</p>;
	return (
		<div className="">
			<Layout>
				<h1 className="text-2xl text-gray-800 font-light">Productos</h1>
				<Link href="/nuevoproducto">
					<a className="bg-blue-800 w-full sm:w-auto font-bold uppercase  text-sm text-white rounded py-2 px-5 shadow-md hover:bg-blue-700 hover:cursor-pointer mt-5 inline-block">
						Nuevo Producto
					</a>
				</Link>
				<table className="table-auto shadow-md mt-10 w-full w-lg">
					<thead className="bg-gray-800">
						<tr className="text-white">
							<th className="w-1/5 py-2">Nombre</th>
							<th className="w-1/5 py-2">Precio</th>
							<th className="w-1/5 py-2">Existencia</th>
							<th className="w-1/5 py-2">Acciones</th>
						</tr>
					</thead>

					<tbody className="bg-white">
						{data.obtenerProductos.map((producto) => (
							<Producto key={producto.id} producto={producto} />
						))}
					</tbody>
				</table>
			</Layout>
		</div>
	);
};

export default Productos;

import Layout from "../components/Layout";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Pedido from "../components/Pedido";

const OBTENER_PEDIDOS = gql`
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
			pedido {
				id
				cantidad
				nombre
			}
			cliente {
				id
				nombre
				apellido
				email
				telefono
			}
			vendedor
			total
			estado
		}
	}
`;

const Pedidos = () => {
	const { data, loading, error } = useQuery(OBTENER_PEDIDOS);
	if (loading) return <p>Cargando...</p>;
	if (error) return <p>Error: {error.message}</p>;
	const { obtenerPedidosVendedor } = data;
	return (
		<div className="">
			<Layout>
				<h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
				<Link href="/nuevopedido">
					<a className="bg-blue-800 w-full sm:w-auto font-bold uppercase  text-sm text-white rounded py-2 px-5 shadow-md hover:bg-blue-700 hover:cursor-pointer mt-5 inline-block">
						Nuevo Pedido
					</a>
				</Link>
				{obtenerPedidosVendedor.length === 0 ? (
					<p className="mt-5 text-center text-2xl text-gray-600">
						No hay pedidos
					</p>
				) : (
					obtenerPedidosVendedor.map((pedido) => {
            return <Pedido key={pedido.id} pedido={pedido} />;
					})
				)}
			</Layout>
		</div>
	);
};

export default Pedidos;

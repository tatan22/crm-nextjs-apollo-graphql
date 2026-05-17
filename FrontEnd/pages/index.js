import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import Cliente from "../components/Cliente";

const OBTENER_CLIENTES_USUARIOS = gql`
	query obtenerClientesVendedor {
		obtenerClientesVendedor {
			id
			nombre
			apellido
			empresa
			email
		}
	}
`;

const Home = () => {
	const router = useRouter();

	const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIOS);

	// ✅ SIEMPRE antes de cualquier return
	useEffect(() => {
		if (!loading && (error || !data?.obtenerClientesVendedor)) {
			localStorage.removeItem("token");
			router.replace("/login");
		}
	}, [loading, data, error, router]);

	// 👇 ahora sí puedes hacer returns
	if (loading) return <p>Cargando...</p>;

	if (!data?.obtenerClientesVendedor) return null;

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
			<Link href="/nuevocliente">
				<a className="bg-blue-800 w-full sm:w-auto font-bold uppercase  text-sm text-white rounded py-2 px-5 shadow-md hover:bg-blue-700 hover:cursor-pointer mt-5 inline-block text-center">
					Nuevo Cliente
				</a>
			</Link>

			{/*  Para uso de tablas responsive */}
			<div className=" overflow-x-scroll">
				<table className="table-auto shadow-md mt-10 w-full w-lg">
					<thead className="bg-gray-800">
						<tr className="text-white">
							<th className="w-1/5 py-2">Nombre</th>
							<th className="w-1/5 py-2">Empresa</th>
							<th className="w-1/5 py-2">Email</th>
							<th className="w-1/5 py-2">Acciones</th>
						</tr>
					</thead>

					<tbody className="bg-white">
						{data.obtenerClientesVendedor.map((cliente) => (
							<Cliente key={cliente.id} cliente={cliente} />
						))}
					</tbody>
				</table>
			</div>
		</Layout>
	);
};

export default Home;

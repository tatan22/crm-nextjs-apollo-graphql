import { useEffect } from "react";
import Layout from "../components/Layout";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
// import { RechartsDevtools } from '@recharts/devtools';
import { gql, useQuery } from "@apollo/client";
import { use } from "react";

const MEJORES_CLIENTES = gql`
	query mejoresClientes {
		mejoresClientes {
			cliente {
				nombre
				empresa
			}
			total
		}
	}
`;

const mejoresClientes = () => {
	const { data, loading, error, startPolling, stopPolling } =
		useQuery(MEJORES_CLIENTES);

	useEffect(() => {
		startPolling(1000); // Después de que pase un cambio hace la consulta pasado un segundo
		//? Cabe resaltar de que no hace consultas cada segundo
		return () => {
			stopPolling();
		};
	}, [startPolling, stopPolling]);

	if (loading) return <p>Cargando...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const { mejoresClientes } = data;

	// Aplanar el array de mejoresVendedores
	const clienteGrafica = [];

	mejoresClientes.map((cliente, index) => {
		clienteGrafica[index] = {
			...cliente.cliente[0],
			total: cliente.total,
		};
	});

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
			<ResponsiveContainer width="99%" height={400}>
				<BarChart
					className="mt-10"
					data={clienteGrafica}
					margin={{
						top: 5,
						right: 0,
						left: 0,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="nombre" />
					<YAxis />
					<Tooltip />
					<Legend />

					<Bar dataKey="total" fill="#3182CE" radius={[10, 10, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</Layout>
	);
};

export default mejoresClientes;

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

const MEJORES_VENDEDORES = gql`
	query mejoresVendedores {
		mejoresVendedores {
			vendedor {
				name
				email
			}
			total
		}
	}
`;

// const data = [
// 	{
// 		name: "Page A",
// 		uv: 4000,
// 		pv: 2400,
// 		amt: 2400,
// 	},
// 	{
// 		name: "Page B",
// 		uv: 3000,
// 		pv: 1398,
// 		amt: 2210,
// 	},
// 	{
// 		name: "Page C",
// 		uv: 2000,
// 		pv: 9800,
// 		amt: 2290,
// 	},
// 	{
// 		name: "Page D",
// 		uv: 2780,
// 		pv: 3908,
// 		amt: 2000,
// 	},
// 	{
// 		name: "Page E",
// 		uv: 1890,
// 		pv: 4800,
// 		amt: 2181,
// 	},
// 	{
// 		name: "Page F",
// 		uv: 2390,
// 		pv: 3800,
// 		amt: 2500,
// 	},
// 	{
// 		name: "Page G",
// 		uv: 3490,
// 		pv: 4300,
// 		amt: 2100,
// 	},
// ];

const mejoresVendedores = () => {
	const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES);

	useEffect(() => {
		startPolling(1000); // Después de que pase un cambio hace la consulta pasado un segundo
		//? Cabe resaltar de que no hace consultas cada segundo
		return () => {
			stopPolling();
		};
	}, [startPolling, stopPolling]);

	if (loading) return <p>Cargando...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const { mejoresVendedores } = data;
	// Aplanar el array de mejoresVendedores
	const vendedorGrafica = [];
	mejoresVendedores.map((vendedor, index) => {
		vendedorGrafica[index] = {
      ...vendedor.vendedor[0],
			total: vendedor.total,
		};
	});


	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Mejores Vendedores</h1>
			<ResponsiveContainer width="90%" height={400}>
				<BarChart
					className="mt-10"
					data={vendedorGrafica}
					margin={{
						top: 5,
						right: 0,
						left: 0,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />

					<Bar dataKey="total" fill="#3182CE" radius={[10, 10, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</Layout>
	);
};

export default mejoresVendedores;

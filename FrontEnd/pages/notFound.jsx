import Link from "next/link";
import Layout from "../components/Layout";

const NotFound = () => {
	return (
		<Layout>
			<div className="flex flex-col items-center justify-center mt-20">
				<h1 className="text-6xl font-bold text-gray-800">
					404
				</h1>

				<p className="text-xl text-gray-600 mt-4">
					Página no encontrada
				</p>

				<Link href="/">
					<a className="mt-6 bg-blue-800 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-colors">
						Volver al Inicio
					</a>
				</Link>
			</div>
		</Layout>
	);
};

export default NotFound;
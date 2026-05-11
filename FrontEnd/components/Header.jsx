import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const OBTENER_CLIENTES_USUARIOS = gql`
	query obtenerUsuario {
		obtenerUsuario {
			id
			name
			lastName
			email
		}
	}
`;

const Header = () => {
	const router = useRouter();

	const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIOS);

	// prevenir render antes de tener datos
	if (loading) return <p>Cargando...</p>;

	if(!data){
    console.log(error);
    return router.push("/login");
  }

	const { name, lastName } = data.obtenerUsuario;

	const cerrarSession = async () => {
		localStorage.removeItem("token");
		await router.push("/login");
	};

	return (
		<header className="flex justify-between mb-6 align-items-center">
			<p className="text-xl mr-2">
				<span className="font-bold">Hola:</span>{" "}
				<span className="font-normal">
					{name || "User"} {lastName || "User"}
				</span>
			</p>

			<button
				className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs text-white rounded py-1 px-2 shadow-md hover:bg-blue-700 hover:cursor-pointer"
				type="button"
				onClick={cerrarSession}
			>
				Cerrar Sesión
			</button>
		</header>
	);
};

export default Header;

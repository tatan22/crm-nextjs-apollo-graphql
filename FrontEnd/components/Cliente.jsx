// Para Eliminaciones usaremos la librería de sweeter2
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import { data } from "autoprefixer";
import Router from "next/router"; // Este permite redireccionar y pasar parameters por url
import { pid } from "process";

const ELIMINAR_CLIENTE = gql`
	mutation eliminarCliente($id: ID!) {
		eliminarCliente(id: $id)
	}
`;
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

const Cliente = ({ cliente }) => {
	// mutation
	const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
		update(cache, _, { variables }) {
			//Obtener una copia del objeto de cache
			const { obtenerClientesVendedor } = cache.readQuery({
				query: OBTENER_CLIENTES_USUARIOS,
			});
			//Reescribir el cache
			cache.writeQuery({
				query: OBTENER_CLIENTES_USUARIOS,
				data: {
					obtenerClientesVendedor: obtenerClientesVendedor.filter(
						(clienteActual) => clienteActual.id !== variables.id,
					),
				},
			});
		},
	});
	const { nombre, apellido, empresa, email } = cliente;

	const eliminarClienteMutation = (id) => {
		Swal.fire({
			title: "¿ Estas seguro de eliminar el cliente ?",
			text: "No podrás revertir esto !",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sí, eliminarlo !",
			cancelButtonText: "No, Cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					// Eliminar por id
					const { data } = await eliminarCliente({
						variables: {
							id,
						},
					});
					// Mostrar alerta de eliminado
					Swal.fire({
						title: "Eliminado!",
						text: data.eliminarCliente,
						icon: "success",
					});
				} catch (error) {
					console.log("Error al eliminar cliente: ", error);
					Swal.fire({
						title: "Error!",
						text: data.eliminarCliente,
						icon: "error",
					});
				}
			}
		});
	};
	
	const editarCliente = (id) => {
		Router.push({
			pathname: "/editarcliente/[id]", // crear un directorio editarcliente y dentro un archivo [pid].js
			query: { id },
		});
	};
	return (
		<tr>
			<td className="border px-4 py-2">
				{nombre} {apellido}
			</td>
			<td className="border px-4 py-2">{empresa}</td>
			<td className="border px-4 py-2">{email}</td>
			<td className="flex items-center justify-center border px-4 py-2 gap-2">
				{/* Usaremos heroicons para el icono de los botones */}
				<button
					className="flex items-center justify-center gap-2 bg-blue-800 w-full sm:w-auto font-bold uppercase  text-xs text-white rounded py-2 px-5 shadow-md hover:bg-blue-700 hover:cursor-pointer "
					onClick={() => editarCliente(cliente.id)}
				>
					Editar
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-5"
					>
						{/* Recordar que las clase en react se escriben con camelCase */}
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</button>
				<button
					type="button"
					className="flex items-center justify-center gap-2 bg-red-800 w-full sm:w-auto font-bold uppercase  text-xs text-white rounded py-2 px-5 shadow-md hover:bg-red-700 hover:cursor-pointer"
					onClick={() => eliminarClienteMutation(cliente.id)}
				>
					Eliminar
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				</button>
			</td>
		</tr>
	);
};

export default Cliente;

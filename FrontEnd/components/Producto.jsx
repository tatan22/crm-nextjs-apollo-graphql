import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const ELIMINAR_PRODUCTO = gql`
	mutation eliminarProducto($id: ID!) {
		eliminarProducto(id: $id)
	}
`;

const Producto = ({ producto }) => {
	const { nombre, precio, existencia, id } = producto;
	// Mutación para eliminar producto
	const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
		update(cache) {
			const { obtenerProductos } = cache.readQuery({
				query: OBTENER_PRODUCTOS,
			});
			cache.writeQuery({
				query: OBTENER_PRODUCTOS,
				data: {
					// Solo reescribimos lo que queremos que es obtenerProductos
					obtenerProductos: obtenerProductos.filter(
						(productoActual) => productoActual.id !== id,
					),
				},
			});
		},
	});

	const confirmarEliminarProducto = () => {
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
					// Eliminar producto de la base de datos
					const { data } = await eliminarProducto({
						variables: {
							id,
						},
					});
					// Mostrar alerta de eliminado
					Swal.fire({
						title: "Eliminado!",
						text: data.eliminarProducto,
						icon: "success",
					});
				} catch (error) {
					console.log("Error al eliminar producto: ", error);
				}
			}
		});
	};
	return (
		<tr>
			<td className="border px-4 py-2">{nombre}</td>
			<td className="border px-4 py-2">$ {precio}</td>
			<td className="border px-4 py-2">{existencia} U/des </td>
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
					onClick={confirmarEliminarProducto}
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

export default Producto;

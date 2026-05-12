import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import { gql, useQuery } from "@apollo/client";

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

const NuevoPedido = () => {
  const { data, loading } = useQuery(OBTENER_CLIENTES_USUARIOS);
  if (loading) return "Cargando...";
  if (!data.obtenerClientesVendedor) return null;
	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
			<AsignarCliente />
		</Layout>
	);
};

export default NuevoPedido;

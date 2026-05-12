import Layout from "../components/Layout";
import Link from "next/link";

const Pedidos = () => {
	return <div className="">
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
      <Link href="/nuevopedido">
        <a className="bg-blue-800 w-full sm:w-auto font-bold uppercase  text-sm text-white rounded py-2 px-5 shadow-md hover:bg-blue-700 hover:cursor-pointer mt-5 inline-block">
          Nuevo Pedido
        </a>        
      </Link>
    </Layout>
  </div>;
};

export default Pedidos;

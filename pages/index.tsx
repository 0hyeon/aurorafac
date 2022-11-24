import Item from "@components/item";
import Layout from "@components/layout";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Layout title="홈" /*hasTabBar*/ seoTitle="Home">
      <div className="flex flex-col space-y-5 divide-y">
        {[1, 1, 1, 1, 1, 1, 1].map((product: any) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            image={product.image}
            comments={99}
            // hearts={product._count.favs}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;

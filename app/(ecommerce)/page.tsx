"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getCatalogProducts } from "@/actions/catalog/getCatalogProducts";
import { ICatalog } from "@/types/catalog";
import ProductCatalog from "@/components/ProductCatalog";

const banners = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Get the best offers on summer collection",
    image: "/banner4.png",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [Products, setProducts] = useState<ICatalog[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      const catalog = await getCatalogProducts();
      //console.log(catalogs);
      if (catalog?.length) {
        setProducts(catalog);
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <section className="mt-12 mb-12">
          <motion.div
            className="relative overflow-hidden rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative w-full h-[400px]"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src={banners[0].image}
                layout="fill"
                objectFit="cover"
                alt={banners[0].title}
                className="rounded-lg bg-no-repeat"
              />

              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col text-center">
                <h2 className="text-4xl font-bold mb-4 text-white">
                  {banners[0].title}
                </h2>
                <p className="text-xl mb-8 text-gray-300">
                  {banners[0].description}
                </p>

                <Button className="bg-[#00ffff] hover:bg-[#00cccc] text-black font-semibold">
                  Shop Now
                  <ArrowRight />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg shadow-lg animate-pulse p-5"
                layout
              >
                <div className="h-48 rounded-md mb-4 bg-gray-700 w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {Products.map((product) => (
          <ProductCatalog
            key={product.id}
            title={product.localizeInfos?.title || "Default Title"}
            products={product.catalogProducts.items}
          />
        ))}
      </main>
    </div>
  );
}

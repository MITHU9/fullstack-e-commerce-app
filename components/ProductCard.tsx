"use client";

import { IProduct } from "@/types/product";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const ProductCard = ({ product }: { product: IProduct }) => {
  const handleAddToCart = (product: IProduct) => {
    console.log(product);
  };

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="group relative flex h-full bg-gray-800 overflow-hidden border-gray-700 flex-col rounded-lg shadow-lg">
        <div className="relative w-full pt-[100%] bg-transparent">
          <Image
            src={product.attributeValues.p_image.value.downloadLink}
            layout="fill"
            objectFit="contain"
            alt={product.localizeInfos?.title}
            className="transition-transform duration-300 saturate-200 group-hover:scale-110"
          />
        </div>

        <div className="p-4 flex-grow">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-xl mb-2 text-white font-semibold group-hover:text-[#00ffff] transition-colors duration-300 line-clamp-2">
              {product.attributeValues.p_title.value}
            </h3>
          </Link>
          <p className="text-gray-400 ">${product.price.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            <Star className="size-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-400">4.5</span>
          </div>
        </div>

        <div className="p-4">
          <Button
            className="bg-[#00ffff] hover:bg-[#00cccc] transition-all duration-300 transform group-hover:translate-y-0 text-black font-semibold w-full translate-y-6"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className="size-5 mr-2" />
            Add to Cart
          </Button>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#00ffff] to-[#00cccc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;

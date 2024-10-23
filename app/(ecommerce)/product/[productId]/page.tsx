/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProductDetails } from "@/actions/catalog/getProductDetails";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getRelatedProducts } from "@/actions/catalog/getRelatedProducts";
import ProductCatalog from "@/components/ProductCatalog";

const ProductDetails = ({
  params: { productId },
}: {
  params: {
    productId: string;
  };
}) => {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductDetails(parseInt(productId));
        setProduct(productData);
        const relatedProductData = await getRelatedProducts(
          parseInt(productData?.productPages[0].pageId),
          parseInt(productId)
        );
        setRelatedProducts(relatedProductData);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        quantity: 1,
        name: product.attributeValues.p_title.value,
        price: product.price,
        image: product.attributeValues.p_image.value.downloadLink,
      });
      toast({
        title: "Added to cart",
        description: `${product.attributeValues.p_title.value} has been added to cart`,
        variant: "tealBlack",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
        <motion.div
          className="w-16 h-16 border-4 border-t-[#00ffff] border-r-[#00ffff] border-b-gray-800 border-l-gray-800 rounded-full animate-spin"
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <motion.button
          className="mb-8 mt-12 flex items-center text-[#00ffff] hover:text-[#00cccc] transition-colors duration-300"
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft className="size-5 mr-2" />
          Back
        </motion.button>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
            <Image
              className="transition-transform duration-300 hover:scale-110"
              src={product.attributeValues.p_image.value.downloadLink}
              layout="fill"
              objectFit="contain"
              alt={product.attributeValues.p_title.value}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4 text-[#00ffff]">
              {product.attributeValues.p_title.value}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`size-5 text-yellow-400 ${
                      index < 4 ? "mr-1" : ""
                    }`}
                    fill={index < 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-gray-400">(4.5 stars)</span>
            </div>
            <p className="text-gray-300 font-bold text-lg mb-4">
              ${product.attributeValues.p_price.value.toFixed(2)}
            </p>

            <div
              className="text-gray-400"
              dangerouslySetInnerHTML={{
                __html:
                  product.attributeValues.p_description.value[0].htmlValue,
              }}
            />
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="bg-[#00ffff] hover:bg-[#00cccc] text-black font-semibold py-2 px-4 rounded-lg w-full"
              >
                <ShoppingCart className="size-5 mr-2" />
                Add to Cart
              </Button>
              <Button className=" hover:bg-gray-700 text-black font-semibold rounded-lg text-center">
                <Heart className="size-5 text-[#00ffff] " />
              </Button>
            </div>
          </div>
        </motion.div>

        {relatedProducts.length > 0 && (
          <motion.section
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCatalog
              title="Related Products"
              products={relatedProducts}
            />
          </motion.section>
        )}
      </main>
    </div>
  );
};
export default ProductDetails;

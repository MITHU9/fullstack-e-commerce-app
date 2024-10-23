"use client";

import { searchProductAction } from "@/actions/catalog/searchProduct";
import { useSearchParams } from "next/navigation";
import { IProductEntity } from "oneentry/dist/products/productsInterfaces";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProductEntity[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCatagories, setSelectedCatagories] = useState<string[]>([]);

  const params = useSearchParams();
  const urlSearchTerm = params.get("searchTerm");

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.attributeSetIdentifier))
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearchTerm = product.attributeValues.p_title.value
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const inPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const inSelectedCategories =
        selectedCatagories.length === 0 ||
        selectedCatagories.includes(product.attributeSetIdentifier);
      return inPriceRange && inSelectedCategories && matchesSearchTerm;
    });
  }, [searchTerm, priceRange, selectedCatagories, products]);

  useEffect(() => {
    const searchProduct = async () => {
      if (urlSearchTerm) {
        const data = await searchProductAction(urlSearchTerm);
        setProducts(data);
        setIsLoading(false);
      }
    };
    searchProduct();
  }, [urlSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex mt-20 items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-800 hover:bg-gray-700 text-[#00ffff]"
          >
            <Filter className="size-5 mr-2" />
            Filters
          </Button>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-8">
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="lg:w-1/4 w-full bg-gray-800 rounded-lg shadow-lg px-2"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[#00ffff] p-4">
                    Filters
                  </h2>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-[#00ffff]"
                  >
                    <X className="size-5 " />
                  </Button>
                </div>
                <div className="">
                  <div>
                    <Label className="text-lg text-gray-300">Search</Label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-700 text-white w-full p-2 border-none outline-none rounded-lg text-sm pl-8"
                      />
                      <Search className="size-5 absolute left-2 top-2 bg-transparent text-[#00ffff]" />
                    </div>
                  </div>
                  <div className="mt-4 ">
                    <Label className="text-lg text-gray-300 ">
                      Price Range
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={3000}
                      step={1}
                      className="mt-2 bg-[#00ffff]"
                    />

                    <div className="flex justify-between mt-2 text-sm text-gray-400">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-lg text-gray-300">Categories</Label>
                    <div className="mt-2">
                      {categories.map((category) => (
                        <div key={category}>
                          <input
                            type="checkbox"
                            id={category}
                            checked={selectedCatagories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCatagories([
                                  ...selectedCatagories,
                                  category,
                                ]);
                              } else {
                                setSelectedCatagories(
                                  selectedCatagories.filter(
                                    (selected) => selected !== category
                                  )
                                );
                              }
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={category} className="text-gray-400">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <LayoutGroup>
            <motion.div
              className={`w-full ${showFilters ? "lg:3/4" : ""}`}
              layout
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
              <AnimatePresence>
                {isLoading ? (
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
                ) : (
                  <>
                    {products.length > 0 ? (
                      <motion.div
                        key="products"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`
                        grid grid-cols-1 md:grid-cols-3 lg:grid-cols-${
                          showFilters ? "3" : "4"
                        } gap-6`}
                      >
                        <AnimatePresence>
                          {filteredProducts.map((product) => (
                            <motion.div
                              key={product.id}
                              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <ProductCard product={product} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <div className="text-4xl text-[#00ffff] font-bold">
                          No products found
                        </div>
                      </div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
};
export default SearchPage;

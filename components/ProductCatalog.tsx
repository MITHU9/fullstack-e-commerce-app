import { IProduct } from "@/types/product";
import ProductCard from "./ProductCard";

const ProductCatalog = ({
  title,
  products,
}: {
  title: string;
  products: IProduct[];
}) => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 mt-4 text-[#00ffff]">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: IProduct) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
export default ProductCatalog;

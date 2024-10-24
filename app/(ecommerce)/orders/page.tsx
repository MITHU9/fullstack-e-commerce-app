"use client";

import { getOrders } from "@/actions/orders/getOrders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number | null;
}

interface OrderItem {
  id: string;
  createdDate: string;
  statusIdentifier: "processing" | "shipped" | "delivered" | "cancelled";
  totalSum: string;
  products: Product[];
}

interface IOrder {
  items: OrderItem[];
  total: number;
}

const orderStatusIcon = {
  processing: <Package className="size-5 text-yellow-500" />,
  shipped: <Truck className="size-5 text-blue-500" />,
  delivered: <CheckCircle className="size-5 text-green-500" />,
  cancelled: <AlertCircle className="size-5 text-red-500" />,
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();

      console.log(data);

      if (data !== undefined) {
        setOrders({ items: data.items.reverse(), total: data.total });
        setIsLoading(false);
      } else {
        setOrders({ items: [], total: 0 });
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-8 mt-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#00ffff] to-[#00cccc]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          My Orders
        </motion.h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={index}
                className="bg-gray-800 rounded-lg shadow-lg animate-pulse p-4 sm:p-6 flex flex-col space-y-2"
              >
                <div className="h-6 bg-gray-700 rounded w-1/4 "></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 "></div>

                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {orders.items.length > 0 ? (
              <>
                {orders.items.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-2 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold text-[#00ffff]">
                          Order #{order.id}
                        </h2>
                        <Badge className={`text-white`}>
                          {orderStatusIcon[order.statusIdentifier]}
                          <span className="ml-2 capitalize">
                            {order.statusIdentifier}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex justify-between text-gray-400 mb-4">
                        <span>
                          Order Date:{order.createdDate?.split("T").shift()}
                        </span>
                        <span>Total: ${order.totalSum}</span>
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="items">
                          <AccordionTrigger className="text-[#00ffff] hover:text-[#00cccc] cursor-pointer">
                            View Order Details
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col space-y-2">
                              {order.products.map((product) => (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between"
                                >
                                  <div>
                                    <p className="text-lg font-semibold">
                                      {product.title}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {product.quantity} x ${product.price}
                                    </p>
                                  </div>
                                  <p className="text-lg font-semibold">
                                    ${(product.quantity || 1) * product.price}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <div className="bg-gray-700 p-4 flex justify-between items-center">
                      <Button className="text-[00ffff] border-[#00ffff] hover:bg-[#00ffff] hover:text-gray-900">
                        Track Order
                      </Button>
                      <Button className="text-gray-400 hover:text-[#00ffff]">
                        Need Help?
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col space-y-2"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold">No Orders Found</h2>
                  <p className="text-gray-400">
                    You haven&apos; placed any orders yet.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};
export default OrdersPage;

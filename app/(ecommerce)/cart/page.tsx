"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import getUserSession from "@/actions/auth/getUserSession";
import useCartStore from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, LogInIcon, ShoppingCart, Trash2 } from "lucide-react";

const Cart = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const [user, setUser] = useState<IUserEntity | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeCartItem = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [isLoading, setIsLoading] = useState(true);

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subTotal * 0.07;
  const total = subTotal + tax;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserSession();
        if (userData) {
          setUser(userData as IUserEntity);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-gray-100">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold mb-8 mt-14
          sm:text-4xl text-center sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#00ffff] to-[#26a9b8]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your Cart
        </motion.h1>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={index}
                className="bg-gray-800 rounded-lg shadow-lg animate-pulse p-4 sm:p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="size-16 rounded-md sm:size-20 bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4 "></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 "></div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 relative overflow-hidden"
                  >
                    <div className="flex sm:items-center space-x-4 flex-row sm:space-x-4">
                      <Image
                        src={item.image}
                        width={80}
                        height={80}
                        alt={item.name}
                        className="size-16 sm:size-20 object-cover rounded-md"
                      />

                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold text-[#00ffff] line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-400">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-gray-400">Quantity: </span>
                          {""}
                          <div className="flex  justify-between gap-2">
                            <Button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="bg-gray-600 font-bold hover:bg-[#00ffff] p-2 rounded-lg w-8"
                            >
                              -
                            </Button>

                            <Input
                              type="number"
                              min={0}
                              value={item.quantity}
                              className="w-16 inline-block p-2 border-gray-700 bg-gray-800 text-gray-100 text-center"
                              onChange={(e) =>
                                updateQuantity(item.id, +e.target.value)
                              }
                            />

                            <Button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="bg-gray-600 font-bold hover:bg-[#00ffff] p-2 rounded-lg w-8"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between gap-3">
                        <Button
                          onClick={() => removeCartItem(item.id)}
                          className="bg-gray-600 hover:bg-[#00cccc] p-2 rounded-lg w-8"
                        >
                          <Trash2 size={24} color="red" className="size-6" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingCart className="mx-auto size-20 text-gray-400" />
                  <h2 className="text-center text-[#00ffff] mb-2 font-bold text-xl">
                    Your cart is empty! add some items to cart.
                  </h2>
                  <p className="text-gray-400 mb-6 text-center">
                    looks like you haven&apos;t added any items to your cart
                    yet.
                  </p>
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={() => router.push("/")}
                      className="bg-[#00ffff] hover:bg-[#00cccc] text-gray-900 font-semibold"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {cartItems.length > 0 && (
              <motion.div
                className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#00ffff]">
                      Subtotal
                    </h3>
                    <p className="text-gray-400">Items in your cart</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-[#00ffff]">
                      ${subTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#00ffff]">
                      Tax
                    </h3>
                    <p className="text-gray-400">7% tax</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-[#00ffff]">
                      ${tax.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#00ffff]">
                      Total
                    </h3>
                    <p className="text-gray-400">Total amount</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-[#00ffff]">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
                {user ? (
                  <div className="mt-6">
                    <Button
                      onClick={() => router.push("/checkout")}
                      className="w-full bg-[#00ffff] hover:bg-[#00cccc] text-gray-900 font-semibold"
                    >
                      <CreditCard size={24} />
                      Proceed to Checkout
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6">
                    <Button
                      onClick={() => router.push("/auth?type=login")}
                      className="bg-[#00ffff] hover:bg-[#00cccc] w-full text-gray-900 font-semibold"
                    >
                      <LogInIcon size={24} />
                      Login to Checkout
                    </Button>
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    onClick={() => clearCart()}
                    className="bg-[#00ffff] hover:bg-[#00cccc] text-gray-900 font-semibold"
                  >
                    Clear Cart
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};
export default Cart;

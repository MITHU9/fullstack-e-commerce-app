"use client";

import { CheckCircle, Home, Package, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const SuccessPage = () => {
  const steps = [
    {
      icon: CheckCircle,
      text: "Order Confirmed",
    },
    {
      icon: Package,
      text: "Processing",
    },
    {
      icon: Truck,
      text: "Shipping",
    },
    {
      icon: Home,
      text: "Delivered",
    },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <motion.div
        className="bg-gray-800 max-w-md shadow-lg rounded-lg p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 260 }}
        >
          <CheckCircle className="size-20 text-[#00ffff] mx-auto mb-4" />
          <h2 className="text-3xl text-[#00ffff] font-bold">
            Order Successful!
          </h2>
          <p className="text-gray-400">
            Your order has been placed and is being processed.
          </p>
        </motion.div>

        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-4 text-[#00ffff]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <step.icon
                className={`size-6 ${
                  index === 0 ? "text=[#00ffff]" : "text-gray-500"
                }`}
              />
              <div
                className={`flex-1 h-1 ${
                  index === 0 ? "bg-[#00ffff]" : "bg-gray-700"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  index === 0 ? "text-[#00ffff]" : "text-gray-400"
                }`}
              >
                {step.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-gray-400 pb-5">
            Thank you for shopping with us. Your order will be delivered soon.
          </p>
          <div className="space-x-4">
            <Link href="/" passHref>
              <Button className="bg-[#00ffff] hover:bg-[#00cccc] text-black font-semibold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default SuccessPage;

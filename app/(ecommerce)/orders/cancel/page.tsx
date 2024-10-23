"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";

const CancelPage = () => {
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
          <XCircle className="size-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl text-red-500 font-bold">Order Cancelled</h2>
          <p className="text-gray-400">
            Your order has been cancelled successfully
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-700 p-4 rounded-lg mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-4 text-yellow-400 mb-2">
            <AlertTriangle className="size-6" />
            <h2 className="text-lg font-semibold">What happens next?</h2>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li className="text-gray-400">
              Any amount debited will be refunded to your account
            </li>
            <li className="text-gray-400">
              You will receive a confirmation email shortly
            </li>
            <li className="text-gray-400">
              Feel free to reach out to us if you have any questions.
            </li>
          </ul>
        </motion.div>
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-gray-400">
            We are sorry to see you go. If you have any feedback, please let us
            know.
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
export default CancelPage;

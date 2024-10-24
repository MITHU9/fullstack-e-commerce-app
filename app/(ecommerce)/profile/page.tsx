"use client";

import getUserSession from "@/actions/auth/getUserSession";
import { getOrders } from "@/actions/orders/getOrders";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, DollarSign, Package } from "lucide-react";

interface UserStats {
  lifeLineOrders: number;
  lifeLineSpent: number;
  yearlyOrders: number;
  yearlySpent: number;
  monthlyOrders: number;
  monthlySpent: number;
}

const ProfilePage = () => {
  const [user, setUser] = useState<IUserEntity | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    lifeLineOrders: 42,
    lifeLineSpent: 3750.5,
    yearlyOrders: 15,
    yearlySpent: 1250.75,
    monthlyOrders: 5,
    monthlySpent: 355.55,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserSession();
      if (user && "id" in user) {
        setUser(user as IUserEntity);
      }

      const orders = await getOrders();

      if (orders) {
        let lifeLineOrders = 0;
        let lifeLineSpent = 0;
        let yearlyOrders = 0;
        let yearlySpent = 0;
        let monthlyOrders = 0;
        let monthlySpent = 0;

        orders.items.forEach(
          (order: { createdDate: string; totalSum: string }) => {
            const orderDate = new Date(order.createdDate);
            const orderYear = orderDate.getFullYear();
            const orderMonth = orderDate.getMonth() + 1;
            const totalSum = parseFloat(order.totalSum);
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            lifeLineOrders++;
            lifeLineSpent += totalSum;

            if (orderYear === currentYear) {
              yearlyOrders++;
              yearlySpent += totalSum;
            }

            if (orderYear === currentYear && orderMonth === currentMonth) {
              monthlyOrders++;
              monthlySpent += totalSum;
            }
          }
        );

        setUserStats({
          lifeLineOrders,
          lifeLineSpent,
          yearlyOrders,
          yearlySpent,
          monthlyOrders,
          monthlySpent,
        });
      }
    };
    fetchUser();
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
          My Profile
        </motion.h1>

        {isLoading ? (
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 bg-gray-700 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24 text-6xl text-[#00ffff]">
                  <AvatarFallback className="bg-[#0f172a]">
                    {user?.formData[0].value.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl text-[#00ffff] font-bold">
                    {user?.formData[0].value}
                  </h2>
                  <p className="text-gray-400">{user?.identifier}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-[#00ffff]">
                My Stats
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={<Package className="w-8 h-8 text-[#00ffff]" />}
                  title="Lifetime Orders"
                  value={userStats.lifeLineOrders}
                />
                <StatCard
                  icon={<DollarSign className="w-8 h-8 text-[#00ffff]" />}
                  title="Lifetime Spent"
                  value={`$${userStats.lifeLineSpent.toFixed(2)}`}
                />
                <StatCard
                  icon={<Calendar className="w-8 h-8 text-[#00ffff]" />}
                  title="This Year Orders"
                  value={`${userStats.yearlyOrders} orders`}
                  subValue={`$${userStats.yearlySpent.toFixed(2)} spent`}
                />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subValue?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-700 p-4 rounded-lg shadow-lg flex items-center space-x-4"
    >
      <div className="bg-gray-800 p-2 rounded-lg">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold text-[#00ffff]">{title}</h4>
        <p className="text-gray-400">
          {value}
          {subValue && <span className="block text-sm">{subValue}</span>}
        </p>
      </div>
    </motion.div>
  );
};

export default ProfilePage;

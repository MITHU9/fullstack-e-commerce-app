"use client";

import { getLoginFormData, handleLoginSubmit } from "@/actions/auth/login";
import { getSignupFormData, handleSignupSubmit } from "@/actions/auth/signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Facebook,
  Github,
  Key,
  Loader2,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { IAttributes } from "oneentry/dist/base/utils";
import { useEffect, useState } from "react";

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}
interface LoginFormData {
  email: string;
  password: string;
}

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState<
    Partial<SignUpFormData & LoginFormData>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IAttributes[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type");
    setIsSignUp(type !== "login");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchData = isSignUp ? getSignupFormData : getLoginFormData;
    fetchData()
      .then((data) => setFormData(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [isSignUp]);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setInputValues({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    // Perform submission
    try {
      if (isSignUp) {
        if (inputValues.email && inputValues.password && inputValues.name) {
          const response = await handleSignupSubmit(
            inputValues as SignUpFormData
          );
          if (response && "identifier" in response) {
            setInputValues({});
            setIsSignUp(false);
            toast({
              title: "Account created successfully",
              duration: 3000,
              variant: "tealBlack",
            });
          } else {
            setError(response?.message || "An unknown error occurred");
          }
        } else {
          setError("Please fill all the fields");
        }
      } else {
        if (inputValues.email && inputValues.password) {
          const response = await handleLoginSubmit(
            inputValues as LoginFormData
          );
          if (response.message) {
            setError(response.message);
          }
        } else {
          setError("Please fill all the fields");
        }
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, x: isSignUp ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignUp ? 50 : -50 }}
            transition={{ duration: 0.5 }}
            key={isSignUp ? "signup" : "signin"}
            className="w-full lg:w-3/5 p-4 sm:p-8 lg:p-12"
          >
            <div
              className="mb-8 lg:mb-12 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="text-gray-400 size-6 sm:size-8" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                {isSignUp ? "Sign Up" : "Sign In"}
              </h1>
              <p className="text-gray-400 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8">
                {isSignUp
                  ? "Sign up to get started shopping from our E-Commerce site"
                  : "Welcome back! Please Sign in to access your account"}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="size-8 animate-spin text-[#00FFFF]" />{" "}
              </div>
            ) : (
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {formData.map((field) => (
                  <motion.div
                    key={field.marker}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label
                      htmlFor={field.marker}
                      className="text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block lg:text-xl"
                    >
                      {field.localizeInfos.title}
                    </Label>
                    <Input
                      type={field.marker === "password" ? "password" : "text"}
                      id={field.marker}
                      name={field.marker}
                      placeholder={field.localizeInfos.title}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white p-5 sm:p-6 lg:p-8 text-lg sm:text-xl lg:text-2xl"
                      value={
                        inputValues[field.marker as keyof typeof inputValues] ||
                        ""
                      }
                      disabled={isSubmitting}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                ))}
                {error && (
                  <motion.div
                    className="text-red-400 text-base sm:text-lg lg:text-xl text-center mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-[#00FFFF] text-black hover:bg-[#00CCCC] text-lg sm:text-xl lg:text-2xl p-4 sm:p-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-5 sm:size-6 animate-spin " />
                    ) : isSignUp ? (
                      "Sign Up"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </form>
            )}

            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-base sm:text-lg lg:text-xl text-gray-400">
                or continue with
              </div>
              <div className="flex gap-4 items-center">
                <Button
                  className="size-12 bg-gray-900 border-gray-700 p-2 sm:size-auto"
                  variant="outline"
                  size="icon"
                  disabled={isSubmitting}
                >
                  <Facebook className="size-5 sm:size-6" />
                  <span className="hidden sm:inline-block sm:ml-2">
                    Facebook
                  </span>
                </Button>
                <Button
                  className="size-12 bg-gray-900 border-gray-700 p-2 sm:size-auto"
                  variant="outline"
                  size="icon"
                  disabled={isSubmitting}
                >
                  <Github className="size-5 sm:size-6" />
                  <span className="hidden sm:inline-block sm:ml-2">Github</span>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="mt-4 sm:mt-5 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-base sm:text-lg lg:text-xl text-white">
                {isSignUp ? "Already a member?" : "Don't have an account?"}
              </p>
              <Button
                className="text-lg sm:text-xl lg:text-2xl text-white underline"
                onClick={toggleForm}
                variant={"link"}
                disabled={isSubmitting}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="w-full hidden lg:w-2/5 bg-gradient-to-br from-[#00FFFF] to-black p-12 lg:flex flex-col justify-between items-center h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-12 h-full flex flex-col items-center justify-center">
            <motion.div
              className="bg-black bg-opacity-50 rounded-lg p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isSignUp ? (
                <>
                  <h3 className="text-3xl font-bold mb-4">New Arrivals</h3>
                  <p className="text-5xl font-bold mb-4">1,134</p>
                  <div className="flex justify-between items-center w-full">
                    <div className="h-3 w-36 bg-black bg-opacity-50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#00FFFF]"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-end">
                      70% increase
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3 py-0">
                  <h3 className="text-3xl font-bold mb-4">Customer Reviews</h3>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-8 text-yellow-400 mr-1" />
                    ))}
                    <span className="ml-2 text-3xl font-bold">4.9</span>
                  </div>
                  <p className="text-xl text-gray-200">
                    Based on 10,000+ reviews
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              className="bg-black bg-opacity-50 rounded-lg p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                {isSignUp ? (
                  <ShoppingBag className="text-[#00FFFF] size-8 mr-4" />
                ) : (
                  <Key className="text-[#00FFFF] size-8 mr-4" />
                )}

                <h3 className="text-2xl font-bold">
                  {isSignUp ? "Exclusive Deals" : "Secure Shopping"}
                </h3>
              </div>

              <p>
                {isSignUp
                  ? "Get access to exclusive deals and offers"
                  : "Securely shop with us without any worries"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default Auth;

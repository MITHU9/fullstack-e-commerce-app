"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Bell,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  User2,
  X,
} from "lucide-react";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";
import getUserSession from "@/actions/auth/getUserSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import logoutAction from "@/actions/auth/logout";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingText, setTypingText] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<IUserEntity | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      const text = "Search Products...";
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setTypingText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100);
    } else {
      setTypingText("");
    }
  }, [isSearchOpen, isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    router.push(`/search?q=${searchQuery}`);
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/95 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.span
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffff] to-[#00cccc]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OneStore
              </motion.span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              className="relative"
              initial={false}
              animate={isSearchOpen ? "open" : "close"}
              ref={searchRef}
            >
              <motion.form
                onSubmit={handleSubmit}
                className="flex items-center"
                variants={{
                  open: {
                    width: "350px",
                    opacity: 1,
                    pointerEvents: "auto",
                  },
                  close: {
                    width: "36px",
                  },
                }}
              >
                <Input
                  type="text"
                  placeholder={typingText}
                  value={searchQuery}
                  className="bg-gray-800 border-gray-700 text-white w-full"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  className="absolute right-0 top-0 bottom-0 bg-transparent hover:text-[#00ffff] hover:bg-transparent"
                  type="submit"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search className="size-5 to-gray-300 " />
                </Button>
              </motion.form>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/wishlist">
                <Button
                  size="icon"
                  className="bg-gray-800 hover:text-[#00ffff]"
                >
                  <Heart className="size-5 to-gray-300 " />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart">
                <Button
                  size="icon"
                  className="relative bg-gray-800 hover:text-[#00ffff]"
                >
                  <ShoppingCart className="size-5 to-gray-300 " />
                </Button>
              </Link>
            </motion.div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-8 rounded-full"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-[#00ffff]">
                        {user.formData
                          .find((item) => item.marker === "name")
                          ?.value?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-gray-900 border border-gray-800 text-gray-100"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-[#00ffff]">
                        {user.formData
                          .find((item) => item.marker === "name")
                          ?.value?.toUpperCase()}
                      </p>

                      <p className="text-xs leading-none text-gray-400">
                        {user?.identifier}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-[#00ffff]">
                    <Link href="/profile" className="flex w-full ">
                      <User className="mr-2 size-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-[#00ffff]">
                    <Bell className="mr-0 size-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-[#00ffff]">
                    <Link href="/orders" className="flex w-full ">
                      <ShoppingCart className="mr-2 size-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    className="focus:bg-gray-800 focus:text-[#00ffff]"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-0 size-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link href="/auth?type=login">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent text-[#00ffff]  border-[#00ffff] hover:bg-[#00ffff] hover:text-black"
                    >
                      Login
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link href="/auth?type=signup">
                    <Button
                      size="sm"
                      className="bg-[#00ffff] text-black  border-[#00ffff] hover:bg-[#00cccc]"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-6 text-gray-300" />
              ) : (
                <Menu className="size-6 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className=" z-40 bg-black/95 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            ref={mobileMenuRef}
          >
            <div className="px-2 pt-2 pb-2 space-y-1 sm:px-3">
              <form onSubmit={handleSubmit} className="mb-4">
                <Input
                  type="text"
                  placeholder={typingText}
                  value={searchQuery}
                  className="bg-gray-800 border-gray-700 text-white w-full"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="icon"
                  className="bg-gray-800 hover:text-[#00ffff]"
                >
                  <Heart className="size-5 to-gray-300 " />
                </Button>
              </Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="icon"
                  className="bg-gray-800 hover:text-[#00ffff] ml-2"
                >
                  <ShoppingCart className="size-5 to-gray-300 " />
                </Button>
              </Link>
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-4 px-1">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-[#00ffff]">
                        {user.formData
                          .find((item) => item.marker === "name")
                          ?.value?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium leading-none text-[#00ffff]">
                        {user.formData
                          .find((item) => item.marker === "name")
                          ?.value?.toUpperCase()}
                      </p>
                      <p className="text-xs leading-none text-gray-400">
                        {user?.identifier}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className=" px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-[#00ffff] rounded-md flex items-center"
                    >
                      <User2 className="mr-2 size-4" />
                      Your Profile
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className=" px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-[#00ffff] rounded-md flex items-center"
                    >
                      <Bell className="mr-2 size-4" />
                      Notifications
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className=" px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-[#00ffff] rounded-md flex items-center "
                    >
                      <ShoppingCart className="mr-2 size-4" />
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className=" px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-[#00ffff] rounded-md flex items-center gap-1"
                    >
                      <LogOut className="mr-0 size-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2 p-2">
                  <Link
                    href="/auth?type=login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent text-[#00ffff]  border-[#00ffff] hover:bg-[#00ffff] hover:text-black"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/auth?type=signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      className="bg-[#00ffff] text-black  border-[#00ffff] hover:bg-[#00cccc]"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default Navbar;

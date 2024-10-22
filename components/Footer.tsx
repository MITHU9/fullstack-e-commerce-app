"use client";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-gray-300 "
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <motion.span
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffff] to-[#00cccc]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              OneStore
            </motion.span>
            <p className="text-gray-400 text-base">
              OneStore is a fictional e-commerce site created for educational
              purposes.
            </p>

            <div className="flex space-x-6">
              {["Facebook", "Twitter", "Instagram", "Github", "LinkedIn"].map(
                (social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="text-gray-300 hover:text-[#00ffff]"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <span className="sr-only">{social}</span>
                    <i className={`fab fa-${social.toLowerCase()}`}></i>
                  </motion.a>
                )
              )}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-md font-bold text-gray-300 tracking-wider uppercase">
                  Solutions
                </h3>
                <ul className="mt-4 space-y-4">
                  {["Marketing", "Analytics", "Commerce", "Insights"].map(
                    (item) => (
                      <motion.li key={item} whileHover={{ x: 2 }}>
                        <a
                          href="#"
                          className="text-base text-gray-400 hover:text-[#00ffff]"
                        >
                          {item}
                        </a>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-md font-bold text-gray-300 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {["Pricing", "Documentation", "Guides", "API Status"].map(
                    (item) => (
                      <motion.li key={item} whileHover={{ x: 2 }}>
                        <a
                          href="#"
                          className="text-base text-gray-400 hover:text-[#00ffff]"
                        >
                          {item}
                        </a>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-md font-bold text-gray-300 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {["About", "Blog", "Jobs", "Press"].map((item) => (
                    <motion.li key={item} whileHover={{ x: 2 }}>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-[#00ffff]"
                      >
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-md font-bold text-gray-300 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  {["Claim", "Privacy", "Terms"].map((item) => (
                    <motion.li key={item} whileHover={{ x: 2 }}>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-[#00ffff]"
                      >
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className=" text-base xl:text-center text-gray-400">
            © 2021 OneStore. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
export default Footer;

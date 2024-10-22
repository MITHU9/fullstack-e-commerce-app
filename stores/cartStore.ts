import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

//Define the Zustand state Interface

interface CartState {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

//Create the Zustand store

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (newProduct: CartItem) => {
        const existItem = get().cart.find((item) => item.id === newProduct.id);
        if (existItem) {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === newProduct.id
                ? { ...item, quantity: item.quantity + newProduct.quantity }
                : item
            ),
          }));
        } else {
          set((state) => ({
            cart: [...state.cart, newProduct],
          }));
        }
      },
      updateQuantity: (id: number, quantity: number) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        })),

      removeFromCart: (id: number) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;

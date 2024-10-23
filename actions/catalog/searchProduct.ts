"use server";

import { getApiClient } from "@/lib/oneentry";

export const searchProductAction = async (searchText: string) => {
  try {
    const apiClient = await getApiClient();
    const products = await apiClient?.Products.searchProduct(
      searchText,
      "en_US"
    );
    return products || [];
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Error searching products");
  }
};

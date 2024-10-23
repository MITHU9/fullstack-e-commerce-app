"use server";

import { getApiClient } from "@/lib/oneentry";

export const getProductDetails = async (productId: number) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const apiClient = await getApiClient();
    const product = await apiClient?.Products.getProductById(
      productId,
      "en_US"
    );
    return product;
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Error fetching product details");
  }
};

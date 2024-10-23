"use server";

import { getApiClient } from "@/lib/oneentry";

export const getRelatedProducts = async (pageId: number, productId: number) => {
  if (!pageId) {
    throw new Error("PageId is required");
  }

  try {
    const apiClient = await getApiClient();
    const products = await apiClient?.Products.getProductsByPageId(
      pageId,
      undefined,
      "en_US",
      { limit: 5 }
    );
    const relatedProducts = [];
    for (let i = 0; i < products?.total; i++) {
      if (products?.items[i].id !== productId) {
        relatedProducts.push(products?.items[i]);
      }
    }
    return relatedProducts;
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Error fetching related products");
  }
};

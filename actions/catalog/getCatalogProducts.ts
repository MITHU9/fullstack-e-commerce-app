"use server";

import { getApiClient } from "@/lib/oneentry";
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces";
import { getCatalog as fetchCatalog } from "./getCatalog";

export const getCatalogProducts = async () => {
  const apiClient = await getApiClient();
  const catalogs: IPagesEntity[] = await fetchCatalog();
  const catalogWithProducts = [];

  if (catalogs) {
    for (const catalog of catalogs) {
      const products = await apiClient?.Products.getProductsByPageId(
        catalog.id,
        undefined,
        "en_US",
        { limit: 4 }
      );
      catalogWithProducts.push({ ...catalog, catalogProducts: products });
    }
    return catalogWithProducts;
  }
};

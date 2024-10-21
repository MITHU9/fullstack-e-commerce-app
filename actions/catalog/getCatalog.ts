"use server";

import { getApiClient } from "@/lib/oneentry";
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces";

export const getCatalog = async (): Promise<IPagesEntity[]> => {
  try {
    const apiClient = await getApiClient();
    if (apiClient) {
      const pages = await apiClient.Pages.getRootPages("en_US");
      //console.log(pages);
      const catalogPages = pages.filter(
        (page: IPagesEntity) => page.type === "forCatalogPages"
      );

      return catalogPages.length > 0 ? catalogPages : [];
    } else {
      throw new Error("API client is null");
    }
  } catch (error) {
    console.error("Failed to fetch catalog", error);
    return [];
  }
};

import retrieveRefreshToken from "@/actions/auth/retrieveRefreshToken";
import storeRefreshToken from "@/actions/auth/storeRefreshToken";
import { defineOneEntry } from "oneentry";

export type ApiClientType = ReturnType<typeof defineOneEntry> | null;

let apiClient: ApiClientType = null;

async function setupApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
  const apiUrl = process.env.ONEENTRY_PROJECT_URL;

  if (!apiUrl) {
    throw new Error("ONEENTRY_PROJECT_URL is not set");
  }

  if (!apiClient) {
    try {
      const refreshToken = await retrieveRefreshToken();
      apiClient = defineOneEntry(apiUrl, {
        token: process.env.ONEENTRY_TOKEN,
        langCode: "en_US",
        auth: {
          refreshToken: refreshToken || undefined,
          customAuth: false,
          saveFunction: async (newToken: string) => {
            await storeRefreshToken(newToken);
          },
        },
      });
    } catch (error) {
      console.error("Error setting up api client", error);
    }
  }

  if (!apiClient) {
    throw new Error("Error setting up or initialize api client");
  }

  return apiClient;
}

export async function getApiClient(): Promise<ApiClientType> {
  if (!apiClient) {
    apiClient = await setupApiClient();
  }
  if (!apiClient) {
    throw new Error("Error setting up or initialize api client");
  }

  return apiClient;
}

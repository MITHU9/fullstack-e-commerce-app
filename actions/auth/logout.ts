"use server";

import { getApiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";

interface IErrorResponse {
  message: string;
  statusCode: number;
  timeStamp: string;
  pageData: string;
}

export default async function logoutAction() {
  const cookiesStore = cookies();
  const refreshToken = cookiesStore.get("refresh_token")?.value;
  const accessToken = cookiesStore.get("access_token")?.value;
  const apiClient = await getApiClient();

  if (!refreshToken || !accessToken) {
    return {
      message: "Currently You are not logged in.",
    };
  }

  try {
    const response = await apiClient?.AuthProvider.setAccessToken(
      accessToken
    ).logout("email", refreshToken);

    if (typeof response !== "boolean") {
      const errorResponse = response as unknown as IErrorResponse;
      return {
        message: errorResponse.message,
        statusCode: errorResponse.statusCode,
        timeStamp: errorResponse.timeStamp,
        pageData: errorResponse.pageData,
      };
    }

    cookiesStore.delete("access_token");
    cookiesStore.delete("refresh_token");

    cookiesStore.set("access_token", "", { maxAge: 0 });
    cookiesStore.set("refresh_token", "", { maxAge: 0 });

    return {
      message: "User logged out successfully",
    };
  } catch (error) {
    console.error("Failed to logout user", error);
    throw new Error("Failed to logout user");
  }
}

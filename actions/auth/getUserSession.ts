"use server";

import { getApiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";

interface IErrorResponse {
  message: string;
  statusCode: number;
}

export default async function getUserSession() {
  const apiClient = await getApiClient();
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const user = await apiClient?.Users.setAccessToken(accessToken).getUser();

    if (!user || !user.id) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error as unknown as IErrorResponse).statusCode === 401
    ) {
      return undefined;
    }
    console.error("Failed to retrieve user", error);
  }
}

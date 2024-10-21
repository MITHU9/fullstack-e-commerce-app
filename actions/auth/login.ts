/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getApiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IAttributes } from "oneentry/dist/base/utils";

export const getLoginFormData = async (): Promise<IAttributes[]> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient?.Forms.getFormByMarker("sign-in");
    return response?.attributes as unknown as IAttributes[];
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Error getting signup form data");
  }
};

export const handleLoginSubmit = async (inputValues: {
  email: string;
  password: string;
}) => {
  try {
    const apiClient = await getApiClient();
    const data = {
      authData: [
        {
          marker: "email",
          value: inputValues.email,
        },
        {
          marker: "password",
          value: inputValues.password,
        },
      ],
    };

    const response = await apiClient?.AuthProvider.auth("email", data);

    if (!response?.userIdentifier) {
      throw new Error("Invalid login credentials");
    }
    cookies().set("access_token", response.accessToken, {
      maxAge: 60 * 60 * 24,
    });

    cookies().set("refresh_token", response.refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error: any) {
    console.error(error);
    if (error?.statusCode === 401) {
      return { message: error?.message };
    }
    throw new Error("Error signing up");
  }
  redirect("/");
};

"use server";

import { getApiClient } from "@/lib/oneentry";
import { IAttributes } from "oneentry/dist/base/utils";

export const getSignupFormData = async (): Promise<IAttributes[]> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient?.Forms.getFormByMarker("sign-up");
    return response?.attributes as unknown as IAttributes[];
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Error getting signup form data");
  }
};

export const handleSignupSubmit = async (inputValues: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const apiClient = await getApiClient();
    const data = {
      formIdentifier: "sign-up",
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
      formData: [
        {
          marker: "name",
          type: "string",
          value: inputValues.name,
        },
      ],
      notificationData: {
        email: inputValues.email,
        phonePush: ["+1234567890"],
        phoneSMS: "+1234567890",
      },
    };

    const response = await apiClient?.AuthProvider.signUp("email", data);
    return response;
  } catch (error: unknown) {
    console.error(error);
    if ((error as { status?: number })?.status === 400) {
      return { message: (error as Error)?.message };
    }
    throw new Error("Error signing up");
  }
};

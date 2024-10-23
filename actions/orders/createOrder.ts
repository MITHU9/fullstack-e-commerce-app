"use server";

import { getApiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";
import { IOrderData } from "oneentry/dist/orders/ordersInterfaces";

const createOrder = async (orderData: IOrderData): Promise<string> => {
  const apiClient = await getApiClient();

  if (!apiClient) {
    throw new Error("API client is null");
  }

  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const order = await apiClient.Orders.setAccessToken(
      accessToken
    ).createOrder("orders", orderData);

    if (!order?.id) {
      throw new Error("Order Not Created!");
    }

    const paymentSession = await apiClient.Payments.setAccessToken(
      accessToken
    ).createSession(order?.id, "session");

    if (!paymentSession?.paymentUrl) {
      throw new Error("Payment session url not created");
    } else {
      return paymentSession?.paymentUrl;
    }
  } catch (error: unknown) {
    console.error("Failed to create order", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create order: ${error.message}`);
    } else {
      throw new Error("Failed to create order: Unknown error");
    }
  }
};

export default createOrder;

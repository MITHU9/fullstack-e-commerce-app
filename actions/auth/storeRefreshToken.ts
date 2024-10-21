"use server";

import { cookies } from "next/headers";

export default async function storeRefreshToken(refreshToken: string) {
  return cookies().set("refreshToken", refreshToken);
}

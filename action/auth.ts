// app/actions/auth.ts
"use server";

import { signIn } from "next-auth/react";

export async function handleSignIn(formData: FormData) {
  return await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

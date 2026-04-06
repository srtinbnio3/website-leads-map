import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { GetStarted } from "@/app/(splash)/GetStarted/GetStarted";
import { redirect } from "next/navigation";

export default async function HomePage() {
  if (await isAuthenticatedNextjs()) {
    redirect("/product");
  }

  return <GetStarted />;
}

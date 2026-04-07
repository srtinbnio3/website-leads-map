import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ReactNode } from "react";

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <div className="h-screen flex flex-col overflow-hidden">{children}</div>
    </ConvexClientProvider>
  );
}

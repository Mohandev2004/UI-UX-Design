"use client";

import { PropsWithChildren, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function Provider({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      axios.post("/api/user").catch(console.error);
    }
  }, [isLoaded, isSignedIn]);

  return <>{children}</>;
}

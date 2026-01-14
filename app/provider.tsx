"use client";

import { PropsWithChildren, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function Provider({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      axios
        .post("/api/user", {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        })
        .catch(console.error);
    }
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
}

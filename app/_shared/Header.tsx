import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button"; 

function Header() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex gap-2 items-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
        />
        <h2 className="text-xl font-semibold"><span className="text-primary">UIUX</span> MOCK</h2>
      </div>

      <ul className="flex gap-5 items-center text-lg">
        <li className="hover:text-primary cursor-pointer">Home</li>
        <li className="hover:text-primary cursor-pointer">Pricing</li>
      </ul>
      <Button>Get Started</Button>
    </div>
  );
}

export default Header;

"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

function Header() {
  const { user } = useUser()

  return (
    <header className="flex items-center border-b border-border px-6 py-4 ">
      <div className="flex items-center gap-2 flex-1">
        <Image
          src="/Logo.png"
          alt="logo"
          width={35}
          height={35}
          className="rounded-full"
        />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UIUX</span> Design
        </h2>
      </div>

      <ul className="flex gap-6 items-center text-lg">
        <li className="hover:text-primary cursor-pointer">Home</li>
        <li className="hover:text-primary cursor-pointer">Pricing</li>
      </ul>

      <div className="flex-1 flex justify-end">
        {!user ? (
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        ) : (
          <UserButton />
        )}
      </div>
    </header>
  )
}

export default Header

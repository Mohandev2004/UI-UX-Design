"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

function Header() {
  const { user } = useUser()

  return (
    // 'absolute' and 'z-50' ensure it floats over the ripple background
    <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-transparent z-50">
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

      {/* Responsive Navigation: Hidden on mobile, flex on medium screens+ */}
      <ul className="hidden md:flex gap-8 items-center text-sm font-medium">
        <li className="hover:text-primary transition-colors cursor-pointer">Home</li>
        <li className="hover:text-primary transition-colors cursor-pointer">Pricing</li>
      </ul>

      <div className="flex-1 flex justify-end">
        {!user ? (
          <SignInButton mode="modal">
            {/* Added 'ghost' variant for a cleaner transparent look */}
            <Button variant="ghost" className="hover:bg-primary/10 cursor-pointer">
              Get Started
            </Button>
          </SignInButton>
        ) : (
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9"
              }
            }}
          />
        )}
      </div>
    </header>
  )
}

export default Header
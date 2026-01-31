import type { Metadata } from "next";
import {DM_Sans } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import Provider from "./provider";

const appFont = DM_Sans({
  subsets:['latin']
})


export const metadata: Metadata = {
  title: "UIUX Design",
  description: "Generate Hign quality free UIUX Mobile and Web Mokcup designs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ClerkProvider>
    <html lang="en" className="dark">
      <body
      className={appFont.className}
      ><Provider>
        {children}
      </Provider>
      </body>
    </html>
    </ClerkProvider>
  );
}

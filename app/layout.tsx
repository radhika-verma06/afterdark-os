import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"AfterDark OS | Campus lighting intelligence",description:"Better-lit paths. Smarter repairs. Safer campuses."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}

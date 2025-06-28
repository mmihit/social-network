import { NavBar } from "@/app/components/global/navBar.js";

export default function RootLayout({ children }) {
  console.log("tttttttttest");
  return (
    <html>
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}

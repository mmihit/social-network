import { AuthProvider } from "./components/global/authProvider";
import "./styles/globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

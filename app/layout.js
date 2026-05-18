import { SessionProvider } from "./components/SessionProvider";

export const metadata = {
  title: "ClearPath AI — Email Assistant for Real Estate",
  description: "Never miss a hot lead. AI scans your inbox and tells you exactly who is ready to buy or sell.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

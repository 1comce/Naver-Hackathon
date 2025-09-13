import type { Metadata } from "next";
import "../styles/global.css"
export const metadata: Metadata = {
  title: "Todo App",
  description: "This is a Todo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div id='root'>{children}</div>
      </body>
    </html>
  );
}

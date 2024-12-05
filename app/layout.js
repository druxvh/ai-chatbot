import "./globals.css";
import Footer from "./components/footer";

export const metadata = {
  title: "AI Chatbot",
  description: "AI based chatbot using Google's Gemini LLM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}

import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#f0fdf4",
            color: "#14532d",
            border: "1px solid #bbf7d0",
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

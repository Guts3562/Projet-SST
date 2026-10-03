import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./lib/AuthContext";
import App from "./App.jsx";

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || savedTheme === "light") {
  document.documentElement.classList.add(`${savedTheme}-mode`);
}
document.documentElement.lang = localStorage.getItem("sst_language") === "en" ? "en" : "fr";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);

import { useSyncExternalStore } from "react";

const LANGUAGE_KEY = "sst_language";
const LANGUAGE_EVENT = "sst:language-change";

export function getLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "fr";
}

export function setLanguage(language) {
  const nextLanguage = language === "en" ? "en" : "fr";
  localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  document.documentElement.lang = nextLanguage;
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
}

export function useLanguage() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener(LANGUAGE_EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(LANGUAGE_EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    getLanguage,
    () => "fr",
  );
}

export function localized(language, french, english) {
  return language === "en" ? english : french;
}

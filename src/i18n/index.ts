import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import es from "./locales/es";
import pt from "./locales/pt";
import zh from "./locales/zh";

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt", // idioma padrão
  fallbackLng: "pt",
  compatibilityJSON: "v3",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

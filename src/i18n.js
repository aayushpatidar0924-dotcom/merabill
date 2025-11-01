import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "Mera Bill": "Mera Bill",
        Home: "Home",
        About: "About",
        Contact: "Contact",
        Login: "Login",
        "Sign Up": "Sign Up",
      },
    },
    hi: {
      translation: {
        "Mera Bill": "मेरा बिल",
        Home: "मुख्य पृष्ठ",
        About: "हमारे बारे में",
        Contact: "संपर्क करें",
        Login: "लॉगिन",
        "Sign Up": "साइन अप",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

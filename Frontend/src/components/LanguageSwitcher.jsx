// LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext.jsx"; // Twój kontekst

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === "en" ? "pt" : "en";

    // 1. Zmień globalny język kontekstu (dla JSON)
    setLanguage(newLang);

    // 2. Zmień język i18n (dla UI)
    i18n.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage} style={{ marginLeft: "10px" }}>
      {language === "en" ? "PT" : "EN"}
    </button>
  );
};

export default LanguageSwitcher;

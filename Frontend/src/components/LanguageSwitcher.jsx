// LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage} style={{ marginLeft: "10px" }}>
      {i18n.language === "en" ? "PT" : "EN"}
    </button>
  );
};

export default LanguageSwitcher;

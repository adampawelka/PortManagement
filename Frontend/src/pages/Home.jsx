import React from "react";
import { useTranslation } from "react-i18next";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("home")}</h1>
      <p>This is the home page.</p>
      <LogoutButton />
    </div>
  );
};

export default Home;

import { useTranslation } from "react-i18next";
import "../styles/Footer.css"; 

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p className="footer-text">&copy; 2025 Port Management System</p>
      <p className="footer-text">
        <a href="/privacy" className="footer-link">{t("privacy_policy")}</a> |{" "}
        <a href="/terms" className="footer-link">{t("terms_of_service")}</a>
      </p>
    </footer>
  );
};

export default Footer;
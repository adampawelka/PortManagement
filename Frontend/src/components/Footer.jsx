import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/Footer.css"; 

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p className="footer-text">&copy; 2025 Port Management System</p>
      <p className="footer-text">
        <Link to="/privacy-policy" className="footer-link">
          {t("privacy_policy")}
        </Link>
        {" | "}  
        <Link to="/terms-and-conditions" className="footer-link">
          {t("terms_and_conditions")}
        </Link>
      </p>
    </footer>
  );
};

export default Footer;

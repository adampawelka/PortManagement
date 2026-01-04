import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 
import "../styles/PrivacyPolicy.css";
import { useLanguage } from "../context/LanguageContext"; 

const CookiePolicy = () => {
  const { language } = useLanguage(); 
  const [cookiePolicy, setCookiePolicy] = useState(null);

  useEffect(() => {
    fetch("/cookiePolicy/json/1.0.json")
      .then((res) => res.json())
      .then((data) =>
        setCookiePolicy({
          ...data.sections[language], 
          version: data.version,
          effectiveDate: data.effectiveDate,
        })
      )
      .catch((err) => console.error("Failed to load cookie policy:", err));
  }, [language]); 

  if (!cookiePolicy) return <p>Loading...</p>;

  const sectionOrder = [
    "introduction",
    "usage",
    "types",
    "thirdParty",
    "lifespan",
    "managingPreferences",
    "dnt",
    "mobile",
    "disabling",
    "updates",
    "dataProtection",
    "contact",
    "legalBasis",
    "childrenPrivacy",
    "international"
  ];

  const renderCategory = (cat, idx) => (
    <div key={idx} className="privacy__category">
      {cat.category && <h3>{cat.category}</h3>}
      {cat.content && (
        <div className="privacy__markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cat.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );

  const renderSection = (section) => (
    <section key={section.title} className="privacy__section">
      <h2 className="privacy__heading">{section.title}</h2>

      {section.content && (
        <div className="privacy__markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {section.content}
          </ReactMarkdown>
        </div>
      )}

      {section.categories &&
        section.categories.map((cat, idx) => renderCategory(cat, idx))}
    </section>
  );

  return (
    <main className="privacy-policy">
      <div className="privacy__container">

        <h1 className="privacy__title">{cookiePolicy.title}</h1>

        {sectionOrder.map(
          (key) => cookiePolicy[key] && renderSection(cookiePolicy[key])
        )}

        <div className="privacy__footer">
          Last updated: {cookiePolicy.effectiveDate} | Version: {cookiePolicy.version}
        </div>
      </div>
    </main>
  );
};

export default CookiePolicy;

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // <- do obsługi tabel
import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = ({ language = "en" }) => {
  const [privacyPolicy, setPrivacyPolicy] = useState(null);

  useEffect(() => {
    fetch("/privacyPolicy/json/1.0.json")
      .then((res) => res.json())
      .then((data) =>
        setPrivacyPolicy({
          ...data.sections[language],
          version: data.version,
          effectiveDate: data.effectiveDate,
        })
      )
      .catch((err) => console.error("Failed to load privacy policy:", err));
  }, [language]);

  if (!privacyPolicy) return <p>Loading...</p>;

  const renderCategory = (cat, idx) => (
    <div key={idx} className="privacy__category">
      <p><strong>{cat.category || cat.dataType || cat.recipient}</strong></p>
      {cat.data && (
        <ul className="privacy__list">{cat.data.map((d, i) => <li key={i}>{d}</li>)}</ul>
      )}
      {cat.purposes && (
        <ul className="privacy__list">{cat.purposes.map((p, i) => <li key={i}>{p}</li>)}</ul>
      )}
    </div>
  );

  const renderSection = (section, idx) => (
    <section key={`${section.title}-${idx}`} className="privacy__section">
      <h2 className="privacy__heading">{section.title}</h2>

      {/* Render Markdown, w tym tabele */}
      {section.content && (
        <div className="privacy__markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {section.content}
          </ReactMarkdown>
        </div>
      )}

      {/* Listy i kategorie */}
      {section.methods && (
        <ul className="privacy__list">{section.methods.map((m, i) => <li key={i}>{m}</li>)}</ul>
      )}

      {section.categories && section.categories.map(renderCategory)}

      {section.recipients && section.recipients.map((rec, i) => (
        <div key={i} className="privacy__category">
          <p><strong>{rec.recipient}</strong>: {rec.purpose}</p>
        </div>
      ))}

      {section.rights && (
        <ul className="privacy__list">{section.rights.map((r, i) => <li key={i}>{r}</li>)}</ul>
      )}
      {section.measures && (
        <ul className="privacy__list">{section.measures.map((m, i) => <li key={i}>{m}</li>)}</ul>
      )}
    </section>
  );

  const sections = Object.entries(privacyPolicy)
    .filter(([key]) => !["title", "version", "effectiveDate"].includes(key))
    .map(([_, sec]) => sec);

  return (
    <main className="privacy-policy">
      <div className="privacy__container">

        {/* Header w tym samym stylu co footer */}
        <div className="privacy__footer">
          Effective Date: {privacyPolicy.effectiveDate} | Version: {privacyPolicy.version}
        </div>

        <h1 className="privacy__title">{privacyPolicy.title}</h1>

        {sections.map(renderSection)}

        {/* Footer */}
        <div className="privacy__footer">
          Last updated: {privacyPolicy.effectiveDate} | Version: {privacyPolicy.version}
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;

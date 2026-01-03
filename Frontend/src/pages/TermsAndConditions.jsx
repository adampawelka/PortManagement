import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/PrivacyPolicy.css";

const TermsAndConditions = ({ language = "en" }) => {
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    fetch("/termsAndConditions/json/1.0.json")
      .then((res) => res.json())
      .then((data) =>
        setTerms({
          ...data.sections[language],
          version: data.version,
          effectiveDate: data.effectiveDate,
        })
      )
      .catch((err) => console.error("Failed to load terms:", err));
  }, [language]);

  if (!terms) return <p>Loading...</p>;

  const renderList = (items) =>
    items.map((item, idx) => {
      if (typeof item === "string") return <li key={idx}>{item}</li>;

      if (item.data) {
        return (
          <div key={idx} className="privacy__category">
            <p><strong>{item.category || item.recipient || item.dataType}</strong></p>
            <ul className="privacy__list">
              {Array.isArray(item.data)
                ? item.data.map((d, i) => <li key={i}>{d}</li>)
                : <li>{item.data}</li>}
            </ul>
          </div>
        );
      }

      if (item.purposes) {
        return (
          <div key={idx} className="privacy__category">
            <p><strong>{item.category}</strong></p>
            <ul className="privacy__list">
              {item.purposes.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        );
      }

      if (item.table) {
        return (
          <div key={idx} className="privacy__table">
            <ul className="privacy__list">
              {item.table.map((row, i) => (
                <li key={i}>
                  {row.category || row.dataType}: {row.period || row.legalBasis || row.description || row.justification}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      return null;
    });

  const renderSection = (section, idx) => (
    <section key={`${section.title}-${idx}`} className="privacy__section">
      <h2 className="privacy__heading">{section.title}</h2>
      {section.content && <div className="privacy__markdown"><ReactMarkdown>{section.content}</ReactMarkdown></div>}
      {section.methods && <ul className="privacy__list">{renderList(section.methods)}</ul>}
      {section.categories && renderList(section.categories)}
      {section.table && renderList([{ table: section.table }])}
      {section.recipients && renderList(section.recipients)}
      {section.rights && <ul className="privacy__list">{renderList(section.rights)}</ul>}
      {section.measures && <ul className="privacy__list">{renderList(section.measures)}</ul>}
    </section>
  );

  const sections = Object.entries(terms)
    .filter(([key, sec]) => !["title", "version", "effectiveDate"].includes(key) && typeof sec === "object")
    .map(([_, sec]) => sec);

  return (
    <main className="privacy">
      <div className="privacy__container">

        <div className="privacy__footer">
          Effective Date: {terms.effectiveDate} | Version: {terms.version}
        </div>

        <h1 className="privacy__title">{terms.title}</h1>

        {sections.map(renderSection)}

        <div className="privacy__footer">
          Last updated: {terms.effectiveDate} | Version: {terms.version}
        </div>
      </div>
    </main>
  );
};

export default TermsAndConditions;

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/privacyPolicy/1.0.md")
      .then(res => res.text())
      .then(setContent)
      .catch(err => console.error("Failed to load markdown:", err));
  }, []);

  return (
    <div className="privacy-policy">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default PrivacyPolicy;

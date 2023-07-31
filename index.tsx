import React, { useState } from "react";

const URLExtractor = () => {
  const [inputURL, setInputURL] = useState("");
  const [queryParameters, setQueryParameters] = useState({});

  const handleInputChange = (event) => {
    setInputURL(event.target.value);
  };

  const extractQueryParameters = () => {
    try {
      const url = new URL(inputURL);
      const params = new URLSearchParams(url.search);
      const extractedParameters = {};

      for (const [key, value] of params.entries()) {
        extractedParameters[key] = value;
      }

      setQueryParameters(extractedParameters);
    } catch (error) {
      console.error("Invalid URL:", error);
    }
  };

  return (
    <div>
      <label>
        Enter URL:
        <input type="text" value={inputURL} onChange={handleInputChange} />
      </label>
      <button onClick={extractQueryParameters}>Extract Query Parameters</button>

      <h3>Extracted Query Parameters:</h3>
      <pre>
        {Object.keys(queryParameters).map((key) => (
          <div key={key}>
            {key}: {queryParameters[key]}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default URLExtractor;

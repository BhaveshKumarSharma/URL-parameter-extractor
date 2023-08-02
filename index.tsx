"use client";
import { Icons } from "@/components/Icons";
import React, { useState } from "react";

export const URLExtractor = () => {
  const [inputURL, setInputURL] = useState("");
  const [queryParameters, setQueryParameters] = useState({});
  const [editableParameters, setEditableParameters] = useState<
    Record<string, string>
  >({});
  const [generatedURL, setGeneratedURL] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(event.target.value);
  };

  const extractQueryParameters = () => {
    try {
      const url = new URL(inputURL);
      const params = new URLSearchParams(url.search);
      const extractedParameters: Record<string, string> = {};
      const entries = params.entries();
      Array.from(entries).map((entry) => {
        const [key, value] = entry;
        extractedParameters[key] = value;
      });

      setQueryParameters(extractedParameters);
      setEditableParameters({ ...extractedParameters });
    } catch (error) {
      console.error("Invalid URL:", error);
    }
  };

  const handleEditableInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditableParameters({
      ...editableParameters,
      [key]: event.target.value,
    });
  };

  const generateNewURL = () => {
    const url = new URL(inputURL);
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(editableParameters)) {
      params.set(key, value);
    }

    url.search = params.toString();
    setGeneratedURL(url.toString());
    setInputURL(url.toString());
    setQueryParameters(editableParameters);
    setIsCopied(false);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(generatedURL).then(() => {
      setIsCopied(true);
    });
  };

  return (
    <div className="mt-3">
      <h3>URL Param Extractor</h3>
      <label className="block mb-4">
        Enter URL:
        <input
          type="text"
          value={inputURL}
          onChange={handleInputChange}
          className="w-full border rounded-md p-2 my-1 "
        />
      </label>
      <button
        onClick={extractQueryParameters}
        className="rounded-lg border-0 bg-foreground text-background  p-3"
      >
        Extract Query Parameters
      </button>

      <h3 className="text-lg font-semibold mt-8">Extracted Parameters:</h3>
      <div className="mt-4">
        {Object.keys(queryParameters).map((key) => (
          <div key={key} className="mb-2 grid">
            <span className="block">{key}:</span>{" "}
            <input
              type="text"
              value={editableParameters[key] || ""}
              onChange={(event) => handleEditableInputChange(event, key)}
              className="border rounded-md p-2 my-1"
            />
          </div>
        ))}

        {inputURL && (
          <div>
            <button
              onClick={generateNewURL}
              className="rounded-lg border-0 bg-foreground text-background  p-3"
            >
              Generate New URL
            </button>
            {generatedURL && (
              <div className="mt-4">
                <div className="mb-3 flex items-center">
                  <input
                    type="text"
                    className="form-input border rounded-md p-2 my-1 w-3/4"
                    readOnly
                    value={generatedURL}
                  ></input>
                  <Icons.copy
                    onClick={handleCopyClick}
                    className="input-group-text ms-3"
                  />
                  <span className="text-sm m-1">
                    {isCopied ? "Copied!" : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

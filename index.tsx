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
      <div className="form-control">
        <label className="block mb-4">
          Enter your URL here:
          <input
            type="text"
            value={inputURL}
            onChange={handleInputChange}
            // className="w-full border rounded-md p-2 my-1 "
            required
          />
        </label>
      </div>
      <button
        onClick={extractQueryParameters}
        className="button-primary button-sm"
      >
        Extract Query Parameters
      </button>

      <h3 className="text-lg font-semibold mt-8">Extracted Parameters:</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-3">
        {Object.keys(queryParameters).map((key) => (
          // <div key={key} className="mb-2 grid">
          <div className="form-control" key={key}>
            <label>{key}:</label>
            <input
              type="text"
              value={editableParameters[key] || ""}
              onChange={(event) => handleEditableInputChange(event, key)}
            />
          </div>
          // </div>
        ))}

        {inputURL && (
          <div>
            <button
              onClick={generateNewURL}
              className="button-primary button-sm"
            >
              Generate New URL
            </button>
            {generatedURL && (
              <div className="mt-4">
                <div className="mb-3 flex items-center">
                  <div className="form-control w-full">
                    <input type="text" readOnly value={generatedURL}></input>
                  </div>
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

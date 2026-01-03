// components/FileUploadSection.tsx
'use client'
import { ChangeEvent } from "react";
import { validateFile } from "@/utils/fileUpload";

interface FileUploadSectionProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function FileUploadSection({
  selectedFile,
  onFileChange,
  errorMessage,
  setErrorMessage,
  onSubmit,
  isLoading
}: FileUploadSectionProps) {
  
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      onFileChange(null);
      return;
    }
    
    const file = files[0];
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setErrorMessage(validation.error!);
      onFileChange(null);
      return;
    }
    
    setErrorMessage(null);
    onFileChange(file);
  }

  return (
    <div className="card card-border shadow-lg bg-base-200 py-8">
      <div className="card-body lg:flex lg:items-center lg:justify-center gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend w-full">
            Upload PDF, Text, or Markdown Document
          </legend>
          <input
            type="file"
            className="file-input file-input-ghost file-input-lg"
            onChange={handleFileChange}
            accept=".pdf, .txt, .md"
            id="fileInput"
          />
          <label className="label" htmlFor="fileInput">
            Max size 2MB
          </label>
          {errorMessage && (
            <label htmlFor="fileInput" className="text-error text-start">
              {errorMessage}
            </label>
          )}
        </fieldset>
        <div className="card-actions justify-start">
          <button
            onClick={onSubmit}
            className="btn btn-primary btn-lg mt-2"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner me-1"></span>
                <span>Summarizing Document</span>
              </>
            ) : (
              <span>Summarize Document</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
// components/SummaryOptions.tsx
'use client'

interface SummaryOptionsProps {
  summaryLength: 'short' | 'medium' | 'long';
  onLengthChange: (length: 'short' | 'medium' | 'long') => void;
  customPrompt: string;
  onPromptChange: (prompt: string) => void;
}

export default function SummaryOptions({
  summaryLength,
  onLengthChange,
  customPrompt,
  onPromptChange
}: SummaryOptionsProps) {

  return (
    <div className="card card-border shadow-lg bg-base-200 mt-4">
      <div className="card-body">
        <h3 className="card-title text-lg">Summary Options</h3>
        
        <div className="form-control flex flex-col items-start justify-center mb-4">
          <label className="label">
            <span className="label-text">Summary Length</span>
          </label>
          <select
            className="select select-bordered"
            value={summaryLength}
            onChange={(e) => onLengthChange(e.target.value as 'short' | 'medium' | 'long')}
            title="Select Length"
          >
            <option value="short">Short (2-3 paragraphs)</option>
            <option value="medium">Medium (4-6 paragraphs)</option>
            <option value="long">Detailed (8+ paragraphs)</option>
          </select>
        </div>

        <div className="form-control flex flex-col items-start justify-center mb-4">
          <label className="label">
            <span className="label-text">Additional Instructions (optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="E.g., Focus on methodology, Explain like I'm 5, Include key statistics..."
            value={customPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
'use client'
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import FileUploadSection from "@/components/FileUploadSection";
import SummaryCard from "@/components/SummaryCard";
import SummaryOptions from "@/components/SummaryOptions";
import { playWithBrowserTTS, stopBrowserTTS } from "@/utils/browser-tts";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textSummary, setTextSummary] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  const [useBrowserTTS, setUseBrowserTTS] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const summarizeDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("summaryLength", summaryLength);
      formData.append("customPrompt", customPrompt);

      const response = await axios.post("/api/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setTextSummary(data.message);
      generateAudioMutation.mutate(data.message);
    },
    onError: (error) => {
      //console.error("Error summarizing document:", error);
      setErrorMessage("Failed to summarize document. Please try again.");
    }
  });

  const generateAudioMutation = useMutation({
    mutationFn: async (text: string) => {
      //return { type: 'browser', url: null };
      try {
        const response = await axios.post("/api/tts",
          { text },
          { responseType: 'blob', timeout: 1000000 }
        );
        return { type: 'elevenlabs', url: URL.createObjectURL(response.data) };
      } catch (error) {
        //console.warn("ElevenLabs failed, falling back to browser TTS", error);
        return { type: 'browser', url: null };
      }
    },
    onSuccess: (data) => {
      if (data.type === 'elevenlabs') {
        setAudioSrc(data.url);
        setUseBrowserTTS(false);
      } else {
        setUseBrowserTTS(true);
        setAudioSrc(null);
      }
    },
    onError: (error) => {
      //console.error("Error generating audio:", error);
    }
  });

  function handleSubmit() {
    if (selectedFile) {
      setTextSummary(null);
      setAudioSrc(null);
      summarizeDocumentMutation.mutate(selectedFile);
    }
  }
  function togglePlayPause() {
    if (useBrowserTTS && textSummary) {
      if (isPlaying) {
        stopBrowserTTS();
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        playWithBrowserTTS(textSummary)
          .then(() => setIsPlaying(false))
          .catch((err) => {
            //console.error('Browser TTS error:', err);
            setIsPlaying(false);
          });
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }

  return (
    <div className="min-h-screen bg-base-300 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center my-8">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-primary via-secondary to-accent text-transparent bg-clip-text">
            Clear Explanations. Spoken Aloud
          </h1>
          <p className="text-lg text-base-content/75 max-w-2xl mx-auto">
            Upload a document, and get a plain-language summary with an audio reading.
            Designed for clarity and accessibility.
          </p>
        </div>

        <FileUploadSection
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          onSubmit={handleSubmit}
          isLoading={summarizeDocumentMutation.isPending}
        />


        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>


        {showOptions && (
          <SummaryOptions
            summaryLength={summaryLength}
            onLengthChange={setSummaryLength}
            customPrompt={customPrompt}
            onPromptChange={setCustomPrompt}
          />
        )}


        {textSummary && selectedFile && (
          <SummaryCard
            summary={textSummary}
            fileName={selectedFile.name}
            audioSrc={audioSrc}
            isPlaying={isPlaying}
            isGeneratingAudio={generateAudioMutation.isPending}
            onTogglePlay={togglePlayPause}
            useBrowserTTS={useBrowserTTS}
          />
        )}

        {audioSrc && (
          <audio
            ref={audioRef}
            src={audioSrc}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        )}
      </div>
    </div>
  );
}
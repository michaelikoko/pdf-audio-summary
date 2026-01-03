'use client'
import { PauseCircle, PlayCircle, Download, VolumeX } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SummaryCardProps {
    summary: string;
    fileName: string;
    audioSrc: string | null;
    isPlaying: boolean;
    isGeneratingAudio: boolean;
    useBrowserTTS: boolean;
    onTogglePlay: () => void;
}

export default function SummaryCard({
    summary,
    fileName,
    audioSrc,
    isPlaying,
    isGeneratingAudio,
    onTogglePlay,
    useBrowserTTS
}: SummaryCardProps) {

    function downloadSummary() {
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.replace(/\.[^/.]+$/, '')}_summary.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="card card-border shadow-lg bg-base-200 mt-4">
            <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <h2 className="card-title text-start">
                        Document Summary for{' '}
                        <span className="text-primary break-all">{fileName}</span>
                    </h2>

                    <div className="flex gap-2 shrink-0">
                        <button
                            type="button"
                            className="btn btn-secondary btn-ghost"
                            onClick={onTogglePlay}
                            disabled={isGeneratingAudio || (!audioSrc && !useBrowserTTS)}
                        >
                            {isGeneratingAudio ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    {isPlaying ? (
                                        <PauseCircle className="w-5 h-5" />
                                    ) : (
                                        <PlayCircle className="w-5 h-5" />
                                    )}
                                    <span className="hidden lg:inline">
                                        {isPlaying ? 'Pause' : 'Read Aloud'}
                                    </span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={downloadSummary}
                            title="Download summary"
                        >
                            <Download className="w-5 h-5" />
                            <span className="hidden lg:inline">Download</span>
                        </button>
                    </div>
                </div>

                <div className="prose prose-sm lg:prose-base max-w-none text-start">
                    <Markdown remarkPlugins={[remarkGfm]}>{summary}</Markdown>
                </div>
            </div>
        </div>
    );
}
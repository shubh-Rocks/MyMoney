"use client";

import { useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api.Client";

export default function VoiceAssistanceCard() {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        console.log("Audio Blob:", audioBlob);

        await processVoice(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();

      setIsRecording(true);

      console.log("Recording started");
    } catch (error) {
      console.error("Microphone error:", error);

      alert("Microphone permission is required.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();

    setIsRecording(false);

    console.log("Recording stopped");
  };

  const processVoice = async (audioBlob) => {
    try {
      setIsProcessing(true);

      const formData = new FormData();

      formData.append("audio", audioBlob, "voice.webm");

      console.log("Sending audio to backend...");

      const result = await apiClient.aiVoice(formData);

      console.log("AI RESULT:", result);

      console.log("Transcript:", result.transcript);

      console.log("Extracted Data:", result.data);

      alert(
        `Name: ${result.data.borrower.name}\n` +
          `Amount: ₹${result.data.loan.amount}`,
      );
    } catch (error) {
      console.error("Voice processing error:", error);

      alert(error.message || "Could not process voice input.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      onClick={
        isProcessing ? undefined : isRecording ? stopRecording : startRecording
      }
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
    >
      <div className="relative w-11 h-11 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
        {!isRecording && !isProcessing && (
          <span className="absolute -inset-1 rounded-full border-[1.5px] border-blue-500 opacity-40 animate-ping" />
        )}

        {isProcessing ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isRecording ? (
          <Square size={18} />
        ) : (
          <Mic size={18} />
        )}
      </div>

      <div>
        <h4 className="text-[13.5px] font-bold">
          {isProcessing
            ? "Processing..."
            : isRecording
              ? "Listening..."
              : "Voice Assistant"}
        </h4>

        <span className="text-[11.5px] text-slate-400">
          {isProcessing
            ? "Understanding borrower details..."
            : isRecording
              ? "Speak borrower details..."
              : '"Rahul gives 5000 rupees" — try it'}
        </span>
      </div>
    </div>
  );
}

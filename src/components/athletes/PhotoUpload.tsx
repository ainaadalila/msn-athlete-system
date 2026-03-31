"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface PhotoUploadProps {
  value?: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("Fail terlalu besar. Maksimum 5MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Hanya JPG, PNG atau WebP dibenarkan.");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file, url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreview(null);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-gray-200 group">
          <Image
            src={preview}
            alt="Gambar atlet"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          className="w-32 h-40 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-gray-50"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-400 text-center px-2">
            {t.athlete.uploadPhoto}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {preview && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="text-xs"
        >
          {t.athlete.changePhoto}
        </Button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-400">{t.athlete.uploadPhotoHint}</p>
    </div>
  );
}

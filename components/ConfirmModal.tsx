"use client";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-[#1C2B1A] border border-white/10 rounded-sm max-w-sm w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle
            size={24}
            className={isDangerous ? "text-red-400" : "text-yellow-500"}
          />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <p className="text-sm text-white/70">{message}</p>
        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-white/20 text-white text-sm rounded-sm hover:bg-white/5 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white text-sm rounded-sm font-medium transition-colors ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#3D6B35] hover:bg-[#8A9E7B]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { Toast as ToastType } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  const getToastIcon = (type: ToastType["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastColors = (type: ToastType["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm rounded-lg border p-4 shadow-lg transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
            ${getToastColors(toast.type)}
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{getToastIcon(toast.type)}</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {toast.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => onRemove(toast.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

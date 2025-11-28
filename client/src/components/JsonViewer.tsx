import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors z-10"
      >
        {copied ? (
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
        ) : (
          <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
        )}
      </button>
      <pre className="bg-gray-900 text-gray-100 p-3 sm:p-6 rounded-lg overflow-x-auto text-xs sm:text-sm">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}

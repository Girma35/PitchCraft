import { Mail } from 'lucide-react';

interface EmailCardProps {
  email: string;
}

export function EmailCard({ email }: EmailCardProps) {
  const lines = email.split('\n');
  const subjectLine = lines.find(line => line.startsWith('Subject:'));
  const subject = subjectLine?.replace('Subject:', '').trim() || '';
  const bodyStartIndex = lines.findIndex(line => line.trim() === '') + 1;
  const body = lines.slice(bodyStartIndex).join('\n').trim();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Generated Email</h2>
      </div>

      {subject && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Subject</p>
          <p className="text-sm sm:text-base text-gray-900 font-medium break-words">{subject}</p>
        </div>
      )}

      <div>
        <p className="text-xs sm:text-sm text-gray-500 mb-2">Body</p>
        <div className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed break-words">
          {body}
        </div>
      </div>
    </div>
  );
}

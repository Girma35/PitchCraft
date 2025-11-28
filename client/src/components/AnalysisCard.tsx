import { Analysis } from '../lib/api';
import { TrendingUp, AlertTriangle, FileText } from 'lucide-react';

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Email Analysis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className={`p-2 rounded-lg flex-shrink-0 ${getScoreBgColor(100 - analysis.spamScore)}`}>
            <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${getScoreColor(100 - analysis.spamScore)}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-500">Spam Score</p>
            <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(100 - analysis.spamScore)}`}>
              {analysis.spamScore}%
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className={`p-2 rounded-lg flex-shrink-0 ${getScoreBgColor(analysis.readabilityScore)}`}>
            <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${getScoreColor(analysis.readabilityScore)}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-500">Readability</p>
            <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
              {analysis.readabilityScore}%
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-500">Trend</p>
            <p className="text-sm sm:text-lg font-medium text-gray-900 break-words">{analysis.trend}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

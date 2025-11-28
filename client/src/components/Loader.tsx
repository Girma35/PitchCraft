export function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">{text}</p>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3 sm:space-y-4">
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
      <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-3 sm:mb-4"></div>
      <div className="space-y-2 sm:space-y-3">
        <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

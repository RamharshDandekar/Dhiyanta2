export default function LoadingOverlay({ message = 'Processing...', progress = null }) {
  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Spinner */}
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          {/* Message */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
            <p className="text-sm text-gray-600">Please wait while our AI agents analyze your RFP</p>
          </div>
          
          {/* Progress Bar (if provided) */}
          {progress !== null && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Agent Status Indicators */}
          <div className="w-full space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Sales Agent: Analyzing RFP</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Technical Agent: Matching Products</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Pricing Agent: Calculating Strategy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

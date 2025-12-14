export default function NavigationButtons({
  onBack,
  onNext,
  onSkip,
  canGoBack,
  canSkip,
  nextLabel = 'Weiter',
  nextDisabled = false,
}) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 mt-8 w-full">
      <div className="flex-1 flex justify-start sm:justify-start">
        {canGoBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-4 sm:px-6 py-3 text-sm sm:text-base text-textSecondary hover:text-textPrimary transition-default w-full sm:w-auto text-center"
          >
            ← Zurück
          </button>
        ) : (
          <div className="w-full sm:w-auto"></div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center">
        {canSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 sm:py-3 text-sm text-textSecondary hover:text-textPrimary transition-default w-full sm:w-auto text-center"
          >
            Überspringen
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-end sm:justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="px-6 sm:px-8 py-3 text-sm sm:text-base bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-default hover:scale-105 hover:shadow-lg w-full sm:w-auto text-center"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

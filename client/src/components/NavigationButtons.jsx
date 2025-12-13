export default function NavigationButtons({
  onBack,
  onNext,
  onSkip,
  canGoBack,
  canSkip,
  nextLabel = 'Next',
  nextDisabled = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 mt-8">
      <div>
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 text-textSecondary hover:text-textPrimary transition-default"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {canSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary transition-default"
          >
            Skip
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-default hover:scale-105 hover:shadow-lg"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

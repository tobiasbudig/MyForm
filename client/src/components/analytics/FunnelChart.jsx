import { motion } from 'framer-motion';

export default function FunnelChart({ data }) {
  const { metrics, rates } = data;

  const funnelSteps = [
    {
      label: 'QR-Scans / Seitenaufrufe',
      count: metrics.page_views,
      percentage: 100,
      color: 'bg-blue-500',
    },
    {
      label: 'Umfrage gestartet',
      count: metrics.survey_starts,
      percentage: rates.startRate,
      color: 'bg-green-500',
      dropoff: metrics.page_views - metrics.survey_starts,
    },
    {
      label: 'Umfrage abgeschlossen',
      count: metrics.survey_completions,
      percentage: rates.overallConversion,
      color: 'bg-purple-500',
      dropoff: metrics.survey_starts - metrics.survey_completions,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-blue-600 font-medium mb-1">Start-Rate</div>
          <div className="text-3xl font-bold text-blue-700">{rates.startRate}%</div>
          <div className="text-xs text-blue-600 mt-1">
            {metrics.survey_starts} von {metrics.page_views} gestartet
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-sm text-green-600 font-medium mb-1">Abschluss-Rate</div>
          <div className="text-3xl font-bold text-green-700">{rates.completionRate}%</div>
          <div className="text-xs text-green-600 mt-1">
            {metrics.survey_completions} von {metrics.survey_starts} abgeschlossen
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-sm text-purple-600 font-medium mb-1">Gesamt-Conversion</div>
          <div className="text-3xl font-bold text-purple-700">{rates.overallConversion}%</div>
          <div className="text-xs text-purple-600 mt-1">
            {metrics.survey_completions} von {metrics.page_views} konvertiert
          </div>
        </div>
      </div>

      {/* Visual funnel */}
      <div className="space-y-3">
        {funnelSteps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-textPrimary">{step.label}</span>
                  <span className="text-sm text-textSecondary">
                    {step.count} ({step.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    className={`h-full ${step.color} flex items-center justify-end pr-4`}
                  >
                    <span className="text-white font-bold text-sm">{step.count}</span>
                  </motion.div>
                </div>
                {step.dropoff !== undefined && step.dropoff > 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    ⚠ {step.dropoff} Abbrüche ({((step.dropoff / funnelSteps[index - 1].count) * 100).toFixed(1)}%)
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

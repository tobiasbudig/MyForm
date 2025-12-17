export default function DropoffTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Frage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Erreicht
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Abgeschlossen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Abbruch-Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => {
            const isHighDropoff = row.dropoffRate > 10;
            const isModerateDropoff = row.dropoffRate > 5 && row.dropoffRate <= 10;

            return (
              <tr key={row.questionId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-textPrimary">
                        Frage {row.questionNumber + 1}
                      </div>
                      <div className="text-xs text-textSecondary">{row.questionId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-textPrimary font-semibold">
                    {row.sessionsReached}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-textPrimary">
                    {row.sessionsCompleted !== null ? row.sessionsCompleted : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        isHighDropoff
                          ? 'text-red-600'
                          : isModerateDropoff
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}
                    >
                      {row.dropoffRate.toFixed(1)}%
                    </span>
                    {isHighDropoff && (
                      <span className="text-red-600" title="Hohe Abbruchrate">
                        ⚠
                      </span>
                    )}
                    {isModerateDropoff && (
                      <span className="text-orange-600" title="Moderate Abbruchrate">
                        ⚡
                      </span>
                    )}
                    {!isHighDropoff && !isModerateDropoff && (
                      <span className="text-green-600" title="Niedrige Abbruchrate">
                        ✓
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-xs text-textSecondary space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span>Niedrige Abbruchrate ({"<"}5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600">⚡</span>
            <span>Moderate Abbruchrate (5-10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠</span>
            <span>Hohe Abbruchrate ({">"}10%) - Diese Fragen sollten überprüft werden</span>
          </div>
        </div>
      </div>
    </div>
  );
}

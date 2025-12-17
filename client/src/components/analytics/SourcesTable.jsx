export default function SourcesTable({ data }) {
  // Sort by scans descending
  const sortedData = [...data].sort((a, b) => b.scans - a.scans);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              QR-Quelle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Scans
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Gestartet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Abgeschlossen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
              Conversion-Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row) => {
            const isGoodConversion = row.conversionRate >= 50;
            const isMediumConversion = row.conversionRate >= 30 && row.conversionRate < 50;
            const isPoorConversion = row.conversionRate < 30;

            return (
              <tr key={row.source} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-textPrimary capitalize">
                      {row.source}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-textPrimary font-semibold">{row.scans}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-textPrimary">{row.starts}</div>
                  <div className="text-xs text-textSecondary">
                    {row.scans > 0 ? ((row.starts / row.scans) * 100).toFixed(1) : 0}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-textPrimary">{row.completions}</div>
                  <div className="text-xs text-textSecondary">
                    {row.starts > 0 ? ((row.completions / row.starts) * 100).toFixed(1) : 0}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div
                        className={`text-sm font-bold ${
                          isGoodConversion
                            ? 'text-green-600'
                            : isMediumConversion
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        {row.conversionRate.toFixed(1)}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            isGoodConversion
                              ? 'bg-green-500'
                              : isMediumConversion
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(row.conversionRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    {isGoodConversion && (
                      <span className="text-green-600" title="Gute Conversion">
                        ✓
                      </span>
                    )}
                    {isMediumConversion && (
                      <span className="text-orange-600" title="Mittlere Conversion">
                        ⚡
                      </span>
                    )}
                    {isPoorConversion && (
                      <span className="text-red-600" title="Niedrige Conversion">
                        ⚠
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
            <span>Gute Conversion (≥50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600">⚡</span>
            <span>Mittlere Conversion (30-49%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠</span>
            <span>Niedrige Conversion ({"<"}30%) - QR-Code-Platzierung überprüfen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

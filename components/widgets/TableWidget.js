'use client';

export default function TableWidget({ data }) {
  const { columns, rows, title, timestamp } = data;

  return (
    <div className="table-widget bg-gray-800 rounded-lg p-4 mb-3">
      {title && (
        <h3 className="text-lg font-semibold text-gray-100 mb-3">{title}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-700 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {timestamp && (
        <span className="text-xs text-gray-500 mt-2 block">
          {new Date(timestamp).toLocaleString()}
        </span>
      )}
    </div>
  );
}

const ReferenceTable = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from(Array(60).keys())
        .reduce((rows, num, idx) => {
          const rowIdx = Math.floor(idx / 30);
          if (!rows[rowIdx]) rows[rowIdx] = [];
          rows[rowIdx].push(num);
          return rows;
        }, [] as number[][])
        .map((col, colIdx) => (
          <div key={colIdx} className="bg-surface rounded-md border border-line p-4">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-line px-4 py-2 font-semibold text-ink">
                    60進数
                  </th>
                  <th className="border border-line px-4 py-2 font-semibold text-ink">
                    10進数
                  </th>
                </tr>
              </thead>
              <tbody>
                {col.map((num) => (
                  <tr key={num} className="hover:bg-soft">
                    <td className="border border-line px-4 py-2 text-center font-mono text-ink">
                      {num}
                    </td>
                    <td className="border border-line px-4 py-2 text-center font-mono text-ink">
                      {(num / 60).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default ReferenceTable;

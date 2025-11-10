export function TableItem({ properties }: { properties: Record<string, any> }) {
  const columns = properties.columns || 3;
  const rows = properties.rows || 3;
  const headerRow = properties.headerRow !== false;

  const tableStyle: React.CSSProperties = {
    width: properties.width || 400,
    height: properties.height || 150,
    borderCollapse: 'collapse',
    fontSize: `${properties.fontSize || 11}px`,
    fontFamily: properties.fontFamily || 'Arial',
    color: properties.textColor || '#000000',
  };

  const cellStyle: React.CSSProperties = {
    border: `1px solid ${properties.borderColor || '#cccccc'}`,
    padding: `${properties.cellPadding || 5}px`,
  };

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: properties.headerColor || '#f0f0f0',
    fontWeight: 'bold',
  };

  return (
    <table style={tableStyle}>
      {headerRow && (
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i} style={headerStyle}>
                Col {i + 1}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: headerRow ? rows - 1 : rows }, (_, i) => (
          <tr key={i}>
            {Array.from({ length: columns }, (_, j) => (
              <td key={j} style={cellStyle}>
                Data
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MatrixItem({ properties }: { properties: Record<string, any> }) {
  const rowGroups = properties.rowGroups || 2;
  const columnGroups = properties.columnGroups || 2;

  const containerStyle: React.CSSProperties = {
    width: properties.width || 400,
    height: properties.height || 200,
    border: `1px solid ${properties.borderColor || '#cccccc'}`,
    fontSize: `${properties.fontSize || 11}px`,
    fontFamily: properties.fontFamily || 'Arial',
    color: properties.textColor || '#000000',
    display: 'grid',
    gridTemplateColumns: `repeat(${columnGroups + 1}, 1fr)`,
    gridTemplateRows: `repeat(${rowGroups + 1}, 1fr)`,
  };

  const cellStyle: React.CSSProperties = {
    border: `1px solid ${properties.borderColor || '#cccccc'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...cellStyle, backgroundColor: '#f5f5f5' }}></div>
      {Array.from({ length: columnGroups }, (_, i) => (
        <div key={`col-${i}`} style={{ ...cellStyle, backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
          C{i + 1}
        </div>
      ))}
      {Array.from({ length: rowGroups }, (_, i) => (
        <>
          <div key={`row-${i}`} style={{ ...cellStyle, backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
            R{i + 1}
          </div>
          {Array.from({ length: columnGroups }, (_, j) => (
            <div key={`cell-${i}-${j}`} style={cellStyle}>
              Data
            </div>
          ))}
        </>
      ))}
    </div>
  );
}

export function SingleFieldItem({ properties }: { properties: Record<string, any> }) {
  const containerStyle: React.CSSProperties = {
    width: properties.width || 200,
    height: properties.height || 30,
    fontSize: `${properties.fontSize || 12}px`,
    fontFamily: properties.fontFamily || 'Arial',
    fontWeight: properties.fontWeight || 'normal',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const labelStyle: React.CSSProperties = {
    color: properties.labelColor || '#000000',
    width: properties.labelWidth || 80,
    flexShrink: 0,
  };

  const valueStyle: React.CSSProperties = {
    color: properties.valueColor || '#333333',
    flex: 1,
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{properties.label || 'Label:'}</span>
      <span style={valueStyle}>{properties.value || 'Value'}</span>
    </div>
  );
}

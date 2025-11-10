export function TextBoxItem({ properties }: { properties: Record<string, any> }) {
  const style: React.CSSProperties = {
    width: properties.width || 150,
    height: properties.height || 30,
    fontSize: `${properties.fontSize || 12}px`,
    fontFamily: properties.fontFamily || 'Arial',
    fontWeight: properties.fontWeight || 'normal',
    fontStyle: properties.fontStyle || 'normal',
    textAlign: properties.textAlign || 'left',
    color: properties.color || '#000000',
    backgroundColor: properties.backgroundColor !== 'transparent' ? properties.backgroundColor : 'transparent',
    padding: `${properties.padding || 5}px`,
    overflow: 'hidden',
    wordWrap: 'break-word',
  };

  return <div style={style}>{properties.text || 'Text'}</div>;
}

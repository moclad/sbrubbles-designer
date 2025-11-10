export function ImageItem({ properties }: { properties: Record<string, any> }) {
  const style: React.CSSProperties = {
    width: properties.width || 200,
    height: properties.height || 150,
    objectFit: properties.objectFit || 'contain',
    backgroundColor: '#f5f5f5',
  };

  return properties.src ? (
    <img src={properties.src} alt={properties.alt || 'Image'} style={style} />
  ) : (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
      }}
    >
      No image
    </div>
  );
}

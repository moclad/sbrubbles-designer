import { QRCodeSVG } from 'qrcode.react';

export function QRCodeItem({ properties }: { properties: Record<string, any> }) {
  const size = properties.size || 150;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <QRCodeSVG
        value={properties.value || 'https://example.com'}
        size={size}
        bgColor={properties.bgColor || '#ffffff'}
        fgColor={properties.fgColor || '#000000'}
      />
    </div>
  );
}

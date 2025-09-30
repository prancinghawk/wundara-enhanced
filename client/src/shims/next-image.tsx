import React from 'react';

// Minimal Next.js Image shim using a native <img> element.
// Supports a subset of props used in the Material Me kit.
export type NextImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export default function Image({ fill, style, src, alt = '', ...rest }: NextImageProps) {
  const isStringSrc = typeof src === 'string';
  const resolvedSrc = isStringSrc ? (src as string) : ((src as any)?.src ?? '');

  const finalStyle: React.CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : style;

  return <img src={resolvedSrc} alt={alt} style={finalStyle} {...rest} />;
}

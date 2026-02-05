/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

export default function PosterThumb({ src, alt }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        style={{
          width: 300,
          height: 200,
          border: '1px solid #ddd',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          background: '#fafafa',
          textAlign: 'center',
          padding: 8,
        }}
      >
        image not available
      </div>
    );
  }

  return <img src={src} alt={alt || 'Poster'} onError={() => setBroken(true)} />;
}


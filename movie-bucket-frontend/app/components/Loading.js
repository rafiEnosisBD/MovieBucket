export default function Loading({ text = 'Loading...' }) {
  return (
    <div style={{ padding: 10, textAlign: 'center' }}>
      <p>{text}</p>
    </div>
  );
}


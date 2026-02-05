export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: '#fdecea',
        color: '#d32f2f',
        padding: 10,
        borderRadius: 6,
        marginBottom: 14,
      }}
      role="alert"
    >
      {message}
    </div>
  );
}


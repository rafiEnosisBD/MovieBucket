export default function Pagination({
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 10)));
  const canPrev = pageNumber > 1;
  const canNext = pageNumber < totalPages;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="secondary-btn" disabled={!canPrev} onClick={() => onPageChange(pageNumber - 1)}>
          Prev
        </button>
        <button className="secondary-btn" disabled={!canNext} onClick={() => onPageChange(pageNumber + 1)}>
          Next
        </button>
        <span className="inline-help">
          Page <b>{pageNumber}</b> of <b>{totalPages}</b> (Total: <b>{totalCount || 0}</b>)
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="inline-help">Page size</span>
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} style={{ width: 110 }}>
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


export function toDateInputValue(dateOrString) {
  if (!dateOrString) return '';
  const d = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(dateOrString) {
  if (!dateOrString) return '';
  const d = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString();
}

export default function Money({ v = 0, mark, dim, sign, className = '' }) {
  const abs = Math.abs(Math.round(v));
  const formatted = abs.toLocaleString('ja-JP');
  const prefix = sign ? (v >= 0 ? '+¥' : '−¥') : (mark ? '¥' : '');
  return (
    <span className={`money ${dim ? 'dim' : ''} ${className}`}>
      {prefix}{formatted}
    </span>
  );
}

export default function Pct({ v = 0, className = '' }) {
  return (
    <span className={`pct ${className}`}>
      {(v * 100).toFixed(1)}%
    </span>
  );
}

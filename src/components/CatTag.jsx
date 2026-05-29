export default function CatTag({ c }) {
  if (!c) return null;
  return <span className="cat-tag">{c}</span>;
}

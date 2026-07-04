export default function Loader({ label = 'Finding great events...' }) {
  return <div className="loader-wrap"><span className="loader" /><p>{label}</p></div>;
}

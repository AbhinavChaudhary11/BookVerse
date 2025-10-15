export default function GenreDropdown({ genres, value, onChange }) {
  const unique = Array.from(new Set([ 'All Genres', ...genres.filter(Boolean) ]));
  return (
    <select
      className="border rounded px-3 py-2 bg-white"
      value={value}
      onChange={(e)=>onChange(e.target.value)}
    >
      {unique.map((g) => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  );
}


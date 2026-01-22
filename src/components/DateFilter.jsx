function DateFilter({ days, setDays }) {
  return (
    <div className="flex gap-3 mb-6">
      {[7, 30].map(d => (
        <button
          key={d}
          onClick={() => setDays(d)}
          className={`px-4 py-2 rounded-lg text-sm font-medium
            ${days === d
              ? "bg-black text-white"
              : "bg-white border hover:bg-gray-100"
            }`}
        >
          Last {d} Days
        </button>
      ))}
    </div>
  );
}

export default DateFilter

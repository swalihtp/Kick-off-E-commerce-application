function DashboardCards({ cards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {Object.entries(cards).map(([key, value]) => (
        <div
          key={key}
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-black"
        >
          <p className="text-sm text-gray-500 uppercase">{key}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards
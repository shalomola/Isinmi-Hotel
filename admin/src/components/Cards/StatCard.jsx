const StatCard = ({ icon, label, value, change, changeType }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between">
      <div className="w-14 h-14 flex items-center justify-center text-[26px] text-white bg-emerald-900 rounded-full drop-shadow-xl">{icon}</div>
      <div className="text-right">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-medium text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-1.5 ${changeType === "up" ? "text-emerald-600" : "text-red-500"}`}>
              {change}
            </p>
          )}
      </div>
    </div>
  );
}

export default StatCard;

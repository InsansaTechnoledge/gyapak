import useCountdown from '../../hooks/useCountdown';

export default function CountdownCard() {
  const countdownTime = useCountdown({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 10
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-6">
          UPSC Preliminary Test - Starting Soon
        </h2>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {['days', 'hours', 'minutes', 'seconds'].map((unit, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{countdownTime[unit]}</div>
              <div className="text-xs text-gray-500">
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Regular Price</div>
              <div className="text-lg font-bold text-gray-900">₹1,499</div>
            </div>
            <div>
              <div className="text-sm text-primary">Limited Offer</div>
              <div className="text-lg font-bold text-primary">₹999</div>
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">
          Register Now & Save 33%
        </button>

        <div className="absolute top-4 right-4">
          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Live Results
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';

export default function Profile() {
  const { token, API_BASE, user } = useAuth();
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
      setMe(await res.json());
    })();
  }, []);

  if (!me) return <p className="text-center mt-10">Loading...</p>;

  // Stats calculations
  const totalRead = me.library?.filter((b) => b.status === 'read')?.length || 0;
  const totalToBeRead = me.library?.filter((b) => b.status === 'toBeRead')?.length || 0;
  const librarySize = me.library?.length || 0;


  const readBooks = me.library?.filter((b) => b.status === 'read') || [];
  const chartDataMap = {};

  readBooks.forEach((b) => {
    const date = dayjs(b.updatedAt || b.addedAt || new Date()).format('MMM YYYY');
    chartDataMap[date] = (chartDataMap[date] || 0) + 1;
  });

  const chartData = Object.entries(chartDataMap)
    .sort(([a], [b]) => dayjs(a).isAfter(dayjs(b)) ? 1 : -1)
    .map(([date, count]) => ({ date, count }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Info */}
      <div className="bg-white p-6 rounded shadow flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-semibold">
            {me.username?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{me.username}</h1>
          <p className="text-gray-600">{me.email}</p>
          <p className="mt-2 text-sm">Joined: {dayjs(me.createdAt).format('MMM DD, YYYY')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <p className="text-gray-500">Total Read</p>
          <p className="text-2xl font-bold text-blue-600">{totalRead}</p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <p className="text-gray-500">To Be Read</p>
          <p className="text-2xl font-bold text-amber-500">{totalToBeRead}</p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <p className="text-gray-500">Library Size</p>
          <p className="text-2xl font-bold text-green-600">{librarySize}</p>
        </div>
      </div>

      {/* Books Read Over Time Chart */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Books Read Over Time</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No books read yet</p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BookCard from '../components/BookCard.jsx';

export default function Friends() {
  const { token, API_BASE } = useAuth();
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [friendLibrary, setFriendLibrary] = useState(null);

  async function loadFriends() {
    const res = await fetch(`${API_BASE}/api/friends`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setFriends(data);
  }

  async function loadRequests() {
    const res = await fetch(`${API_BASE}/api/friends/requests`, { headers: { Authorization: `Bearer ${token}` } });
    setRequests(await res.json());
  }

  async function search() {
    if (!query) { setResults([]); return; }
    const res = await fetch(`${API_BASE}/api/users/search?q=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${token}` } });
    setResults(await res.json());
  }

  async function request(userId) {
    await fetch(`${API_BASE}/api/friends/request/${userId}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  }

  async function accept(fromUserId) {
    await fetch(`${API_BASE}/api/friends/accept/${fromUserId}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    await Promise.all([loadRequests(), loadFriends()]);
  }

  async function reject(fromUserId) {
    await fetch(`${API_BASE}/api/friends/reject/${fromUserId}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    await loadRequests();
  }

  async function viewLibrary(friendId) {
    setActiveFriend(friendId);
    const res = await fetch(`${API_BASE}/api/friends/${friendId}/library`, { headers: { Authorization: `Bearer ${token}` } });
    setFriendLibrary(await res.json());
  }

  useEffect(() => { loadFriends(); loadRequests(); }, []);

  return (
    <div className="space-y-6 p-6 ">
      {/* Friend Requests */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <p className="font-semibold text-lg mb-3 text-gray-800">Friend Requests</p>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500">No pending requests</p>
        ) : (
          <div className="space-y-3">
            {requests.map(r => (
              <div
                key={r.fromUserId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  {r.profilePic && (
                    <img src={r.profilePic} className="w-10 h-10 rounded-full object-cover border" />
                  )}
                  <span className="font-medium text-gray-700">{r.username}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg shadow"
                    onClick={() => accept(r.fromUserId)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 text-sm rounded-lg shadow"
                    onClick={() => reject(r.fromUserId)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="px-5 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg shadow transition duration-300"
          onClick={search}
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <p className="font-semibold text-lg mb-3 text-gray-800">Search Results</p>
          <div className="space-y-3">
            {results.map(u => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <span className="font-medium text-gray-700">{u.username}</span>
                <button
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg shadow"
                  onClick={() => request(u._id)}
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <p className="font-semibold text-lg mb-3 text-gray-800">Your Friends</p>
        {friends.length === 0 ? (
          <p className="text-sm text-gray-500">You haven’t added any friends yet.</p>
        ) : (
          <div className="space-y-3">
            {friends.map(f => (
              <div
                key={f._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  {f.profilePic && (
                    <img src={f.profilePic} className="w-10 h-10 rounded-full object-cover border" />
                  )}
                  <span className="font-medium text-gray-700">{f.username}</span>
                </div>
                <button
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-700 text-white text-sm rounded-lg shadow"
                  onClick={() => viewLibrary(f._id)}
                >
                  View Library
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friend Library Modal */}
      {activeFriend && friendLibrary && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => { setActiveFriend(null); setFriendLibrary(null); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-6 overflow-y-auto max-h-[90vh] border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 border-b pb-3">
              <div className="flex items-center gap-3">
                {friendLibrary.profilePic && (
                  <img src={friendLibrary.profilePic} className="w-10 h-10 rounded-full object-cover border" />
                )}
                <h2 className="font-semibold text-xl text-gray-800">{friendLibrary.username}'s Library</h2>
              </div>
              <button
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 transition"
                onClick={() => { setActiveFriend(null); setFriendLibrary(null); }}
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-700 border-b pb-1">📘 Read</h3>
                <div className="space-y-3">
                  {(friendLibrary.library || [])
                    .filter(b => (b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read')
                    .map(b => (
                      <BookCard key={b.googleId} book={b} />
                    ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-700 border-b pb-1">🕮 To Be Read</h3>
                <div className="space-y-3">
                  {(friendLibrary.library || [])
                    .filter(b => (b.status || (b.isRead ? 'read' : 'toBeRead')) === 'toBeRead')
                    .map(b => (
                      <BookCard key={b.googleId} book={b} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

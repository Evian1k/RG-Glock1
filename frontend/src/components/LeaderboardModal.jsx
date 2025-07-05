import React from "react";

export default function LeaderboardModal({ open, onClose, rankings }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gradient-primary">Leaderboards</h2>
        <ol className="space-y-2">
          {rankings.map((user, i) => (
            <li key={user.username} className={`flex items-center justify-between p-2 rounded ${i === 0 ? 'bg-yellow-100 dark:bg-yellow-900' : i === 1 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
              <span className="font-semibold">#{i+1} {user.username}</span>
              <span className="text-blue-600 font-bold">{user.points} pts</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

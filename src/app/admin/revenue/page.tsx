"use client";

export default function Admin${page^}Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">${page^} Management</h1>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
        <p className="text-gray-400">
          ${page^} management dashboard is under development.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This page will contain detailed ${page} controls and analytics.
        </p>
      </div>
    </div>
  );
}

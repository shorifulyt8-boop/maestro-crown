import React from "react";

export default function Header({ title, logo, established, location }: { title: string; logo: string; established: string; location: string }) {
  return (
    <header className="p-6 bg-white flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-4">
        {logo ? (
          <img 
            src={logo} 
            alt="Logo" 
            className="w-16 h-16 object-contain" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            MC
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-green-800 tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 font-medium">Established: {established} | {location}</p>
        </div>
      </div>
      <div className="hidden md:block text-right">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Education for Excellence</p>
      </div>
    </header>
  );
}

import React from "react";
import { Megaphone } from "lucide-react";
import { TickerItem } from "../types";

export default function Ticker({ items = [] }: { items: TickerItem[] }) {
  const tickerContent = items.length > 0 
    ? items.map(item => (
        <span key={item.id} className="inline-flex items-center">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-green-700">
              {item.text}
            </a>
          ) : (
            <span>{item.text}</span>
          )}
          <span className="mx-8 text-green-300">|</span>
        </span>
      ))
    : <span>Welcome to Maestro Crown College</span>;

  return (
    <div className="bg-green-50 border-y border-green-100 flex items-center overflow-hidden h-10">
      <div className="bg-green-600 text-white px-4 h-full flex items-center gap-2 font-bold text-sm z-10 shrink-0">
        <Megaphone className="w-4 h-4" />
        আপডেট:
      </div>
      <div className="whitespace-nowrap animate-marquee py-2 px-4 text-sm font-medium text-green-900">
        {tickerContent}
        {tickerContent}
      </div>
    </div>
  );
}

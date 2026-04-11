import React from "react";
import { PrincipalData } from "../types";

export default function PrincipalMessage({ principal }: { principal: PrincipalData }) {
  return (
    <section className="bg-white rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold text-green-700 border-b-2 border-green-600 pb-2 mb-6">অধ্যক্ষ এর বাণী</h2>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 shrink-0">
          <img 
            src={principal.image} 
            alt={principal.name} 
            className="w-full rounded-lg shadow-md border-4 border-white"
            referrerPolicy="no-referrer"
          />
          <div className="mt-4 text-center">
            <h3 className="font-bold text-lg text-gray-800">{principal.name}</h3>
            <p className="text-sm text-green-600 font-medium italic">অধ্যক্ষ, ফুলবাড়ীয়া কলেজ</p>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-800 mb-4 underline decoration-green-600 underline-offset-8">অধ্যক্ষর বাণী</h4>
          <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
            {principal.message}
          </p>
        </div>
      </div>
    </section>
  );
}

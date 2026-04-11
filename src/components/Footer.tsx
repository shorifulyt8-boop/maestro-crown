import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const educationBoards = [
  { name: "Dhaka Board", url: "https://dhakaeducationboard.gov.bd/" },
  { name: "Mymensingh Board", url: "https://www.mymensingheducationboard.gov.bd/" },
  { name: "Rajshahi Board", url: "https://rajshahieducationboard.gov.bd/" },
  { name: "Comilla Board", url: "https://comillaboard.gov.bd/" },
  { name: "Chittagong Board", url: "https://web.bise-ctg.gov.bd/" },
  { name: "Jessore Board", url: "https://www.jessoreboard.gov.bd/" },
];

export default function Footer({ siteTitle, info }: { siteTitle: string; info: any }) {
  return (
    <footer className="bg-green-900 text-white pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* College Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-green-600 pb-2 inline-block">{siteTitle}</h3>
          <p className="text-green-100 text-sm leading-relaxed">
            {siteTitle} একটি ঐতিহ্যবাহী শিক্ষা প্রতিষ্ঠান যা {info?.established || "১৯৭০"} সালে প্রতিষ্ঠিত হয়। EIIN: {info?.eiin || "N/A"}। আমরা মানসম্মত শিক্ষা এবং শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ নিশ্চিত করতে অঙ্গীকারবদ্ধ।
          </p>
          <div className="space-y-2 text-sm text-green-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{info?.location || "ময়মনসিংহ, বাংলাদেশ"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{info?.phone || "+৮৮০১৭১২৩৪৫৬৭৮"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{info?.email || "info@maestrocrown.edu.bd"}</span>
            </div>
          </div>
        </div>

        {/* Education Boards */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-green-600 pb-2 inline-block">শিক্ষা বোর্ডসমূহ</h3>
          <ul className="grid grid-cols-1 gap-2">
            {educationBoards.map((board, idx) => (
              <li key={idx}>
                <a 
                  href={board.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-green-100 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group"
                >
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  {board.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-green-600 pb-2 inline-block">সামাজিক যোগাযোগ</h3>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          <div className="pt-4">
            <h4 className="font-bold text-sm mb-2">প্রয়োজনীয় লিঙ্ক</h4>
            <ul className="text-sm text-green-200 space-y-1">
              <li><Link to="/login" className="hover:text-white">অ্যাডমিন লগইন</Link></li>
              <li><Link to="/contact" className="hover:text-white">যোগাযোগ করুন</Link></li>
              <li><Link to="/notices" className="hover:text-white">সর্বশেষ নোটিশ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-green-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-300">
        <p>&copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
        <p className="font-medium">
          Developed & Designed by <span className="text-white font-bold">Shoriful Islam</span>
        </p>
      </div>
    </footer>
  );
}

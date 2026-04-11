import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { PageContent } from "../types";

const systemNavItems = [
  { label: "হোম", path: "/", key: "home" },
  { label: "প্রতিষ্ঠান সম্পর্কে", path: "/about", key: "about" },
  { label: "প্রশাসনিক কার্যক্রম", path: "/administration", key: "administration" },
  { label: "একাডেমিক কার্যক্রম", path: "/academic", key: "academic" },
  { label: "সুযোগ সুবিধা", path: "/facilities", key: "facilities" },
  { label: "ভর্তি কার্যক্রম", path: "/admission", key: "admission" },
  { label: "ফলাফল", path: "/results", key: "results" },
  { label: "নোটিশ", path: "/notices", key: "notices" },
  { label: "গ্যালারী", path: "/gallery", key: "gallery" },
  { label: "যোগাযোগ", path: "/contact", key: "contact" },
];

export default function Navbar({ pages = {} }: { pages?: Record<string, PageContent> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const customPages = Object.entries(pages).filter(([key]) => 
    !["about", "administration", "academic", "facilities", "admission", "results", "gallery", "contact"].includes(key)
  );

  const allNavItems = [
    ...systemNavItems,
    ...customPages.map(([key, page]) => ({
      label: page.title,
      path: `/page/${key}`,
      key: key
    })),
    { label: "লগইন", path: "/login", key: "login" }
  ];

  return (
    <nav className="bg-green-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between md:justify-start">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center py-3">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-green-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="ml-2 font-bold text-sm uppercase tracking-wider">মেনু</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-wrap items-center">
            {allNavItems.map((item) => {
              const subPages = pages[item.key as keyof typeof pages]?.subPages;
              const hasSubPages = subPages && Object.keys(subPages).length > 0;

              return (
                <li 
                  key={item.key} 
                  className="relative group"
                  onMouseEnter={() => hasSubPages && setActiveDropdown(item.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => `
                      flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors border-r border-green-600 last:border-r-0
                      ${isActive ? "bg-green-900" : "hover:bg-green-800"}
                    `}
                  >
                    {item.label}
                    {hasSubPages && <ChevronDown className="w-3 h-3" />}
                  </NavLink>

                  {/* Desktop Dropdown */}
                  {hasSubPages && activeDropdown === item.key && (
                    <ul className="absolute left-0 top-full bg-white text-gray-800 shadow-xl border border-gray-100 min-w-[200px] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {Object.entries(subPages).map(([subKey, subPage]) => (
                        <li key={subKey}>
                          <NavLink 
                            to={`${item.path}/${subKey}`}
                            className="block px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition-colors"
                          >
                            {subPage.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] border-t border-green-600" : "max-h-0"}`}>
          <ul className="py-2 bg-green-800">
            {allNavItems.map((item) => {
              const subPages = pages[item.key as keyof typeof pages]?.subPages;
              const hasSubPages = subPages && Object.keys(subPages).length > 0;

              return (
                <li key={item.key}>
                  <div className="flex items-center justify-between border-b border-green-700 last:border-0">
                    <NavLink 
                      to={item.path} 
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        flex-1 px-6 py-3 text-sm font-medium
                        ${isActive ? "bg-green-900 text-white" : "text-green-100 hover:bg-green-700"}
                      `}
                    >
                      {item.label}
                    </NavLink>
                    {hasSubPages && (
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === item.key ? null : item.key)}
                        className="p-3 text-green-200 hover:text-white"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.key ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Sub-menu */}
                  {hasSubPages && activeDropdown === item.key && (
                    <ul className="bg-green-900/50 py-1">
                      {Object.entries(subPages).map(([subKey, subPage]) => (
                        <li key={subKey}>
                          <NavLink 
                            to={`${item.path}/${subKey}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-10 py-2 text-xs font-medium text-green-200 hover:text-white hover:bg-green-700"
                          >
                            {subPage.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

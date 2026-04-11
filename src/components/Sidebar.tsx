import React from "react";
import { Notice, Link as LinkType } from "../types";
import { ChevronRight, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  title: string;
  items: (Notice | LinkType)[];
  type: "notice" | "link";
}

export default function Sidebar({ title, items, type }: SidebarProps) {
  return (
    <aside className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[400px]">
      <h3 className="bg-green-700 text-white p-3 font-bold text-center text-lg shrink-0">{title}</h3>
      <div className="flex-1 bg-gray-50 relative overflow-hidden">
        {type === "notice" && items.length > 0 ? (
          <div className="h-full py-4">
            <motion.div
              animate={{
                y: ["0%", "-100%"],
              }}
              transition={{
                duration: items.length * 3,
                ease: "linear",
                repeat: Infinity,
              }}
              className="space-y-4 px-4"
            >
              {[...items, ...items].map((item, idx) => {
                const notice = item as Notice;
                const Content = (
                  <div className="flex items-start gap-2 p-2 rounded hover:bg-white hover:shadow-sm transition-all">
                    <ChevronRight className="w-4 h-4 text-green-600 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-green-700 transition-colors">
                        {notice.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-bold uppercase">
                        <Calendar className="w-3 h-3" />
                        {notice.date}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div key={`${item.id}-${idx}`} className="group border-b border-gray-200 pb-3 last:border-0">
                    {notice.url ? (
                      <a href={notice.url} target="_blank" rel="noopener noreferrer">
                        {Content}
                      </a>
                    ) : (
                      Content
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          <div className="p-4">
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="group">
                  <a 
                    href={type === "link" ? (item as LinkType).url : "#"} 
                    className="flex items-start gap-2 p-2 rounded hover:bg-white hover:shadow-sm transition-all border-b border-gray-200 last:border-0"
                  >
                    <ChevronRight className="w-4 h-4 text-green-600 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-green-700 transition-colors">
                        {item.title}
                      </p>
                      {type === "notice" && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-bold uppercase">
                          <Calendar className="w-3 h-3" />
                          {(item as Notice).date}
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {items.length === 0 && (
          <p className="text-center text-gray-400 text-sm italic py-8">No items found</p>
        )}
      </div>
    </aside>
  );
}

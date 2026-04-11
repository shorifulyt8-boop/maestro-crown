import React, { useState } from "react";
import { SiteData, PageContent } from "../types";
import { updateSiteData } from "../services/api";
import { 
  Save, LogOut, Plus, Trash2, Image as ImageIcon, 
  Settings, User as UserIcon, Bell, Link as LinkIcon,
  LayoutDashboard, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubPageManager = ({ 
  parentKey, 
  subPages = {}, 
  onUpdate 
}: { 
  parentKey: string, 
  subPages?: Record<string, PageContent>, 
  onUpdate: (newSubPages: Record<string, PageContent>) => void 
}) => {
  return (
    <div className="mt-6 pl-6 border-l-2 border-green-100 space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-green-600 flex items-center gap-2">
          <Plus className="w-3 h-3" /> Sub-pages for this section
        </h5>
        <button 
          onClick={() => {
            const newId = `sub_${Date.now()}`;
            onUpdate({
              ...subPages,
              [newId]: { title: "New Sub-page", content: "Enter sub-page content..." }
            });
          }}
          className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-lg font-bold hover:bg-green-100"
        >
          + Add Sub-page
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(subPages).map(([subKey, subPage]) => (
          <div key={subKey} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm relative group">
            <button 
              onClick={() => {
                const newSubPages = { ...subPages };
                delete newSubPages[subKey];
                onUpdate(newSubPages);
              }}
              className="absolute top-2 right-2 text-red-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 gap-3">
              <input 
                type="text" 
                value={subPage.title} 
                placeholder="Sub-page Title"
                onChange={(e) => {
                  onUpdate({
                    ...subPages,
                    [subKey]: { ...subPage, title: e.target.value }
                  });
                }}
                className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea 
                value={subPage.content} 
                placeholder="Sub-page Content"
                onChange={(e) => {
                  onUpdate({
                    ...subPages,
                    [subKey]: { ...subPage, content: e.target.value }
                  });
                }}
                className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-500 h-24"
              />
              <div className="text-[9px] text-gray-400 font-mono">Route: /page/{parentKey}/{subKey}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminPanel({ initialData, onUpdate, onLogout }: { 
  initialData: SiteData, 
  onUpdate: (data: SiteData) => void,
  onLogout: () => void
}) {
  const [data, setData] = useState<SiteData>(initialData);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteData(data);
      onUpdate(data);
      alert("Data updated successfully!");
    } catch (error) {
      alert("Failed to update data");
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type: "notices" | "importantLinks" | "tickerItems") => {
    const newItem = type === "notices" 
      ? { id: Date.now().toString(), title: "New Notice", date: new Date().toISOString().split('T')[0], url: "" }
      : type === "importantLinks"
      ? { id: Date.now().toString(), title: "New Link", url: "#" }
      : { id: Date.now().toString(), text: "New Ticker Update", url: "" };
    
    setData({ ...data, [type]: [...(data[type] || []), newItem] });
  };

  const removeItem = (type: "notices" | "importantLinks" | "tickerItems", id: string) => {
    setData({ ...data, [type]: data[type].filter((item: any) => item.id !== id) });
  };

  const tabs = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "college_info", label: "College Info", icon: LinkIcon },
    { id: "principal", label: "Principal's Message", icon: UserIcon },
    { id: "pages", label: "Page Content", icon: LayoutDashboard },
    { id: "notices", label: "Notices", icon: Bell },
    { id: "links", label: "Important Links", icon: LinkIcon },
    { id: "banners", label: "Banner Images", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center font-bold">AP</div>
            <h1 className="font-bold text-xl">Admin Portal</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? "bg-green-700 shadow-lg" : "hover:bg-green-800/50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-green-800">
          <button 
            onClick={() => { onLogout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/50 text-red-200 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-green-700" />
            <span className="text-gray-400">/</span>
            <span className="font-bold text-gray-700">{tabs.find(t => t.id === activeTab)?.label}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">View Site</button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8">
            
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">General Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Site Title</label>
                    <input 
                      type="text" 
                      value={data.siteTitle || ""} 
                      onChange={(e) => setData({ ...data, siteTitle: e.target.value })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>

                  <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100 space-y-4">
                    <label className="block text-sm font-bold text-green-800 mb-2">College Logo</label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-white rounded-xl border-2 border-dashed border-green-200 flex items-center justify-center overflow-hidden shrink-0">
                        {data.siteLogo ? (
                          <img src={data.siteLogo} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-green-200" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Logo URL</p>
                          <input 
                            type="text" 
                            value={data.siteLogo || ""} 
                            onChange={(e) => setData({ ...data, siteLogo: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            className="w-full p-2 border rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setData({ ...data, siteLogo: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden" 
                            id="logo-upload"
                          />
                          <label 
                            htmlFor="logo-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-bold cursor-pointer hover:bg-green-50 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Upload from Computer
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-gray-600">Sliding Ticker Updates</label>
                      <button 
                        onClick={() => addItem("tickerItems")}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold hover:bg-green-200 transition-all"
                      >
                        + Add Update
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(data.tickerItems || []).map((item, idx) => (
                        <div key={item.id} className="flex gap-3 items-start bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex-1 space-y-2">
                            <input 
                              type="text" 
                              value={item.text || ""} 
                              placeholder="Update text..."
                              onChange={(e) => {
                                const newItems = [...data.tickerItems];
                                newItems[idx].text = e.target.value;
                                setData({ ...data, tickerItems: newItems });
                              }}
                              className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input 
                              type="text" 
                              value={item.url || ""} 
                              placeholder="Link URL (optional)"
                              onChange={(e) => {
                                const newItems = [...data.tickerItems];
                                newItems[idx].url = e.target.value;
                                setData({ ...data, tickerItems: newItems });
                              }}
                              className="w-full p-2 text-xs border rounded-lg outline-none focus:ring-2 focus:ring-green-500 font-mono"
                            />
                          </div>
                          <button 
                            onClick={() => removeItem("tickerItems", item.id)}
                            className="text-red-400 hover:text-red-600 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "college_info" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">College Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">EIIN Number</label>
                    <input 
                      type="text" 
                      value={data.collegeInfo?.eiin || ""} 
                      onChange={(e) => setData({ ...data, collegeInfo: { ...data.collegeInfo, eiin: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Established Year</label>
                    <input 
                      type="text" 
                      value={data.collegeInfo?.established || ""} 
                      onChange={(e) => setData({ ...data, collegeInfo: { ...data.collegeInfo, established: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Location</label>
                    <input 
                      type="text" 
                      value={data.collegeInfo?.location || ""} 
                      onChange={(e) => setData({ ...data, collegeInfo: { ...data.collegeInfo, location: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Phone</label>
                    <input 
                      type="text" 
                      value={data.collegeInfo?.phone || ""} 
                      onChange={(e) => setData({ ...data, collegeInfo: { ...data.collegeInfo, phone: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-600 mb-2">Email</label>
                    <input 
                      type="text" 
                      value={data.collegeInfo?.email || ""} 
                      onChange={(e) => setData({ ...data, collegeInfo: { ...data.collegeInfo, email: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pages" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Page Contents</h2>
                    <p className="text-sm text-gray-500 mt-1">Select a page from the menu to edit its content</p>
                  </div>
                  <button 
                    onClick={() => {
                      const newId = `custom_${Date.now()}`;
                      setData({
                        ...data,
                        pages: {
                          ...(data.pages || {}),
                          [newId]: { title: "New Page", content: "Enter content here..." }
                        }
                      });
                    }}
                    className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors font-bold"
                  >
                    <Plus className="w-4 h-4" /> Add New Custom Page
                  </button>
                </div>

                {/* Dedicated Section for Menu Pages */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
                    <div className="bg-green-700 px-6 py-3">
                      <h3 className="text-white font-bold flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5" /> Main Menu Pages
                      </h3>
                    </div>
                    <div className="p-6 space-y-8">
                      {["about", "administration", "academic", "facilities", "admission", "results", "gallery", "contact"].map((key) => {
                        const pageData = (data.pages?.[key as keyof typeof data.pages] as PageContent) || { title: key.charAt(0).toUpperCase() + key.slice(1), content: "" };
                        return (
                          <div key={key} className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4 hover:border-green-300 transition-colors">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-green-800 capitalize flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {key.replace(/_/g, ' ')} Page
                              </h4>
                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase tracking-wider">Menu Item</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Page Title (Display Name)</label>
                                <input 
                                  type="text" 
                                  value={pageData.title || ""} 
                                  onChange={(e) => {
                                    const newPages = { ...(data.pages || {}) };
                                    newPages[key as keyof typeof data.pages] = { ...pageData, title: e.target.value };
                                    setData({ ...data, pages: newPages });
                                  }}
                                  className="w-full p-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Page Content (Details)</label>
                                <textarea 
                                  value={pageData.content || ""} 
                                  onChange={(e) => {
                                    const newPages = { ...(data.pages || {}) };
                                    newPages[key as keyof typeof data.pages] = { ...pageData, content: e.target.value };
                                    setData({ ...data, pages: newPages });
                                  }}
                                  placeholder={`Enter content for ${key} page...`}
                                  className="w-full p-4 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500 h-48 transition-all"
                                />
                                <SubPageManager 
                                  parentKey={key} 
                                  subPages={pageData.subPages} 
                                  onUpdate={(newSubPages) => {
                                    const newPages = { ...(data.pages || {}) };
                                    newPages[key as keyof typeof data.pages] = { ...pageData, subPages: newSubPages };
                                    setData({ ...data, pages: newPages });
                                  }} 
                                />
                                {key === "admission" && (
                                  <button 
                                    onClick={() => {
                                      const admissionContent = `Admission Requirements
Please ensure you have the following documents and qualifications ready before applying for admission at Maestro Crown College.

📄 Academic Documents
✔ Original SSC Mark Sheet / Transcript.
✔ 2 Photocopies of SSC Mark Sheet.
✔ Original Testimonial from Headmaster.
✔ SSC Admit Card & Registration Card (Photocopy).

📸 Photos & ID
✔ 4 Copies Passport Size Photo (Student).
✔ 2 Copies Stamp Size Photo (Student).
✔ 2 Copies Passport Size Photo (Parents/Guardian).
✔ Birth Certificate.

Eligibility (GPA)
• Science Group: GPA 3.00
• Business Studies: GPA 2.50
• Humanities: GPA 2.00

Note: Admission depends on seat availability and interview performance.`;
                                      const newPages = { ...(data.pages || {}) };
                                      newPages.admission = { ...pageData, content: admissionContent };
                                      setData({ ...data, pages: newPages });
                                    }}
                                    className="mt-2 text-xs text-green-700 font-bold hover:underline"
                                  >
                                    Apply Admission Template
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Pages Section */}
                  {data.pages && Object.keys(data.pages).some(k => !["about", "administration", "academic", "facilities", "admission", "results", "gallery", "contact"].includes(k)) && (
                    <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
                      <div className="bg-blue-600 px-6 py-3">
                        <h3 className="text-white font-bold flex items-center gap-2">
                          <Plus className="w-5 h-5" /> Custom Created Pages
                        </h3>
                      </div>
                      <div className="p-6 space-y-6">
                        {Object.entries(data.pages).filter(([k]) => !["about", "administration", "academic", "facilities", "admission", "results", "gallery", "contact"].includes(k)).map(([key, page]) => {
                          const pageData = page as PageContent;
                          return (
                            <div key={key} className="p-6 bg-blue-50/30 rounded-xl border border-blue-100 space-y-4 relative group">
                              <button 
                                onClick={() => {
                                  const newPages = { ...data.pages };
                                  delete newPages[key as keyof typeof data.pages];
                                  setData({ ...data, pages: newPages });
                                }}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                              <h4 className="text-lg font-bold text-blue-800">Custom Page: {pageData.title}</h4>
                              <div className="grid grid-cols-1 gap-4">
                                <input 
                                  type="text" 
                                  value={pageData.title || ""} 
                                  onChange={(e) => {
                                    const newPages = { ...data.pages };
                                    newPages[key as keyof typeof data.pages] = { ...pageData, title: e.target.value };
                                    setData({ ...data, pages: newPages });
                                  }}
                                  className="w-full p-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea 
                                  value={pageData.content || ""} 
                                  onChange={(e) => {
                                    const newPages = { ...data.pages };
                                    newPages[key as keyof typeof data.pages] = { ...pageData, content: e.target.value };
                                    setData({ ...data, pages: newPages });
                                  }}
                                  className="w-full p-4 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                />
                                <SubPageManager 
                                  parentKey={key} 
                                  subPages={pageData.subPages} 
                                  onUpdate={(newSubPages) => {
                                    const newPages = { ...(data.pages || {}) };
                                    newPages[key as keyof typeof data.pages] = { ...pageData, subPages: newSubPages };
                                    setData({ ...data, pages: newPages });
                                  }} 
                                />
                                <div className="text-[10px] text-blue-400 font-mono">Route: /page/{key}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {!data.pages && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No page content found. Click below to initialize the menu pages.</p>
                    <button 
                      onClick={() => {
                        const defaultPages = {
                          about: { title: "প্রতিষ্ঠান সম্পর্কে", content: "কন্টেন্ট লিখুন..." },
                          administration: { title: "প্রশাসনিক কার্যক্রম", content: "কন্টেন্ট লিখুন..." },
                          academic: { title: "একাডেমিক কার্যক্রম", content: "কন্টেন্ট লিখুন..." },
                          facilities: { title: "সুযোগ সুবিধা", content: "কন্টেন্ট লিখুন..." },
                          admission: { title: "ভর্তি কার্যক্রম", content: "কন্টেন্ট লিখুন..." },
                          results: { title: "ফলাফল", content: "কন্টেন্ট লিখুন..." },
                          gallery: { title: "গ্যালারী", content: "কন্টেন্ট লিখুন..." },
                          contact: { title: "যোগাযোগ", content: "কন্টেন্ট লিখুন..." }
                        };
                        setData({ ...data, pages: defaultPages });
                      }}
                      className="bg-green-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-800 transition-all"
                    >
                      Initialize Menu Pages
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeTab === "principal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Principal Name</label>
                    <input 
                      type="text" 
                      value={data.principal.name || ""} 
                      onChange={(e) => setData({ ...data, principal: { ...data.principal, name: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Image URL</label>
                    <input 
                      type="text" 
                      value={data.principal.image || ""} 
                      onChange={(e) => setData({ ...data, principal: { ...data.principal, image: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-600 mb-2">Message</label>
                    <textarea 
                      value={data.principal.message || ""} 
                      onChange={(e) => setData({ ...data, principal: { ...data.principal, message: e.target.value } })}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 h-64"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notices" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Notices</h2>
                  <button onClick={() => addItem("notices")} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors font-bold">
                    <Plus className="w-4 h-4" /> Add New Notice
                  </button>
                </div>
                <div className="space-y-4">
                  {data.notices.map((notice, idx) => (
                    <div key={notice.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200 group">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text" 
                          value={notice.title || ""} 
                          onChange={(e) => {
                            const newNotices = [...data.notices];
                            newNotices[idx].title = e.target.value;
                            setData({ ...data, notices: newNotices });
                          }}
                          className="w-full p-2 border rounded-lg bg-white"
                        />
                        <input 
                          type="date" 
                          value={notice.date || ""} 
                          onChange={(e) => {
                            const newNotices = [...data.notices];
                            newNotices[idx].date = e.target.value;
                            setData({ ...data, notices: newNotices });
                          }}
                          className="p-2 border rounded-lg bg-white text-sm"
                        />
                        <input 
                          type="text" 
                          value={notice.url || ""} 
                          placeholder="Notice Link (Optional)"
                          onChange={(e) => {
                            const newNotices = [...data.notices];
                            newNotices[idx].url = e.target.value;
                            setData({ ...data, notices: newNotices });
                          }}
                          className="w-full p-2 border rounded-lg bg-white text-xs font-mono"
                        />
                      </div>
                      <button onClick={() => removeItem("notices", notice.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "links" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Important Links</h2>
                  <button onClick={() => addItem("importantLinks")} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors font-bold">
                    <Plus className="w-4 h-4" /> Add Link
                  </button>
                </div>
                <div className="space-y-4">
                  {data.importantLinks.map((link, idx) => (
                    <div key={link.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text" 
                          value={link.title || ""} 
                          onChange={(e) => {
                            const newLinks = [...data.importantLinks];
                            newLinks[idx].title = e.target.value;
                            setData({ ...data, importantLinks: newLinks });
                          }}
                          placeholder="Title"
                          className="w-full p-2 border rounded-lg bg-white"
                        />
                        <input 
                          type="text" 
                          value={link.url || ""} 
                          onChange={(e) => {
                            const newLinks = [...data.importantLinks];
                            newLinks[idx].url = e.target.value;
                            setData({ ...data, importantLinks: newLinks });
                          }}
                          placeholder="URL"
                          className="w-full p-2 border rounded-lg bg-white text-sm font-mono"
                        />
                      </div>
                      <button onClick={() => removeItem("importantLinks", link.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "banners" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Banner Slider</h2>
                <div className="grid grid-cols-1 gap-6">
                  {data.bannerImages.map((img, idx) => (
                    <div key={idx} className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200 relative group">
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-200 border">
                        <img src={img} alt="Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={img || ""} 
                          onChange={(e) => {
                            const newImages = [...data.bannerImages];
                            newImages[idx] = e.target.value;
                            setData({ ...data, bannerImages: newImages });
                          }}
                          className="flex-1 p-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button 
                          onClick={() => {
                            const newImages = data.bannerImages.filter((_, i) => i !== idx);
                            setData({ ...data, bannerImages: newImages });
                          }} 
                          className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setData({ ...data, bannerImages: [...data.bannerImages, "https://picsum.photos/seed/new/1200/400"] })} 
                    className="w-full py-12 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all flex flex-col items-center justify-center gap-3"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="font-bold">Add New Banner Image</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from "react-router-dom";
import { SiteData } from "./types";
import { fetchSiteData } from "./services/api";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Ticker from "./components/Ticker";
import PrincipalMessage from "./components/PrincipalMessage";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Footer from "./components/Footer";
import { Loader2 } from "lucide-react";

export default function App() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchSiteData()
      .then(setData)
      .finally(() => setLoading(false));
    
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  if (!data) return <div>Error loading data</div>;

  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-6xl mx-auto bg-white shadow-xl min-h-screen flex flex-col">
      <Header 
        title={data.siteTitle} 
        logo={data.siteLogo} 
        established={data.collegeInfo?.established || "1970"}
        location={data.collegeInfo?.location || "Mymensingh, Bangladesh"}
      />
      <Navbar pages={data.pages} />
      <Ticker items={data.tickerItems || []} />
      {children}
      <Footer siteTitle={data.siteTitle} info={data.collegeInfo || {}} />
    </div>
  );

  const DynamicPage = ({ pageKey: propPageKey }: { pageKey?: string }) => {
    const { pageId, subPageId } = useParams();
    const activeKey = propPageKey || pageId;
    
    let page = data.pages?.[activeKey as string];
    if (subPageId && page?.subPages) {
      page = page.subPages[subPageId];
    }
    
    if (!page) {
      page = { title: "Not Found", content: "The requested page does not exist." };
    }
    
    const renderContent = (content: string) => {
      return content.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('📄') || trimmedLine.startsWith('📸') || trimmedLine.startsWith('🎓')) {
          return <h3 key={index} className="text-xl font-bold text-green-700 mt-8 mb-4 flex items-center gap-2">{line}</h3>;
        }
        if (trimmedLine.startsWith('✔') || trimmedLine.startsWith('•')) {
          return (
            <div key={index} className="flex items-start gap-3 mb-2 ml-4">
              <span className="text-green-600 mt-1 shrink-0">{trimmedLine.startsWith('✔') ? '✔' : '•'}</span>
              <span className="text-gray-700">{trimmedLine.substring(1).trim()}</span>
            </div>
          );
        }
        if (trimmedLine.includes('GPA')) {
          const [label, value] = trimmedLine.split(':').map(s => s.trim());
          if (value) {
            return (
              <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg mb-2 border border-green-100">
                <span className="font-bold text-green-800">{label}</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">{value}</span>
              </div>
            );
          }
        }
        if (trimmedLine === '') return <div key={index} className="h-4" />;
        return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{line}</p>;
      });
    };

    return (
      <PageLayout>
        {/* Page Header/Banner */}
        <div className="bg-green-800 text-white py-12 px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-green-200 text-sm mb-4 font-bold uppercase tracking-widest">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">{page.title}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {page.title}
            </h2>
          </div>
        </div>

        <div className="p-8 md:p-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-green max-w-none">
              {renderContent(page.content)}
            </div>
            
            {/* Decorative Footer for Content */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
              <p>© {new Date().getFullYear()} {data.siteTitle}</p>
              <div className="flex gap-4">
                <button onClick={() => window.print()} className="hover:text-green-700 font-bold">Print Page</button>
                <span>|</span>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="hover:text-green-700 font-bold">Share Link</button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <Routes>
          <Route
            path="/"
            element={
              <PageLayout>
                <Banner images={data.bannerImages} />
                <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <PrincipalMessage principal={data.principal} />
                  </div>
                  <div className="space-y-8">
                    <Sidebar title="নোটিশ বোর্ড" items={data.notices} type="notice" />
                    <Sidebar title="গুরুত্বপূর্ণ লিঙ্ক" items={data.importantLinks} type="link" />
                  </div>
                </main>
              </PageLayout>
            }
          />
          <Route path="/about" element={<DynamicPage pageKey="about" />} />
          <Route path="/administration" element={<DynamicPage pageKey="administration" />} />
          <Route path="/academic" element={<DynamicPage pageKey="academic" />} />
          <Route path="/facilities" element={<DynamicPage pageKey="facilities" />} />
          <Route path="/admission" element={<DynamicPage pageKey="admission" />} />
          <Route path="/results" element={<DynamicPage pageKey="results" />} />
          <Route path="/notices" element={<DynamicPage pageKey="notices" />} />
          <Route path="/gallery" element={<DynamicPage pageKey="gallery" />} />
          <Route path="/contact" element={<DynamicPage pageKey="contact" />} />
          <Route path="/page/:pageId" element={<DynamicPage />} />
          <Route path="/page/:pageId/:subPageId" element={<DynamicPage />} />
          
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminPanel initialData={data} onUpdate={setData} onLogout={() => {
                  localStorage.removeItem("admin_auth");
                  setIsAuthenticated(false);
                }} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

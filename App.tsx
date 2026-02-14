
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SubmitPage from './pages/SubmitPage';
import PublishedPage from './pages/PublishedPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold tracking-tight">
              SafetyVoice <span className="text-slate-400 font-light">UK</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <Link to="/submit" className="hover:text-slate-300 transition-colors">Submit Experience</Link>
            <Link to="/published" className="hover:text-slate-300 transition-colors">Published Stories</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">About</Link>
            {isAdmin && <Link to="/admin/dashboard" className="text-amber-400">Admin</Link>}
          </div>
          <div className="md:hidden">
             {/* Simple mobile menu could go here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-100 border-t border-slate-200 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-4">Project Window</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            SafetyVoice UK (safetyvoice.org.uk)<br/>
            Active Phase: <strong>2026 — 2029</strong>.<br/>
            Documenting UK laboratory culture through the lens of EDI and safety enforcement.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-4">Legal & Governance</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/about" className="hover:underline">Governance & UKRI Alignment</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy & 10-Year Archiving</Link></li>
            <li><Link to="/admin" className="hover:underline">Administrative Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-4">Data Preservation</h3>
          <p className="text-xs text-slate-500 italic leading-relaxed">
            In line with UK research governance (RDM), all project data are securely preserved and archived for 10 years following the 2029 completion date.
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <p>&copy; 2026 — 2029 SafetyVoice UK Research Initiative.</p>
        <p>UKRI Principles • UK GDPR Compliant • Institutional Integrity</p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/published" element={<PublishedPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;

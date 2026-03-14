import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { SettingsPage } from '../pages/SettingsPage';
import { HistoryPage } from '../pages/HistoryPage';
import { SessionDetailPage } from '../pages/SessionDetailPage';
import { SystemPage } from '../pages/SystemPage';
import { useI18n } from '../i18n';

const navLinkBase =
  'rounded-full border border-cyan-300/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300';

export function AppRouter() {
  const t = useI18n();

  return (
    <BrowserRouter>
      <div className="shell">
        <header className="topbar border-cyan-300/30 bg-slate-950/70 shadow-neon backdrop-blur-xl">
          <div className="brand bg-gradient-to-r from-aurora-500 to-aurora-400 bg-clip-text text-transparent">AUREA</div>
          <nav className="nav flex-wrap">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? 'border-cyan-200/80 bg-cyan-400/20 text-cyan-100 shadow-neon' : 'text-cyan-200/80 hover:border-cyan-200/60 hover:bg-cyan-400/10 hover:text-cyan-50'}`
              }
            >
              {t.dashboard}
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? 'border-cyan-200/80 bg-cyan-400/20 text-cyan-100 shadow-neon' : 'text-cyan-200/80 hover:border-cyan-200/60 hover:bg-cyan-400/10 hover:text-cyan-50'}`
              }
            >
              {t.settings}
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? 'border-cyan-200/80 bg-cyan-400/20 text-cyan-100 shadow-neon' : 'text-cyan-200/80 hover:border-cyan-200/60 hover:bg-cyan-400/10 hover:text-cyan-50'}`
              }
            >
              {t.history}
            </NavLink>
            <NavLink
              to="/system"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? 'border-cyan-200/80 bg-cyan-400/20 text-cyan-100 shadow-neon' : 'text-cyan-200/80 hover:border-cyan-200/60 hover:bg-cyan-400/10 hover:text-cyan-50'}`
              }
            >
              {t.system}
            </NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<SessionDetailPage />} />
          <Route path="/system" element={<SystemPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { SettingsPage } from '../pages/SettingsPage';
import { HistoryPage } from '../pages/HistoryPage';
import { SessionDetailPage } from '../pages/SessionDetailPage';
import { SystemPage } from '../pages/SystemPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="shell">
        <header className="topbar">
          <div className="brand">AUREA</div>
          <nav className="nav">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/settings">Settings</NavLink>
            <NavLink to="/history">History</NavLink>
            <NavLink to="/system">System</NavLink>
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

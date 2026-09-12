
import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import ProfileDropdown from '../ProfileDropdown';
import { Outlet, useLocation } from 'react-router-dom';

import '../../pages/DashboardAdmin/DashboardAdmin.css';

const LayoutAdmin = () => {
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const location = useLocation();

  // Extract section name for breadcrumb
  const pathParts = location.pathname.split('/').filter(Boolean);
  const section = pathParts.length > 2 ? pathParts[2] : 'Dashboard';
  const capitalizedSection = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <main className={dashboard-main } style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Sidebar isPinned={isSidebarPinned} onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)} />

      <div className="dashboard-contenido" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: 0 }}>
        {/* BARRA SUPERIOR */}
        <div className="dashboard-barra-superior" style={{ padding: '0 28px', height: '56px', borderBottom: '1px solid #e2e8f0', background: 'rgba(240, 244, 248, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            <span style={{ color: '#0f172a' }}>Orbix</span> /{' '}
            <span style={{ color: '#0f172a' }}>Admin</span> /{' '}
            <span style={{ color: '#0ea5e9' }}>{capitalizedSection}</span>
          </p>

          <div className="dashboard-acciones-superiores" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <form className="dashboard-buscar" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Buscar..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '150px' }} />
            </form>

            <div className="dashboard-notifi" style={{ position: 'relative', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />
            </div>

            <ProfileDropdown />
          </div>
        </div>

        {/* CONTENIDO (Outlet) */}
        <div style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default LayoutAdmin;


import { useState, useEffect, useRef } from 'react';
import { X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

interface ProfileData {
  idUsuario: string;
  nombre: string;
  correo: string;
  rol: string;
  identificacion?: string;
  correoPersonal?: string;
  direccion?: string;
  celular?: string;
  fechaNacimiento?: string;
  fechaIngreso?: string;
}

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:3000/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = () => {
    if (!isOpen && !profileData) {
      fetchProfile();
    }
    setIsOpen(!isOpen);
  };

  const handleOpenAccount = () => {
    setIsModalOpen(true);
    setIsOpen(false);
    if (!profileData) fetchProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login/opera'); // or admin depending on role, but we hardcode for now
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const fallbackUserStr = localStorage.getItem('usuario');
  const fallbackUser = fallbackUserStr ? JSON.parse(fallbackUserStr) : { nombre: 'Usuario', correo: '' };
  
  const displayData = profileData || fallbackUser;
  const initials = getInitials(displayData.nombre);

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <div 
        className={`avatar-trigger ${isOpen ? 'open' : ''}`} 
        onClick={handleToggle}
      >
        {initials}
      </div>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-avatar">{initials}</div>
            <div className="profile-dropdown-info">
              <h4 className="profile-dropdown-name">{displayData.nombre}</h4>
              <p className="profile-dropdown-email">{displayData.correo}</p>
              <button className="profile-dropdown-link" onClick={handleOpenAccount}>Ver cuenta</button>
            </div>
          </div>
          
          <div className="profile-dropdown-footer">
            <button className="profile-dropdown-logout" onClick={handleLogout}>
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="cuenta-modal-overlay">
          <div className="cuenta-modal-content">
            <div className="cuenta-modal-header">
              <h3>Información del Empleado</h3>
              <button className="cuenta-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="cuenta-grid">
              <div className="cuenta-field">
                <label>Nombre completo</label>
                <span>{displayData.nombre || 'N/A'}</span>
              </div>
              <div className="cuenta-field">
                <label>Identificación</label>
                <span>{profileData?.identificacion || 'N/A'}</span>
              </div>
              <div className="cuenta-field">
                <label>Correo corporativo</label>
                <span>{displayData.correo || 'N/A'}</span>
              </div>
              <div className="cuenta-field">
                <label>Correo personal</label>
                <span>{profileData?.correoPersonal || 'N/A'}</span>
              </div>
              <div className="cuenta-field">
                <label>Celular</label>
                <span>{profileData?.celular || 'N/A'}</span>
              </div>
              <div className="cuenta-field">
                <label>Dirección</label>
                <span>{profileData?.direccion || 'N/A'}</span>
              </div>
              <div className="cuenta-field">
                <label>Fecha de nacimiento</label>
                <span>{profileData?.fechaNacimiento ? new Date(profileData.fechaNacimiento).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="cuenta-field">
                <label>Fecha de ingreso a la empresa</label>
                <span>{profileData?.fechaIngreso ? new Date(profileData.fechaIngreso).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

import { useState } from 'react';
import {
  Home,
  Users,
  ShieldCheck,
  Settings,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import './SideBar.css';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  hasChildren?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Accueil', icon: Home },
  { label: 'Opérations clientèle', icon: Users, hasChildren: true },
  { label: 'Habilitations', icon: ShieldCheck, hasChildren: true },
  { label: 'Administration', icon: Settings, hasChildren: true },
  { label: 'Pilotage', icon: BarChart3, hasChildren: true },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Accueil');

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {menuItems.map(({ label, icon: Icon, hasChildren }) => {
            const isActive = active === label;
            return (
              <li key={label} className="sidebar__item">
                <button
                  onClick={() => setActive(label)}
                  className={`sidebar__button ${isActive ? 'sidebar__button--active' : ''}`}
                >
                  <Icon size={18} className="sidebar__icon" />
                  {!collapsed && (
                    <>
                      <span className="sidebar__label">{label}</span>
                      {hasChildren && <ChevronRight size={14} className="sidebar__chevron" />}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar__resources">
          <p className="sidebar__resources-title">Ressources</p>
          <p className="sidebar__resources-text">
            Ajoutez des raccourcis avec l'étoile ☆
          </p>
        </div>
      )}

      <div className="sidebar__footer">
        <button className="sidebar__footer-button" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Réduire le menu</span>}
        </button>
        {!collapsed && (
          <button className="sidebar__footer-button">
            <X size={14} />
            <span>Fermer</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
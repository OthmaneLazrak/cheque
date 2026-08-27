import './NavBar.css';
import logo from '../assets/logo_atw.jpg';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';



function NavBar() {
    const [search, setSearch] = useState("");

  return (
    <header className="navbar">
      <div className="navbar-marque">
        {/* Remplacer par : <img src="/logo.svg" alt="Attijariwafa Bank" /> */}
        <img src={logo} alt="Attijariwafa Bank" />
        <span className="navbar-nom">Borj Client Centric Agency</span>
      </div>

      <div className="search-container">
          <Search size={18} />

        <input
        type='text'
        placeholder='Rechercher ...'
        value={search}

        />
      </div>

      <div className="navbar-agent">
        <span className="navbar-agence">Agence 0142</span>
        <span className="navbar-initiales">BR</span>
      </div>
    </header>
  );
}

export default NavBar;
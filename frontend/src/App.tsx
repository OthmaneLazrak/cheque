import VerificationSignature from './pages/VerificationSignature';
import NavBar from './components/NavBar';
import Sidebar from './components/SideBar';
import './App.css';
const App = () => (
   <div className="app-layout">
    <NavBar />
    <div className="app-body">
      <Sidebar />
      <main className="app-content">
        <VerificationSignature />
      </main>
    </div>
  </div>
);

export default App;
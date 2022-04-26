import './App.scss';
import { Route, Routes } from 'react-router-dom'
import ConnexionPage from './Pages/ConnexionPage'
import DashboardPage from './Pages/DashboardPage'
import ClientsPage from './Pages/ClientsPage'
import AjouterClientPage from './Pages/AjouterClientPage'
import AjouterComptePage from './Pages/AjouterComptePage'
import ComptesNetflix from './Pages/ComptesPage'
import ListeDesComptesPage from  './Pages/ListeComptePage'
import StatistiquePage from './Pages/StatistiquePage'
import ProfilePage from './Pages/ProfilePage'
import AbonnementsPage from "./Pages/AbonnementsPage"
import DetailAbonnementPage from "./Pages/DetailAbonnementPage"
import DetailClientPage from "./Pages/DetailClientPage"
import DetailComptePage from "./Pages/DetailComptePage"



function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnexionPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/ajouter-client" element={<AjouterClientPage />} />
      <Route path="/comptes-netflix" element={<ComptesNetflix />} />
      <Route path="/ajouter-compte-netflix" element={<AjouterComptePage />} />
      <Route path="/liste-des-comptes-netflix" element={<ListeDesComptesPage />} />
      <Route path="/statistiques" element={<StatistiquePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/abonnements" element={<AbonnementsPage />} />
      <Route path="/abonnements/:id" element={<DetailAbonnementPage />} />
      <Route path="/clients/:id" element={<DetailClientPage />} />
      <Route path="/comptes/:id" element={<DetailComptePage />} />
    </Routes>
  );
}

export default App;

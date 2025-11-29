import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Scan } from './pages/Scan';
import { ARIntro } from './pages/ARIntro';
import { QuestPlayer } from './pages/QuestPlayer';
import { Help } from './pages/Help';
import { Badges } from './pages/Badges';
import { Library } from './pages/Library';
import { Decoy } from './pages/Decoy';
import { Resume } from './pages/Resume';
import { Settings } from './pages/Settings';
import { ReportThreat } from './components/ReportThreat';
import { UserProfileComponent } from './components/UserProfile';
import { NavBar } from './components/NavBar';
import { PanicButton } from './components/PanicButton';

function App() {
  return (
    <>
      <PanicButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/ar/:questId" element={<ARIntro />} />
        <Route path="/quest/:questId" element={<QuestPlayer />} />
        <Route path="/help" element={<Help />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/library" element={<Library />} />
        <Route path="/decoy" element={<Decoy />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/report" element={<ReportThreat />} />
        <Route path="/profile" element={<UserProfileComponent />} />
      </Routes>
      <NavBar />
    </>
  );
}

export default App;

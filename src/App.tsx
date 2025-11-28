import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Scan } from './pages/Scan';
import { ARIntro } from './pages/ARIntro';
import { QuestPlayer } from './pages/QuestPlayer';
import { Help } from './pages/Help';
import { Badges } from './pages/Badges';
import { Library } from './pages/Library';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/ar/:questId" element={<ARIntro />} />
      <Route path="/quest/:questId" element={<QuestPlayer />} />
      <Route path="/help" element={<Help />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="/library" element={<Library />} />
    </Routes>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnaliticsPage from '../pages/AnaliticsPage/AnaliticsPage';
import GeneratorPage from '../pages/GeneratorPage/GeneratorPage';
import HistoryPage from '../pages/HistoryPage/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnaliticsPage />} />
        <Route path="/generation" element={<GeneratorPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnaliticsPage from '../pages/AnaliticsPage/AnaliticsPage';
import GeneratorPage from '../pages/GeneratorPage/GeneratorPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnaliticsPage />} />
        <Route path="/generation" element={<GeneratorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

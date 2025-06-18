import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnaliticsPage from '../pages/AnaliticsPage/AnaliticsPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnaliticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import './App.css';
import React from 'react';

import Affine from './pages/Affine/Affine';
import Menu from './pages/Menu';

import { Route, Routes, HashRouter } from 'react-router-dom';

function App() {
  
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Menu />}/>
        <Route path="/affine" element={<Affine />} />
      </Routes>
    </HashRouter>
  );
}


export default App;

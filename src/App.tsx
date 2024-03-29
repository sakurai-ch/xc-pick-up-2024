import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { AppBar, Box, Toolbar } from '@mui/material';
import InfoForHeadquarters from './components/InfoForHeadquarters';
import InfoForDriver from './components/InfoForDriver';
import InfoForPlayer from './components/InfoForPlayer';

function App() {
  return (
    <>
      <AppBar 
        position="fixed"
        sx={{ bgcolor: 'tan', color: 'black'}}
      >
        <Toolbar>
          {/* <h2>2024 どじからす</h2> */}
          <h2>2024 スカイグランプリ</h2>
        </Toolbar>
      </AppBar>
      <Box mt={12} mx={2}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/headquarters" element={<InfoForHeadquarters />} />
            <Route path="/driver/:id" element={<InfoForDriver />} />
            <Route path="/player" element={<InfoForPlayer />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </>
  );
}

export default App;

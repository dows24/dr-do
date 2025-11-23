import React, { useState } from 'react';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Expertise from './components/Expertise';
import QnA from './components/QnA';
import Footer from './components/Footer';
import CheckUpModal from './components/CheckUpModal';

function App() {
  const [isCheckUpOpen, setIsCheckUpOpen] = useState(false);

  return (
    <div className="App">
      <Hero onOpenCheckUp={() => setIsCheckUpOpen(true)} />
      <Profile />
      <Expertise />
      <QnA />
      <Footer />
      <CheckUpModal isOpen={isCheckUpOpen} onClose={() => setIsCheckUpOpen(false)} />
    </div>
  );
}

export default App;

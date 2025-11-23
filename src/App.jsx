import React from 'react';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Expertise from './components/Expertise';
import QnA from './components/QnA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Hero />
      <Profile />
      <Expertise />
      <QnA />
      <Footer />
    </div>
  );
}

export default App;

// HomePage.js
import React, { useEffect, useState } from 'react';

import TweetFeed from '../component/TweetFeed';
import TopBar from '../component/TopBar';

const HomePage: React.FC = () => {


  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar />
      </div>
      <main className="flex-grow overflow-y-auto">
        <TweetFeed />
      </main>
    </div>
  );
};

export default HomePage;

// HomePage.js
import React from 'react';

import TweetFeed from '../component/tweet/TweetFeed';
import TopBar from '../component/bar/TopBar';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page='' />
      </div>
      <main className="flex-grow overflow-y-scroll scroll-container">
        <TweetFeed />
      </main>
    </div>
  );
};
export default HomePage;

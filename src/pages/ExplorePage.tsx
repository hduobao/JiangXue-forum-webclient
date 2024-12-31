import { useState } from "react";
import { useLocation } from 'react-router-dom';
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";

const ExplorePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const { account } = location.state || {};

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page={account} />
      </div>
      <main className="flex-grow overflow-y-auto scroll-container">
        {loading ? <Loader /> : <div></div>}
      </main>
    </div>
  );
};

export default ExplorePage;

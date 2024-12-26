import { useState } from "react";
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";

const NotificationPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page="通知" />
      </div>
      <main className="flex-grow overflow-y-auto">
        {loading ? <Loader /> : <div></div>}
      </main>
    </div>
  );
};

export default NotificationPage;

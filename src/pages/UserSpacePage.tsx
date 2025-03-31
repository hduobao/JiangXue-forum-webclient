import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Instance from "../interceptors/auth_interceptor";
import { UserBaseInfo } from "../types/UserModel";
import TopBar from "../component/bar/TopBar";
import UserSpaceInfoCard from "../component/profile/UserSpaceInfoCard";
import Loader from "../component/common/Loader";

const UserProfile: React.FC = () => {
  const instance = Instance();
  const { authorID } = useParams<{ authorID?: string }>();
  const [userInfo, setUserInfo] = useState<UserBaseInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const endpoint = authorID
          ? `/api/users/${authorID}/info`
          : "/api/me/info";
        const response = await instance.get(endpoint);
        setUserInfo(response.data.data);
        setLoading(true);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [authorID]);

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page={userInfo?.username || "loading..."} />
      </div>
      <main className="flex-grow overflow-y-auto scroll-container">
        {loading || userInfo === null ? (
          <Loader />
        ) : (
          <UserSpaceInfoCard userInfo={userInfo} isOwnProfile={!authorID} />
        )}
      </main>
    </div>
  );
};

export default UserProfile;

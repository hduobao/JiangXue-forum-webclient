// HomePage.js
import React, { useEffect, useState } from "react";

import TweetFeed from "../component/tweet/TweetFeed";
import TopBar from "../component/bar/TopBar";
import Instance from "../interceptors/auth_interceptor";
import { ListTweetVo } from "../types/TweetModel";
import BackTopButton from "../component/button/BackTopButton";
import Loader from "../component/common/Loader";

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recommendations"); // 初始化标签状态
  const instance = Instance();
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchTweets = async () => {
      try {
        const offset = 1;
        const limit = 10;
        const response = await instance.get(`/api/tweets`, {
          params: { offset, limit, tab: activeTab },
        });
        setTweets(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();

    const scrollContainer = document.querySelector(".scroll-container");
    console.log("doc:", scrollContainer);
    if (!scrollContainer) return;
    const handleScroll = () => {
      console.log("aa:", scrollContainer.scrollTop);
      if (scrollContainer.scrollTop > 200) {
        setShowBackTopButton(true);
      } else {
        setShowBackTopButton(false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab]);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page="" activeTab={activeTab} setActiveTab={setActiveTab} />{" "}
        {/* 传递 activeTab */}
      </div>
      <main className="flex-grow overflow-y-scroll scroll-container">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex justify-center">
            <TweetFeed tweets={tweets} />
            {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
          </div>
        )}
      </main>
    </div>
  );
};
export default HomePage;

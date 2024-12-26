import { useEffect, useRef, useState } from "react";
import Instance from "../../interceptors/auth_interceptor";
import { ForumVo } from "../../types/ForumModel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";


const ForumButtonBar: React.FC = () => {

    const instance = Instance();
    const [loading, setLoading] = useState<boolean>(true);
    const [forums, setForums] = useState<ForumVo[]>([]);
    const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
    const [showRightArrow, setShowRightArrow] = useState<boolean>(false);
    const [hovering, setHovering] = useState<boolean>(false); // 鼠标悬浮状态
    const scrollContainerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const fetchForum = async () => {
        try {
          const response = await instance.get("/api/forum/list");
          setForums(response.data.data);
        } catch (error) {
          // Handle error (you may want to display an error message)
        } finally {
          setLoading(false);
        }
      };
      fetchForum();
    }, []);
  
    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        setShowLeftArrow(scrollLeft > 0); // 显示左箭头
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth); // 显示右箭头
      }
    };
  
    const scrollLeft = () => {
      scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    };
  
    const scrollRight = () => {
      scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    };
  
    useEffect(() => {
      handleScroll();
    }, [forums]);

    return (
        <div
        className="relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* 左箭头 */}
        {hovering && showLeftArrow && (
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-blue-500 rounded-full shadow-md hover:bg-sky-400"
            onClick={scrollLeft}
          >
            <IconArrowLeft size={24} />
          </button>
        )}

        {/* 滚动容器 */}
        <div
          ref={scrollContainerRef}
          className="flex w-full max-w-3xl px-4 space-x-4 p-4 overflow-x-auto scroll-container justify-start items-center relative"
          onScroll={handleScroll}
        >
          {forums.map((forum) => (
            <div key={forum.id} className="flex-shrink-0">
              <button
                className="px-5 z-30 py-2 bg-blue-500 rounded-full text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 
                        after:bg-sky-400 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-full after:hover:scale-[300] 
                        after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700 
                        text-lg"
              >
                {forum.title}
              </button>
            </div>
          ))}
        </div>

        {/* 右箭头 */}
        {hovering && showRightArrow && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-blue-500 rounded-full shadow-md hover:bg-sky-400"
            onClick={scrollRight}
          >
            <IconArrowRight size={24} />
          </button>
        )}
      </div>
    );
}

export default ForumButtonBar;
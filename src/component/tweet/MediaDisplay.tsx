// MediaDisplay.tsx
import React, { useEffect, useRef } from "react";

interface MediaDisplayProps {
  media: string[];
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ media }) => {
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  // 自动播放/暂停视频：当视频进入/离开视口时
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch((error) =>
              console.error("Error playing video:", error)
            );
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.75 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [media]);

  if (!media || media.length === 0) return null;

  // 判断是否为视频资源
  const isVideoMedia = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      return (
        parsedUrl.pathname.includes(".mp4") ||
        parsedUrl.pathname.includes(".webm")
      );
    } catch (e) {
      return false;
    }
  };

  // 单一媒体时：采用 object-contain 避免拉伸
  if (media.length === 1) {
    const url = media[0];
    const isVideo = isVideoMedia(url);
    return (
      <div className="mt-3">
        {isVideo ? (
          <video
            ref={(el) => {
              if (el) videoRefs.current[0] = el;
            }}
            controls
            loop
            className="w-full max-h-[75vh] rounded-lg object-cover"
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={url}
            alt="Media"
            className="w-full max-h-[75vh] rounded-lg object-contain"
          />
        )}
      </div>
    );
  }

  // 多个媒体时：采用网格布局
  const count = media.length;
  let gridClass = "grid gap-2";
  if (count === 2) {
    gridClass += " grid-cols-2";
  } else if (count === 3 || count === 4) {
    gridClass += " grid-cols-2 grid-rows-2";
  } else {
    gridClass += " grid-cols-2";
  }

  return (
    <div className={`mt-3 ${gridClass}`}>
      {media.map((url, index) => {
        const isVideo = isVideoMedia(url);
        return isVideo ? (
          <div
            key={index}
            className={`relative ${
              count === 2
                ? "h-64"
                : count === 3 && index === 0
                ? "row-span-2 h-full"
                : "h-64"
            }`}
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
              }}
              controls
              loop
              className="w-full h-full rounded-lg object-cover"
            >
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div
            key={index}
            className={`relative ${
              count === 2
                ? "h-64"
                : count === 3 && index === 0
                ? "row-span-2 h-full"
                : "h-64"
            }`}
          >
            <img
              src={url}
              alt={`Media ${index}`}
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        );
      })}
    </div>
  );
};

export default MediaDisplay;

// types.ts 或者其他文件
export interface InteractiveInfo {
  view_count: number;
  comment_count: number;
  like_count: number;
  favorite_count: number;
  is_like: boolean;
  is_favorite: boolean;
}

// ListTweetVo TypeScript interface
export interface ListTweetVo {
  id: number;
  title: string;
  content: string;
  account: string;
  author_id: number;
  author_avatar: string;
  author_name: string; 
  forum_id: number;
  is_essence: boolean;
  is_top: boolean;
  created_at: string;
  updated_at: string;
  images: string[];
  interactive_info: InteractiveInfo;
}


// TweetVo TypeScript interface
export interface TweetVo {
  id: number;
  title: string;
  content: string;
  account: string;
  author_id: number;
  author_name: string;
  author_avatar: string;
  forum_id: number;
  attachment: string;
  is_essence: boolean;
  is_top: boolean;
  created_at: string;
  updated_at: string;
  images: string[];
  interactive_info: InteractiveInfo;
}

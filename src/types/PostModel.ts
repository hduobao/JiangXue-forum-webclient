// types.ts 或者其他文件
export interface ListPostVo {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author_name: string;
    author_avatar: string;
    cover_image: string;
    forum_id: number;
    is_essence: boolean;
    is_top: boolean;
    view_count: string;
    comment_count: string;
    like_count: string;
    created_at: string;
    updated_at: string;
  }
  
export interface PostVo {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author_name: string;
    author_avatar: string;
    view_count: string;
    comment_count: string;
    like_count: string;
    created_at: string;
  }
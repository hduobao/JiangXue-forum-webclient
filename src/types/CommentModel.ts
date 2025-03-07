export interface CommentVO {
    id: number;
    tweet_id: number;
    user_id: number;
    user_avatar: string;
    content: string;
    parent_id?: number | null;
    created_at: string;  // ISO 时间字符串
    updated_at: string;  // ISO 时间字符串
    images: string[];   // OSS 文件 Key 数组
  }
  
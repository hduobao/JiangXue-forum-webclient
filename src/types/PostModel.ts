// types.ts 或者其他文件
// export interface ListPostVo {
//   id: number;
//   title: string;
//   content: string;
//   author_id: number;
//   author_name: string;
//   author_avatar: string;
//   cover_image: string;
//   forum_id: number;
//   is_essence: boolean;
//   is_top: boolean;
//   view_count: number;
//   comment_count: number;
//   like_count: number;
//   favorite_count: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface PostVo {
//   id: number;
//   title: string;
//   content: string;
//   author_id: number;
//   author_name: string;
//   author_avatar: string;
//   view_count: number;
//   comment_count: number;
//   like_count: number;
//   favorite_count: number;
//   created_at: string;
// }

// InteractiveInfo TypeScript interface
export interface InteractiveInfo {
  view_count: number;      // 对应 Go 的 view_count
  comment_count: number;   // 对应 Go 的 comment_count
  like_count: number;      // 对应 Go 的 like_count
  favorite_count: number;  // 对应 Go 的 favorite_count
  is_like: boolean;        // 对应 Go 的 is_like
  is_favorite: boolean;    // 对应 Go 的 is_favorite
}

// ListPostVo TypeScript interface
export interface ListPostVo {
  id: number;               // 对应 Go 的 id
  title: string;
  content: string;
  author_id: number;        // 对应 Go 的 author_id
  author_name: string;      // 对应 Go 的 author_name
  cover_image: string;      // 对应 Go 的 cover_image
  forum_id: number;         // 对应 Go 的 forum_id
  is_essence: boolean;      // 对应 Go 的 is_essence
  is_top: boolean;          // 对应 Go 的 is_top
  created_at: string;       // 对应 Go 的 created_at
  updated_at: string;       // 对应 Go 的 updated_at
  interactive_info: InteractiveInfo; // 对应 Go 的 interactive_info
}

// PostVo TypeScript interface
export interface PostVo {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name: string;
  author_avatar: string;
  forum_id: number;
  attachment: string;
  is_essence: boolean;
  is_top: boolean;
  created_at: string;
  updated_at: string;
  interactive_info: InteractiveInfo;
}

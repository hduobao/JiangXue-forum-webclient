export interface SidebarProps {
    avatar: string;
    username: string;
}

export interface UserBaseInfo {
    id: number;
    username: string;
    account: string;
    avatar: string;
    created_at: string;
    email: string;
    phone_number: string;
    bio: string;
    birthday: string;
    gender: number;
    location: string;
    reputation: number;
    last_login: string;
}

export interface UserFollows {
    id: number;
    avatar: string;
    username: string;
    bio: string;
}

export interface UserFans {
    id: number;
    avatar: string;
    username: string;
    bio: string;
    mutual_follow: boolean;
    interaction_count: number;
}
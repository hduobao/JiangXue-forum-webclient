export interface BrowsingHistory {
    content_id: string;
    tab: string;
    visited_at: string;
    visit_duration: number;
    device: string;
    browser: {
        name: string;
        version: string;
    };
    ip_address: string;
}
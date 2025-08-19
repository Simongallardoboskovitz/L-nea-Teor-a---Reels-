
export interface Scene {
    sceneNumber: string;
    script: string;
    visuals: string;
    guide: string;
}

export interface DescriptionResponse {
    summary: string;
    key_points: string[];
    hashtags: string[];
}

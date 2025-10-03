export type MetricFormat = "reels" | "carousel" | "static-photo" | "live";

export interface MetricTable {
  id: string;
  format: MetricFormat;
  duration?: number; // for reels/live/video
  quantity?: number; // for carousel
  title: string;
  postDate: string;
  reach: number;
  saves: number;
  shares: number;
  likes: number;
  comments: number;
  reposts: number;
  linkClicks: number;
  // Auto-calculated fields
  engagement: number; // in percentage
  ctr: number; // in percentage
  createdAt: string;
  updatedAt: string;
}

export interface CreateMetricData {
  format: MetricFormat;
  duration?: number;
  quantity?: number;
  title: string;
  postDate: string;
  reach: number;
  saves: number;
  shares: number;
  likes: number;
  comments: number;
  reposts: number;
  linkClicks: number;
}

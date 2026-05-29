export type BaseRow = {
  id: string | number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type Post = BaseRow & {
  _status?: string;
  author_id?: string | number | null;
  category_id?: string | number | null;
  content?: string;
  excerpt?: string;
  featured_image_id?: string | number | null;
  html_content?: string;
  pinned?: boolean;
  published_at?: string;
  reading_time?: number;
  slug?: string;
  status?: string;
  title?: string;
  view_count?: number;
};

export type Category = BaseRow & {
  description?: string;
  name?: string;
  slug?: string;
  type?: string;
};

export type Media = BaseRow & {
  alt?: string;
  caption?: string;
  filename?: string;
  filesize?: number;
  height?: number;
  mime_type?: string;
  thumbnail_url?: string;
  url?: string;
  width?: number;
};

export type Dinosaur = BaseRow & {
  description?: string;
  name?: string;
  rarity?: string;
  slug?: string;
};

export type Package = BaseRow & {
  active?: boolean;
  name?: string;
  price?: number;
  slug?: string;
};

export type Event = BaseRow & {
  description?: string;
  event_end_date?: string;
  event_start_date?: string;
  location_name?: string;
  slug?: string;
  status?: string;
  title?: string;
};

export type Banner = BaseRow & {
  active?: boolean;
  image_id?: string | number | null;
  position?: string;
  title?: string;
};

export type SiteSettings = {
  id?: string | number;
  game_name?: string;
  site_description?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type Page = BaseRow & {
  content?: string;
  html_content?: string;
  slug?: string;
  status?: string;
  title?: string;
};

export type PatchNote = BaseRow & {
  content?: string;
  published_at?: string;
  slug?: string;
  title?: string;
  version?: string;
};

export type ServerStatus = BaseRow & {
  message?: string;
  server_name?: string;
  status?: string;
};

export type Popup = BaseRow & {
  active?: boolean;
  content?: unknown;
  cta_link?: string;
  cta_text?: string;
  delay?: number;
  end_date?: string;
  image_id?: string | number | null;
  show_once?: boolean;
  start_date?: string;
  title?: string;
  trigger?: string;
};

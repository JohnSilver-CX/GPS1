
export type PageId = 'home' | 'about' | 'academics' | 'facilities' | 'activities' | 'gallery' | 'contact' | 'faq';

export interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

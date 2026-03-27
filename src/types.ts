export type Category = 'clothes' | 'glasses' | 'necklaces' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: Category;
  image: string;
  description: string;
  price: number;
}

export interface TryOnState {
  status: 'idle' | 'capturing' | 'processing' | 'success' | 'error';
  userImage?: string;
  resultImage?: string;
  recommendation?: string;
  error?: string;
}

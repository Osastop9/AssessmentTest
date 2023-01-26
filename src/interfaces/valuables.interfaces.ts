export interface Valuable {
    id?: string;
    name: string;
    category: 'art' | 'electronics' | 'jewelry' | 'musical instruments';
    price: number;
    description?: string;
    photo: string;
}
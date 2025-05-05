import { Category } from "./Category";
import { User } from "./User";

export interface Book {
    id: number;
    uuid: string
    title: string;
    content: string;
    image: string;
    category: string;
    categoryData: any;
    seriesName: string;
    author: User;
    createdBy: User;
    details: BookDetails;
    isPublished: boolean;
    url: string;
    createdAt: string;
}

export interface BookDetails {
    id: number;
    lastUpdated: string;
    likes: number[];
    save: number[];
    readCount: number[];
    readPercent?: string;
}

export interface SaveRequestParams {
    id?: number;
    uuid?: string;
    image?: string | null;
    title: string; 
    category: Category; 
    author: User;
    content: string;
    tags: string[];
    seriesName: string
}

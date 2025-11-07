export interface CategoryInterface {
    id: number;
    name: string;
    label: string;
}

export interface UserInterface {
    id: number;
    uuid: string;
    fullName: string;
    image: string;
    totalBooks: number;
    totalReads: number;
    series: string[];
}

export interface BookInterface {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    categories: CategoryInterface[];
}


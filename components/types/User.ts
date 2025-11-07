import { Book } from "./Book";

export interface User {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  roles: string[];
  series: string[];
  totalBooks: number;
  totalReads: number;
  books: Book[];
  libraryBooks: Book[];
  details: UserDetails;
  url: string;
  phone?: string;
  image: string;
}

interface UserDetails {
  id: string;
  description: string;
}
import { Book } from "./Book";

export interface User {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  roles: string[];
  series: any[];
  totalBooks: number;
  totalReads: number;
  libraryBooks: Book[];
  details: UserDetails;
  url: string;
  phone?: string;
  image: string;
  profileImage?: string;
  description?: string;
  followerCount?: number;
  followingCount?: number;
  reviewCount?: number;
}

interface UserDetails {
  id: string;
  description: string;
  socials: any[];
}

export interface AuthUser extends User {
  recentActivities: any[];
  activities: any[];
  reviews: any[];
  followers: User[];
  following: User[];
  libraryBooks: Book[];
  recommendedBooks: Book[];
}

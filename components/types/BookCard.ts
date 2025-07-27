export interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; image: string; fullName: string };
  createdBy: { id: number; fullName: string; image: string, roles: string[] };
  category: { label: string }|string;
  url: string;
}
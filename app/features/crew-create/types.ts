export interface CreateCrewFormData {
  title: string;
  image: string;
  imageFile: File | null;
  category: string;
  maxMembers: number;
  location: string;
  date: string;
  description: string;
}


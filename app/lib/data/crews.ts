export interface Crew {
  id: string | number;
  image: string;
  category: string;
  title: string;
  location: string;
  date: string;
  members: number;
  maxMembers: number;
}

export const allCrews: Crew[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
    category: "전시",
    title: "현대미술관 기획전 함께 보기",
    location: "서울시 용산구",
    date: "2024.01.15 (토) 14:00",
    members: 8,
    maxMembers: 12,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4c7c6c?w=800",
    category: "카페",
    title: "한강 카페 투어 크루",
    location: "서울시 마포구",
    date: "2024.01.16 (일) 11:00",
    members: 5,
    maxMembers: 8,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    category: "공연",
    title: "재즈 라이브 콘서트",
    location: "서울시 강남구",
    date: "2024.01.20 (토) 19:00",
    members: 12,
    maxMembers: 15,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    category: "사진",
    title: "벚꽃 사진 크루",
    location: "서울시 종로구",
    date: "2024.04.10 (수) 10:00",
    members: 6,
    maxMembers: 10,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    category: "독서",
    title: "월간 독서 모임",
    location: "서울시 서초구",
    date: "2024.01.25 (목) 19:30",
    members: 9,
    maxMembers: 12,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    category: "맛집",
    title: "홍대 맛집 탐방 크루",
    location: "서울시 마포구",
    date: "2024.01.18 (목) 18:00",
    members: 7,
    maxMembers: 10,
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    category: "전시",
    title: "국립현대미술관 특별전",
    location: "서울시 종로구",
    date: "2024.01.22 (월) 15:00",
    members: 10,
    maxMembers: 15,
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    category: "카페",
    title: "강남 브런치 카페 투어",
    location: "서울시 강남구",
    date: "2024.01.19 (금) 12:00",
    members: 4,
    maxMembers: 8,
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    category: "공연",
    title: "인디 밴드 라이브",
    location: "서울시 홍대",
    date: "2024.01.21 (일) 20:00",
    members: 11,
    maxMembers: 20,
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "사진",
    title: "야경 사진 크루",
    location: "서울시 용산구",
    date: "2024.01.17 (수) 19:00",
    members: 8,
    maxMembers: 12,
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    category: "독서",
    title: "소설 독서 모임",
    location: "서울시 마포구",
    date: "2024.01.24 (수) 19:00",
    members: 6,
    maxMembers: 10,
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    category: "맛집",
    title: "이태원 맛집 탐방",
    location: "서울시 용산구",
    date: "2024.01.23 (화) 18:30",
    members: 9,
    maxMembers: 12,
  },
];


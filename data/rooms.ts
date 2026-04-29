export type RoomKind = "dog" | "cat";

export type Room = {
  id: string;
  name: string;
  kind: RoomKind;
  sizeSqm: number;
  capacity: number;
  pricePerNight: number;
  photoUrl: string;
  description: string;
  amenities: string[];
};

export const ROOMS: Room[] = [
  {
    id: "dog-suite-premium",
    name: "Сьют Премиум",
    kind: "dog",
    sizeSqm: 12,
    capacity: 2,
    pricePerNight: 8500,
    photoUrl: "/images/dog-bed.jpg",
    description:
      "Просторный номер с панорамным окном, ортопедической лежанкой и индивидуальным климат-контролем.",
    amenities: ["Видеонаблюдение", "Отдельная прогулка", "Уход 24/7"],
  },
  {
    id: "dog-suite-comfort",
    name: "Сьют Комфорт",
    kind: "dog",
    sizeSqm: 8,
    capacity: 1,
    pricePerNight: 6200,
    photoUrl: "/images/rooms-hero.jpg",
    description:
      "Уютное пространство для спокойного отдыха, игр и персональных прогулок.",
    amenities: ["Тихая зона", "Игровой час", "Фотоотчет"],
  },
  {
    id: "cat-apartment-loft",
    name: "Апартаменты Loft",
    kind: "cat",
    sizeSqm: 9,
    capacity: 2,
    pricePerNight: 5400,
    photoUrl: "/images/cat-window.jpg",
    description:
      "Многоуровневый номер с домиками, когтеточками и безопасным обзором на сад.",
    amenities: ["Игровой комплекс", "Тихий блок", "Феромон-поддержка"],
  },
];

export const getRoomById = (roomId: string) => ROOMS.find((room) => room.id === roomId);
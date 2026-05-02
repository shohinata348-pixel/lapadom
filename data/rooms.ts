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
    name: "Премиум сьют для собак",
    kind: "dog",
    sizeSqm: 9,
    capacity: 2,
    pricePerNight: 8500,
    photoUrl: "/images/dog-bed.jpg",
    description:
      "Просторный номер с панорамным окном, ортопедической лежанкой и индивидуальным климат-контролем.",
    amenities: ["Видеонаблюдение", "Отдельная прогулка", "Уход 24/7"],
  },
  {
    id: "dog-suite-comfort",
    name: "Комфортный сьют для собак",
    kind: "dog",
    sizeSqm: 6,
    capacity: 1,
    pricePerNight: 6200,
    photoUrl: "/images/rooms-hero.jpg",
    description:
      "Уютное пространство для спокойного отдыха, игр и персональных прогулок.",
    amenities: ["Тихая зона", "Игровой час", "Фотоотчет"],
  },
  {
    id: "cat-apartment-loft",
    name: "Лофт-апартаменты для кошек",
    kind: "cat",
    sizeSqm: 7,
    capacity: 2,
    pricePerNight: 5400,
    photoUrl: "/images/cat-window.jpg",
    description:
      "Многоуровневый номер с домиками, когтеточками и безопасным обзором на сад.",
    amenities: ["Игровой комплекс", "Тихий блок", "Феромон-поддержка"],
  },
  {
    id: "dog-villa-family",
    name: "Семейная вилла для собак",
    kind: "dog",
    sizeSqm: 10,
    capacity: 3,
    pricePerNight: 9800,
    photoUrl: "/images/room-cat-apartment-cozy.png",
    description:
      "Большой номер для двух питомцев и щенка с отдельной игровой зоной и мягким освещением.",
    amenities: ["Большая зона игр", "Индивидуальное меню", "Дневник активности"],
  },
  {
    id: "dog-room-junior",
    name: "Junior номер для собак",
    kind: "dog",
    sizeSqm: 5,
    capacity: 1,
    pricePerNight: 4900,
    photoUrl: "/images/room-cat-apartment-perch.png",
    description:
      "Компактный и спокойный номер для короткого размещения с персональным вниманием к режиму питомца.",
    amenities: ["Контроль питания", "Ежедневный груминг", "Фото 2 раза в день"],
  },
  {
    id: "cat-studio-sky",
    name: "Sky студия для кошек",
    kind: "cat",
    sizeSqm: 6,
    capacity: 2,
    pricePerNight: 5900,
    photoUrl: "/images/room-dog-suite-garden.png",
    description:
      "Светлый номер с полками у окна, тоннелями и отдельной зоной отдыха для кошек, любящих высоту.",
    amenities: ["Полки и тоннели", "Спooky музыка", "Игры с персоналом"],
  },
  {
    id: "cat-suite-zen",
    name: "Zen сьют для кошек",
    kind: "cat",
    sizeSqm: 8,
    capacity: 1,
    pricePerNight: 6700,
    photoUrl: "/images/room-dog-suite-warm.png",
    description:
      "Приватный номер для чувствительных кошек с мягким климатом и шумоизоляцией.",
    amenities: ["Шумоизоляция", "Арома-нейтральная среда", "Ночной мониторинг"],
  },
];

export const getRoomById = (roomId: string) => ROOMS.find((room) => room.id === roomId);

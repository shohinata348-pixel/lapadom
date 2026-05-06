import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-foreground py-20 text-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
          <Link href="/" className="mb-4 block font-serif text-3xl">
            ЛапаДом
          </Link>
            <p className="max-w-sm text-sm leading-relaxed text-background/70">
              Бутик-отель для собак и кошек в Элисте. Спокойное, безопасное и красивое место, где вашего питомца ждут как дорогого гостя.
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-xs uppercase tracking-wider text-background/70">Навигация</h4>
            <div className="space-y-3 text-sm text-background/70">
              <p><a href="#philosophy" className="hover:text-background">О нас</a></p>
              <p><a href="#spaces" className="hover:text-background">Номера</a></p>
              <p><a href="#services" className="hover:text-background">Услуги</a></p>
              <p><a href="#booking" className="hover:text-background">Бронирование</a></p>
            </div>
          </div>
          <div>
            <h4 className="mb-6 text-xs uppercase tracking-wider text-background/70">Контакты</h4>
            <div className="space-y-3 text-sm text-background/70">
              <p>Элиста</p>
              <p>+7 (495) 000-00-00</p>
              <p>hello@lapadom.ru</p>
              <p>Ежедневно, 09:00 - 21:00</p>
            </div>
          </div>
        </div>
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/40 md:flex-row">
          <p>© {new Date().getFullYear()} ЛапаДом. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background">Политика конфиденциальности</a>
            <a href="#" className="hover:text-background">Договор оферты</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
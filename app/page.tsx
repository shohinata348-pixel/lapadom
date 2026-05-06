import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative flex h-[90vh] items-center justify-center overflow-hidden bg-muted">
          <img src="/images/hero.jpg" alt="ЛапаДом" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />
          <div className="container relative z-10 mx-auto px-6 pt-24 text-center">
            <p className="mb-6 text-sm uppercase tracking-[0.2em] text-white/90">Премиальный отель для питомцев</p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-white md:text-7xl">Как дома, только лучше</h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/85">
              Красивое и спокойное пространство в центре Элисты, где вашего друга окружат заботой.
            </p>
            <Link href="/rooms" className="inline-flex h-12 items-center bg-primary px-8 text-sm uppercase tracking-wider text-primary-foreground">
              Выбрать номер
            </Link>
          </div>
        </section>

        <section id="philosophy" className="bg-background py-24 md:py-36">
          <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
            <div className="overflow-hidden bg-muted">
              <img src="/images/care.jpg" alt="Забота о питомце" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="mb-8 font-serif text-4xl leading-tight md:text-5xl">Мы создали место, где не страшно оставить друга</h2>
              <p className="mb-4 text-lg text-muted-foreground">
                В ЛапаДом нет клеток: только просторные комнаты, тишина, персональные прогулки и регулярные отчеты для владельца.
              </p>
              <p className="mb-8 text-lg text-muted-foreground">
                Мы учитываем привычный ритм питомца: питание, сон, активность и лекарства.
              </p>
              <a href="#services" className="text-sm uppercase tracking-wider text-primary">
                Подробнее о заботе &rarr;
              </a>
            </div>
          </div>
        </section>

        <section id="spaces" className="bg-muted py-24 md:py-36">
          <div className="container mx-auto px-6">
            <div className="mb-14 max-w-2xl">
              <span className="mb-5 block text-sm uppercase tracking-[0.2em] text-primary">Пространства</span>
              <h2 className="font-serif text-4xl leading-tight md:text-5xl">Свет, воздух и полная безопасность</h2>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <article>
                <div className="mb-6 aspect-[4/3] overflow-hidden bg-background">
                  <img src="/images/dog-bed.jpg" alt="Номер для собак" className="h-full w-full object-cover" />
                </div>
                <h3 className="mb-3 font-serif text-2xl">Сьюты для собак</h3>
                <p className="text-muted-foreground">Просторные комнаты от 6 до 12 м2 с окнами в пол и индивидуальным климат-контролем.</p>
              </article>
              <article>
                <div className="mb-6 aspect-[4/3] overflow-hidden bg-background">
                  <img src="/images/cat-window.jpg" alt="Номер для кошек" className="h-full w-full object-cover" />
                </div>
                <h3 className="mb-3 font-serif text-2xl">Апартаменты для кошек</h3>
                <p className="text-muted-foreground">Тихое крыло, панорамные окна, игровые комплексы и укрытия на высоте.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="services" className="bg-background py-24 md:py-36">
          <div className="container mx-auto grid grid-cols-1 gap-14 px-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="mb-4 block text-sm uppercase tracking-[0.2em] text-primary">Услуги</span>
              <h2 className="mb-6 font-serif text-4xl md:text-5xl">Детали создают комфорт</h2>
              <p className="mb-10 text-lg text-muted-foreground">
                Мы берем на себя все заботы, чтобы вы могли спокойно отдыхать, пока питомец проводит время в комфорте.
              </p>
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src="/images/vet-care.jpg" alt="Ветеринарный уход" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="space-y-10 lg:col-span-7 lg:pt-20">
              {[
                "Индивидуальные прогулки в закрытом саду",
                "Привычный рацион и домашний режим питания",
                "Ежедневный контроль самочувствия",
                "Фото- и видеоотчеты каждый день",
              ].map((item) => (
                <div key={item} className="border-t border-border pt-6">
                  <h3 className="font-serif text-2xl">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-24">
          <div className="container mx-auto max-w-4xl px-6">
            <h2 className="mb-10 text-center font-serif text-4xl md:text-5xl">Частые вопросы</h2>
            <div className="space-y-4">
              <details className="border border-border bg-background p-5">
                <summary className="cursor-pointer font-serif text-lg">Что нужно для заселения?</summary>
                <p className="mt-3 text-muted-foreground">Нужен ветпаспорт с актуальными прививками и базовой обработкой от паразитов.</p>
              </details>
              <details className="border border-border bg-background p-5">
                <summary className="cursor-pointer font-serif text-lg">Можно ли привезти свои вещи?</summary>
                <p className="mt-3 text-muted-foreground">Да, знакомые вещи помогают питомцу быстрее адаптироваться.</p>
              </details>
            </div>
          </div>
        </section>

        <section id="booking" className="relative overflow-hidden bg-foreground py-24 text-background md:py-36">
          <div className="absolute inset-0 opacity-25">
            <img src="/images/garden-walk.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="container relative z-10 mx-auto max-w-4xl px-6 text-center">
            <span className="mb-6 inline-block text-xs uppercase tracking-[0.3em] text-primary">Бронирование</span>
            <h2 className="mb-6 font-serif text-4xl leading-tight md:text-6xl">Забронируйте место для вашего друга</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-background/75">Мы принимаем ограниченное количество гостей, чтобы уделить максимум внимания каждому.</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/rooms" className="inline-flex h-12 items-center bg-primary px-8 text-sm uppercase tracking-wider text-primary-foreground">
                Выбрать номер
              </Link>
              <a href="mailto:hello@lapadom.ru" className="inline-flex h-12 items-center border border-background/40 px-8 text-sm uppercase tracking-wider">
                Написать нам
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
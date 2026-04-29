import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type CabinetPageProps = {
  searchParams: Promise<{ phone?: string }>;
};

export default async function CabinetPage({ searchParams }: CabinetPageProps) {
  const { phone } = await searchParams;
  const phoneValue = phone ?? "";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader compact />
      <main className="container mx-auto px-6 py-16 md:py-24">
        {!phoneValue ? (
          <section className="mx-auto max-w-5xl overflow-hidden border border-border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[320px] bg-muted md:min-h-[460px]">
                <img src="/images/cabinet-hero.jpg" alt="Спокойный момент с питомцем" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="mb-4 inline-block text-xs uppercase tracking-[0.25em] text-primary">Личный кабинет</span>
                <h1 className="mb-4 font-serif text-3xl md:text-4xl">С возвращением</h1>
                <p className="mb-8 text-muted-foreground">Введите номер телефона, указанный при бронировании, чтобы увидеть статус ваших заявок.</p>
                <form method="get" action="/cabinet" className="space-y-4">
                  <input className="h-14 w-full border border-input bg-transparent px-4" name="phone" placeholder="+7 (999) 000-00-00" />
                  <button className="h-14 w-full bg-primary text-sm uppercase tracking-wide text-primary-foreground">Показать брони</button>
                </form>
              </div>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-4xl border border-border bg-card p-8 md:p-10">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h1 className="mb-1 font-serif text-4xl">Ваши бронирования</h1>
                <p className="text-muted-foreground">Номер: {phoneValue}</p>
              </div>
              <Link href="/cabinet" className="text-sm uppercase tracking-wide text-muted-foreground underline">
                Другой номер
              </Link>
            </div>
            <div className="rounded border border-dashed border-border p-6 text-muted-foreground">
              Для Next-версии подключен демонстрационный кабинет. Интеграцию с API можно вернуть отдельным шагом.
            </div>
            <div className="mt-6 flex gap-4">
              <Link href="/rooms" className="text-primary underline">Выбрать номер</Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
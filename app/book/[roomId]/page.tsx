import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BookingForm } from "@/components/booking-form";
import { getRoomById } from "@/data/rooms";

type BookPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { roomId } = await params;
  const room = getRoomById(roomId);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader compact />
      <main>
        <section className="relative h-[28vh] w-full overflow-hidden bg-muted md:h-[36vh]">
          <img src="/images/book-hero.jpg" alt="ЛапаДом" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/15 via-background/0 to-background" />
        </section>
        <div className="container mx-auto -mt-16 max-w-5xl px-6 py-12 md:py-16">
          <Link href="/rooms" className="mb-8 inline-flex border border-border bg-background/85 px-4 py-2 text-sm uppercase tracking-wider text-foreground/80">
            Назад к номерам
          </Link>
          {!room ? (
            <div className="border border-border bg-card p-8">
              <h1 className="mb-4 font-serif text-3xl">Номер не найден</h1>
              <Link href="/rooms" className="text-primary underline">Вернуться к списку</Link>
            </div>
          ) : (
            <BookingForm room={room} />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
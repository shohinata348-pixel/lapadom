import { BookingCartControls } from "@/components/rooms/booking-cart-controls";
import { BookingCartSummary } from "@/components/rooms/booking-cart-summary";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ROOMS } from "@/data/rooms";

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader compact />
      <main>
        <section className="relative h-[40vh] w-full overflow-hidden bg-muted md:h-[55vh]">
          <img src="/images/rooms-hero.jpg" alt="Интерьер ЛапаДом" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-background" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-6 pb-10 md:pb-14">
              <span className="inline-block border border-primary/20 bg-background/85 px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-primary">
                Размещение
              </span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 md:py-24">
          <h1 className="mb-3 font-serif text-4xl md:text-5xl">Номера и цены</h1>
          <p className="mb-12 max-w-2xl text-lg text-muted-foreground">Выберите формат размещения для комфортного проживания вашего питомца.</p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {ROOMS.map((room) => (
              <article key={room.id} className="group overflow-hidden border border-border bg-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={room.photoUrl} alt={room.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 bg-background/90 px-3 py-1 text-xs uppercase tracking-wider">
                    {room.kind === "dog" ? "Собаки" : "Кошки"}
                  </span>
                </div>
                <div className="flex h-full flex-col p-6">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h2 className="font-serif text-2xl">{room.name}</h2>
                    <div className="text-right text-primary">от {room.pricePerNight.toLocaleString("ru-RU")} ₽</div>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">Площадь: {room.sizeSqm} м² · Вместимость: до {room.capacity}</p>
                  <p className="mb-5 text-sm text-muted-foreground">{room.description}</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <span key={amenity} className="bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="">
                    <BookingCartControls roomId={room.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <BookingCartSummary />
      <SiteFooter />
    </div>
  );
}
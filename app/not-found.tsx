import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="mb-4 font-serif text-5xl">404</h1>
        <p className="mb-6 text-muted-foreground">Страница не найдена.</p>
        <Link href="/" className="text-primary underline">Вернуться на главную</Link>
      </div>
    </main>
  );
}
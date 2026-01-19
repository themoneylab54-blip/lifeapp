import ChronoRing from "@/components/ChronoRing";

export default function Chrono() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="px-5 py-6">
        <h1 className="text-2xl font-black mb-6 text-center">Chronomètre</h1>
        <ChronoRing />
      </div>
    </div>
  );
}

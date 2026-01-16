import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";
import { Services } from "@/components/Services";
import { Showroom } from "@/components/Showroom";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Clients />
      <Services />
      <Showroom />
    </main>
  );
}
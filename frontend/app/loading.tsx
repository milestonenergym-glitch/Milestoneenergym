import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <div className="relative h-24 w-24 md:h-32 md:w-32 animate-[spin_3s_linear_infinite]">
        <Image
          src="/logo.jpg"
          alt="Milestone Energym Loading"
          fill
          className="rounded-full object-cover border-2 border-brand-gold/50"
          priority
        />
      </div>
    </div>
  );
}

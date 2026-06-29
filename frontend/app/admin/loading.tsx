import Image from "next/image";

export default function AdminLoading() {
  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center p-8">
      <div className="relative h-20 w-20 md:h-24 md:w-24 animate-[spin_3s_linear_infinite]">
        <Image
          src="/logo.jpg"
          alt="Loading..."
          fill
          className="rounded-full object-cover border-2 border-brand-gold/50"
          priority
        />
      </div>
    </div>
  );
}

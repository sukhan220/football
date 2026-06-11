

// app/(portal)/layout.tsx
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // সার্ভার সাইড সেশন ক্যাচ করা হচ্ছে
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* সেশন ডাটা প্রপ্স আকারে পাঠানো হলো */}
      <Navbar session={session} /> 

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
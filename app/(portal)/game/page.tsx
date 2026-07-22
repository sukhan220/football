//portal/game/page.tsx

'use client';

import dynamic from 'next/dynamic';

// SSR ডিজেবল করে dynamic import করা হচ্ছে
const PenaltyGame = dynamic(() => import('@/components/game/PenaltyGame'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-[#0c1017] text-white">
      <p className="text-lg font-semibold animate-pulse">Game Loading...</p>
    </div>
  ),
});

export default function GamePage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-[#0c1017]">
      <PenaltyGame />
    </main>
  );
}

// 'use client';

// import dynamic from 'next/dynamic';

// // SSR ডিজেবল করে FootballGameView dynamic import করা হচ্ছে
// const FootballGameView = dynamic(
//   () => import('@/components/game/FootballGameView'),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex h-screen w-full items-center justify-center bg-[#0c1017] text-white">
//         <p className="text-lg font-semibold animate-pulse">Football Game Loading...</p>
//       </div>
//     ),
//   }
// );

// export default function GamePage() {
//   return (
//     <main className="w-full h-screen overflow-hidden bg-[#0c1017]">
//       <FootballGameView />
//     </main>
//   );
// }
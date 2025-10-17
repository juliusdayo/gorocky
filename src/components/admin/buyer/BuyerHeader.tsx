"use client";

import { useRouter } from "next/navigation";
import { Buyer } from "../../../app/(admin)/buyers/types";

interface BuyerHeaderProps {
  buyer: Buyer;
}

export default function BuyerHeader({ buyer }: BuyerHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8 flex items-center">
      <button
        onClick={() => router.push("/buyers")}
        className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {buyer.firstName} {buyer.lastName}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Buyer ID: {buyer.id}</p>
      </div>
    </div>
  );
}

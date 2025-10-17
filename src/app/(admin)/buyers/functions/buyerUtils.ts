import { Buyer } from "../types";

/**
 * Updates a buyer's information via API
 */
export const updateBuyer = async (
  buyerId: number,
  updatedData: Partial<Buyer>
): Promise<Buyer> => {
  const response = await fetch(`/api/buyers/${buyerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update buyer");
  }

  return await response.json();
};

/**
 * Formats a number as currency (USD)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Formats a date string to a readable format
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

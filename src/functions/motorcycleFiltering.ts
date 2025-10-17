import { Motorcycle, MotorcycleFilters } from "../components/public/types";

export interface MotorcycleFilterAndSortParams {
  motorcycles: Motorcycle[];
  searchTerm: string;
  filters: MotorcycleFilters;
  sortBy: string;
}

export function filterAndSortMotorcycles({
  motorcycles,
  searchTerm,
  filters,
  sortBy,
}: MotorcycleFilterAndSortParams): Motorcycle[] {
  let filtered = [...motorcycles];

  // Apply search
  if (searchTerm) {
    filtered = filtered.filter((motorcycle) =>
      `${motorcycle.year} ${motorcycle.brand_name || motorcycle.brand?.name} ${
        motorcycle.modelName
      }`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  // Apply filters
  if (filters.brand) {
    filtered = filtered.filter((m) =>
      (m.brand_name || m.brand?.name || "")
        .toLowerCase()
        .includes(filters.brand.toLowerCase())
    );
  }

  if (filters.minYear) {
    filtered = filtered.filter((m) => m.year >= parseInt(filters.minYear));
  }

  if (filters.maxYear) {
    filtered = filtered.filter((m) => m.year <= parseInt(filters.maxYear));
  }

  if (filters.minPrice) {
    filtered = filtered.filter((m) => m.price >= parseInt(filters.minPrice));
  }

  if (filters.maxPrice) {
    filtered = filtered.filter((m) => m.price <= parseInt(filters.maxPrice));
  }

  if (filters.status) {
    filtered = filtered.filter((m) => m.status === filters.status);
  }

  // Apply sorting
  switch (sortBy) {
    case "newest":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "year-new":
      filtered.sort((a, b) => b.year - a.year);
      break;
    case "year-old":
      filtered.sort((a, b) => a.year - b.year);
      break;
  }

  return filtered;
}

// Helper function to get unique brands from motorcycles
export function extractUniqueBrands(motorcycles: Motorcycle[]): string[] {
  return [
    ...new Set(
      motorcycles
        .map((m) => m.brand_name || m.brand?.name)
        .filter(
          (brand): brand is string =>
            typeof brand === "string" && brand.length > 0
        )
    ),
  ].sort();
}

// Helper function to check if filters are active
export function hasActiveFilters(filters: MotorcycleFilters): boolean {
  return Object.values(filters).some(
    (value) => value !== "" && value !== "available"
  );
}

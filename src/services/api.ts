import { SiteData } from "../types";

export const fetchSiteData = async (): Promise<SiteData> => {
  const response = await fetch("/api/data");
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

export const updateSiteData = async (data: SiteData): Promise<void> => {
  const response = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update data");
};

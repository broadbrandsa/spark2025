// Static placeholder data for Organic Leads
// Updated manually to bypass CSV dependency
const ORGANIC_DATA_HARDCODED: OrganicThankYouData = {
  thankYouPageViews: 0,
  monthly: {}, // Will be populated when data is provided
};

export interface OrganicThankYouData {
  thankYouPageViews: number;
  monthly: Record<string, number>;
}

export async function loadOrganicThankYouViews(): Promise<OrganicThankYouData> {
  return ORGANIC_DATA_HARDCODED;
}

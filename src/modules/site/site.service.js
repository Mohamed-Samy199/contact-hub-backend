import Site from "../../models/Site.model.js";
import { find } from "../../db/database.repository.js";

// Sites rarely change, so keep them in memory for a minute instead of hitting the DB per request.
const CACHE_TTL_MS = 60 * 1000;
let cache = { loadedAt: 0, sites: [] };

const loadSites = async () => {
  if (Date.now() - cache.loadedAt < CACHE_TTL_MS) return cache.sites;

  const sites = await find({
    model: Site,
    filter: { isActive: true },
    options: { lean: true },
  });

  cache = { loadedAt: Date.now(), sites };
  return sites;
};

export const getSiteByKey = async (key) => {
  const sites = await loadSites();
  return sites.find((s) => s.key === key) || null;
};

export const getAllowedOrigins = async () => {
  const sites = await loadSites();
  return [...new Set(sites.flatMap((s) => s.allowedOrigins))];
};

import dns from "dns/promises";

export async function getMxHosts(domain) {
  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) {
      // If no MX records, fallback to A record of domain
      const a = await dns.resolve(domain);
      return a.map((ip) => ({ exchange: domain, priority: 0 }));
    }
    // Sort by priority asc
    mx.sort((a, b) => a.priority - b.priority);
    return mx;
  } catch (err) {
    // If any DNS error, throw up
    throw new Error(`MX lookup failed for ${domain}: ${err.message}`);
  }
}

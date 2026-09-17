import dns from "node:dns/promises";

const hosts = ["_verifieddr.asbestostrusts.org", "asbestostrusts.org"];
const expected = "verifieddr-site-verification=G0B766f7pOGvp4TimN02Co99TIxDqBdR";
const authorities = ["ns1.globaldomaingroup.com", "ns2.globaldomaingroup.com"];

for (const authority of authorities) {
  const resolver = new dns.Resolver();
  try {
    const [address] = await dns.resolve4(authority);
    resolver.setServers([address]);
    for (const host of hosts) {
      try {
        const values = (await resolver.resolveTxt(host)).map((parts) => parts.join(""));
        console.log(`${authority} (${address}) ${host}: ${values.join(" | ")}`);
        if (values.includes(expected)) {
          console.log(`${authority}: expected VerifiedDR value present at ${host}`);
        }
      } catch (error) {
        console.log(`${authority} ${host}: ${error.code ?? "DNS_ERROR"}`);
      }
    }
  } catch (error) {
    console.log(`${authority}: ${error.code ?? "DNS_ERROR"}`);
  }
}

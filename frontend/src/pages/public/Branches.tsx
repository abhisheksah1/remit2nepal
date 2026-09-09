import { BranchFinder } from "@/components/public/BranchFinder";
import { PageHero } from "@/components/public/PageHero";
import { SeoHead } from "@/components/public/SeoHead";

export default function Branches() {
  return (
    <>
      <PageHero
        kicker="Nationwide payout"
        title="Find an agent"
        description="Filter instantly by province and district, or type an agent name or street. Results update as you type."
      />
      <div className="mx-auto max-w-site px-4 py-16">
        <SeoHead title="Find a Remit2Nepal agent" description="Search agents by name, district or address across Nepal." />
        <BranchFinder />
      </div>
    </>
  );
}

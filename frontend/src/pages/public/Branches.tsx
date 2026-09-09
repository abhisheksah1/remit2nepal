import { BranchFinder } from "@/components/public/BranchFinder";
import { PageHero } from "@/components/public/PageHero";
import { SeoHead } from "@/components/public/SeoHead";

export default function Branches() {
  return (
    <>
      <PageHero
        kicker="Nationwide payout"
        title="Our Agent"
        description="Filter instantly by province and district, or type an agent name or street. Results update as you type."
      />
      <div className="mx-auto max-w-site px-4 lg:px-8 py-16">
        <SeoHead title="Our Agent" description="Search Remit2Nepal agents by name, district or address across Nepal." />
        <BranchFinder />
      </div>
    </>
  );
}

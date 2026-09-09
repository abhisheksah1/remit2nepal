import { BranchFinder } from "@/components/public/BranchFinder";
import { SeoHead } from "@/components/public/SeoHead";

export default function Branches() {
  return (
    <div className="agent-desk reveal-skip">
      <SeoHead title="Our Agent" description="Search Remit2Nepal agents by name, district or address across Nepal." />
      <div className="agent-sky" aria-hidden>
        <span className="agent-mesh" />
        <div className="agent-mountains" />
      </div>
      <section className="agent-hero" aria-labelledby="agent-title">
        <div className="agent-hero-copy">
          <p>Payout desks</p>
          <h1 id="agent-title">Our Agent</h1>
          <span>Tap a province on the map, or search by agent name, district or street. Results update as you type.</span>
        </div>
      </section>
      <div className="agent-stage">
        <BranchFinder />
      </div>
    </div>
  );
}

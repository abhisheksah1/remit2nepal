import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { BrandPunch } from "./AboutBlocks";
import { AboutWorld } from "./AboutWorld";
import { HeroNetwork } from "./HeroNetwork";
import { Button } from "@/components/ui/Button";
import { ABOUT_DEFAULTS, aboutChips, aboutHighlights, aboutLine, aboutList, aboutMissionPoints, aboutSteps, aboutValues, aboutWhy } from "@/content/about-defaults";
import type { AboutCompany } from "@/types/content";
import { aboutIcon } from "@/utils/about-icons";
import { cn, mediaUrl } from "@/utils/cn";

function Action({
  to,
  children,
  variant,
  ghost
}: {
  to: string;
  children: ReactNode;
  variant: "gold" | "secondary";
  ghost?: boolean;
}) {
  const button = (
    <Button variant={variant} size="lg" className={cn("apro-btn", variant === "gold" && "btn-shimmer", ghost && "is-ghost")}>
      {children}
    </Button>
  );
  if (to.startsWith("#")) return <a href={to}>{button}</a>;
  return <Link to={to}>{button}</Link>;
}

export function AboutPro({ about }: { about: AboutCompany }) {
  const d = ABOUT_DEFAULTS;
  const values = aboutValues(about.coreValues, d.coreValues);
  const stats = about.statistics?.length ? about.statistics : [];
  const highlights = aboutHighlights(about.whoHighlights, d.whoHighlights);
  const missionPoints = aboutMissionPoints(about.missionPoints, d.missionPoints);
  const whyItems = aboutWhy(about.whyItems, d.whyItems);
  const steps = aboutSteps(about.steps, d.steps);
  const visionChips = aboutChips(about.visionChips, d.visionChips);
  const commitmentItems = aboutList(about.commitmentItems, d.commitmentItems);
  const whoImage = about.heroImageUrl || "/images/nepal-map/scene-family.svg";
  const missionImage = about.missionImageUrl || "/images/nepal-map/scene-payout.svg";
  const visionImage = about.visionImageUrl || "/images/nepal-map/scene-office.svg";
  const storyImage = about.storyBandImageUrl || "/images/nepal-map/scene-family.svg";

  return (
    <div className="about-pro">
      <section className="apro-hero" aria-labelledby="about-punch">
        <div className="apro-wrap apro-hero-grid">
          <div className="apro-hero-copy">
            <p className="apro-kicker">{aboutLine(about.heroKicker, d.heroKicker)}</p>
            <BrandPunch id="about-punch" text={aboutLine(about.heroTitle, d.heroTitle)} className="apro-punch" />
            <p className="apro-lede">{aboutLine(about.heroDescription, d.heroDescription)}</p>
            <div className="apro-actions">
              <Action to={aboutLine(about.heroPrimaryUrl, d.heroPrimaryUrl)} variant="gold">
                {aboutLine(about.heroPrimaryLabel, d.heroPrimaryLabel)}
              </Action>
              <Action to={aboutLine(about.heroSecondaryUrl, d.heroSecondaryUrl)} variant="secondary">
                {aboutLine(about.heroSecondaryLabel, d.heroSecondaryLabel)} <ArrowRight className="h-4 w-4" />
              </Action>
            </div>
          </div>
          <HeroNetwork />
        </div>
      </section>

      <section id="who-we-are" className="apro-split" aria-labelledby="who-heading">
        <div className="apro-wrap apro-split-grid">
          <div>
            <p className="apro-kicker">{aboutLine(about.storyKicker, d.storyKicker)}</p>
            <h2 id="who-heading">{aboutLine(about.storyHeading, d.storyHeading)}</h2>
            <p>{aboutLine(about.introduction, d.introduction)}</p>
            <p>{aboutLine(about.whoBody, d.whoBody)}</p>
          </div>
          <div className="apro-media">
            <span className="apro-blob is-red" aria-hidden />
            <span className="apro-blob is-navy" aria-hidden />
            <img src={mediaUrl(whoImage)} alt="" />
            <ul className="apro-floats">
              {highlights.map((item) => {
                const Icon = aboutIcon(item.icon, item.title);
                return (
                  <li key={item.title}>
                    <Icon className="h-4 w-4" aria-hidden />
                    {item.title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="apro-split is-mission" aria-labelledby="mission-heading">
        <div className="apro-wrap apro-split-grid">
          <div>
            <p className="apro-kicker">{aboutLine(about.missionKicker, d.missionKicker)}</p>
            <h2 id="mission-heading">{aboutLine(about.missionHeading, d.missionHeading)}</h2>
            <p>{aboutLine(about.mission, d.mission)}</p>
            <p>{aboutLine(about.missionBody, d.missionBody)}</p>
            <ul className="apro-points">
              {missionPoints.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong> {item.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="apro-media">
            <span className="apro-blob is-navy" aria-hidden />
            <span className="apro-blob is-red is-br" aria-hidden />
            <img src={mediaUrl(missionImage)} alt="" />
          </div>
        </div>
      </section>

      <section className="apro-split is-vision" aria-labelledby="vision-heading">
        <div className="apro-wrap apro-split-grid is-reverse">
          <div className="apro-media">
            <span className="apro-blob is-red" aria-hidden />
            <span className="apro-blob is-navy is-br" aria-hidden />
            <img src={mediaUrl(visionImage)} alt="" />
          </div>
          <div>
            <p className="apro-kicker">{aboutLine(about.visionKicker, d.visionKicker)}</p>
            <h2 id="vision-heading">{aboutLine(about.visionHeading, d.visionHeading)}</h2>
            <p>{aboutLine(about.vision, d.vision)}</p>
            <p>{aboutLine(about.visionBody, d.visionBody)}</p>
            <ul className="apro-chips">
              {visionChips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="apro-band" aria-labelledby="why-heading">
        <div className="apro-wrap apro-center">
          <p className="apro-kicker">{aboutLine(about.whyKicker, d.whyKicker)}</p>
          <h2 id="why-heading">{aboutLine(about.whyHeading, d.whyHeading)}</h2>
          <p className="apro-lede is-center">{aboutLine(about.whySubheading, d.whySubheading)}</p>
          <div className="apro-cards">
            {whyItems.map((item) => {
              const Icon = aboutIcon(item.icon, item.title);
              return (
                <article key={item.title} className="apro-card">
                  <span className="apro-icon" aria-hidden>
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="apro-values" aria-labelledby="values-heading">
        <div className="apro-wrap">
          <p className="apro-kicker">{aboutLine(about.valuesKicker, d.valuesKicker)}</p>
          <h2 id="values-heading">{aboutLine(about.valuesHeading, d.valuesHeading)}</h2>
          <p className="apro-lede">{aboutLine(about.valuesSubheading, d.valuesSubheading)}</p>
          <div className="apro-value-grid">
            {values.map((value) => {
              const Icon = aboutIcon(value.icon, value.title);
              return (
                <article key={value.title} className="apro-value">
                  <span className="apro-icon" aria-hidden>
                    <Icon />
                  </span>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="apro-steps" aria-labelledby="steps-heading">
        <div className="apro-wrap">
          <p className="apro-kicker">{aboutLine(about.stepsKicker, d.stepsKicker)}</p>
          <BrandPunch id="steps-heading" text={aboutLine(about.stepsHeading, d.stepsHeading)} as="h2" className="apro-punch is-section" />
          <ol className="apro-step-row">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="apro-commit" aria-labelledby="commit-heading">
        <div className="apro-wrap">
          <p className="apro-kicker">{aboutLine(about.commitmentKicker, d.commitmentKicker)}</p>
          <h2 id="commit-heading">{aboutLine(about.commitmentHeading, d.commitmentHeading)}</h2>
          <p className="apro-lede">{aboutLine(about.commitmentBody, d.commitmentBody)}</p>
          <ul className="apro-commit-row">
            {commitmentItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="apro-story" aria-labelledby="story-heading">
        <div className="apro-story-map" aria-hidden>
          <AboutWorld className="apro-world is-soft" />
        </div>
        <div className="apro-wrap apro-story-grid">
          <img src={mediaUrl(storyImage)} alt="" />
          <div>
            <p className="apro-kicker">{aboutLine(about.storyBandKicker, d.storyBandKicker)}</p>
            <h2 id="story-heading">{aboutLine(about.storyBandHeading, d.storyBandHeading)}</h2>
            <p>{aboutLine(about.storyBandBody, d.storyBandBody)}</p>
          </div>
        </div>
      </section>

      {stats.length ? (
        <section className="apro-stats" aria-label="Trust figures">
          <div className="apro-wrap apro-stat-row">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p>{stat.value}</p>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="apro-cta" aria-labelledby="cta-heading">
        <div className="apro-cta-map" aria-hidden>
          <AboutWorld className="apro-world is-cta" />
        </div>
        <div className="apro-wrap apro-center">
          <h2 id="cta-heading">{aboutLine(about.ctaHeading, d.ctaHeading)}</h2>
          <p className="apro-lede is-center is-light">{aboutLine(about.ctaBody, d.ctaBody)}</p>
          <div className="apro-actions is-center">
            <Action to={aboutLine(about.ctaPrimaryUrl, d.ctaPrimaryUrl)} variant="gold">
              {aboutLine(about.ctaPrimaryLabel, d.ctaPrimaryLabel)}
            </Action>
            <Action to={aboutLine(about.ctaSecondaryUrl, d.ctaSecondaryUrl)} variant="secondary" ghost>
              {aboutLine(about.ctaSecondaryLabel, d.ctaSecondaryLabel)}
            </Action>
          </div>
        </div>
      </section>
    </div>
  );
}

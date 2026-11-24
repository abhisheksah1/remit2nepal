type PhotoProps = {
  src: string;
  alt: string;
  credit?: string;
  overlay?: string;
};

export function CompliancePhoto({ src, alt, credit, overlay }: PhotoProps) {
  return (
    <figure className="cpro-photo">
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {overlay ? <span className="cpro-photo-tag">{overlay}</span> : null}
      {credit ? <figcaption>{credit}</figcaption> : null}
    </figure>
  );
}

export function ComplianceFlow({ steps = ["Compliance", "Risk", "Security", "Operations"] }: { steps?: string[] }) {
  return (
    <div className="cpro-flow" aria-hidden>
      {steps.map((step, index) => (
        <span key={step}>
          {step}
          {index < steps.length - 1 ? <i /> : null}
        </span>
      ))}
    </div>
  );
}

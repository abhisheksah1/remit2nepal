import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { ServiceItem } from "@/types/content";
import { cn, entityId, mediaUrl } from "@/utils/cn";
import { serviceAccent, serviceIcon } from "@/utils/service-visuals";

function Tile({
  service,
  index,
  decorative
}: {
  service: ServiceItem;
  index: number;
  decorative?: boolean;
}) {
  const Icon = serviceIcon(service.icon);
  const accent = serviceAccent(service.accentColor, index);
  const href = `/services/${service.slug || entityId(service)}`;
  const photo = mediaUrl(service.imageUrl);
  const style = { "--svc-accent": accent, "--i": index } as CSSProperties;

  const inner = (
    <>
      <span className="svc-tile-bar" aria-hidden />
      <span className="svc-tile-mark" aria-hidden>
        {photo ? <img src={photo} alt="" /> : <Icon />}
      </span>
      <h3>{service.title}</h3>
      <span className="svc-tile-line" aria-hidden />
      {service.shortDescription ? <p>{service.shortDescription}</p> : null}
    </>
  );

  if (decorative) {
    return (
      <article className="svc-tile" style={style} aria-hidden>
        {inner}
      </article>
    );
  }

  return (
    <Link to={href} className="svc-tile" style={style}>
      {inner}
    </Link>
  );
}

export function ServiceRail({ services }: { services: ServiceItem[] }) {
  const cards = services.filter((item) => item.status !== "INACTIVE");
  if (!cards.length) return null;

  const loop = cards.length >= 3;
  const duration = Math.max(28, cards.length * 7);

  return (
    <div className={cn("svc-rail", !loop && "is-static")}>
      <div className="svc-rail-track" style={{ animationDuration: `${duration}s` }}>
        {cards.map((service, index) => (
          <Tile key={entityId(service)} service={service} index={index} />
        ))}
        {loop
          ? cards.map((service, index) => (
              <Tile key={`${entityId(service)}-loop`} service={service} index={index} decorative />
            ))
          : null}
      </div>
    </div>
  );
}

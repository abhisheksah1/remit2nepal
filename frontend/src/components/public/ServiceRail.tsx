import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { ServiceItem } from "@/types/content";
import { entityId, mediaUrl } from "@/utils/cn";
import { serviceAccent, serviceIcon } from "@/utils/service-visuals";

function Tile({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = serviceIcon(service.icon);
  const accent = serviceAccent(service.accentColor, index);
  const href = `/services/${service.slug || entityId(service)}`;
  const photo = mediaUrl(service.imageUrl);
  const step = String(index + 1).padStart(2, "0");

  return (
    <Link to={href} className="svc-tile" style={{ "--svc-accent": accent } as CSSProperties}>
      <div className="svc-tile-head">
        <span className="svc-tile-mark" aria-hidden>
          {photo ? <img src={photo} alt="" /> : <Icon />}
        </span>
        <span className="svc-tile-step">{step}</span>
      </div>
      <h3>{service.title}</h3>
      {service.shortDescription ? <p>{service.shortDescription}</p> : null}
      <span className="svc-tile-more">
        Learn more
        <ArrowUpRight />
      </span>
    </Link>
  );
}

export function ServiceRail({ services }: { services: ServiceItem[] }) {
  const cards = services.filter((item) => item.status !== "INACTIVE");
  if (!cards.length) return null;

  return (
    <div className="svc-rail">
      <div className="svc-rail-track">
        {cards.map((service, index) => (
          <Tile key={entityId(service)} service={service} index={index} />
        ))}
      </div>
    </div>
  );
}

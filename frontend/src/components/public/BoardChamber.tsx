import { useState } from "react";
import type { TeamMember } from "@/types/content";
import { entityId, mediaUrl } from "@/utils/cn";
import { isBoardChair, personInitials } from "@/utils/team";

function BoardPhoto({ name, src, size = "md" }: { name: string; src?: string; size?: "md" | "lg" }) {
  if (src) {
    return <img src={mediaUrl(src)} alt={name} className="board-photo" />;
  }
  return (
    <div className={size === "lg" ? "board-mono is-lg" : "board-mono"} aria-hidden>
      {personInitials(name)}
    </div>
  );
}

function BoardBio({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 180;
  return (
    <>
      <p className={open ? "board-bio is-open" : "board-bio"}>{text}</p>
      {long ? (
        <button type="button" className="board-more" onClick={() => setOpen((value) => !value)}>
          {open ? "Show less" : "Read more"}
        </button>
      ) : null}
    </>
  );
}

export function BoardChamber({
  kicker,
  title,
  description,
  chair,
  directors
}: {
  kicker: string;
  title: string;
  description: string;
  chair: TeamMember | null;
  directors: TeamMember[];
}) {
  return (
    <div className="board-desk reveal-skip">
      <div className="board-sky" aria-hidden>
        <span className="board-mesh" />
        <div className="board-mountains" />
      </div>

      <header className="board-head">
        <p>{kicker}</p>
        <h1>{title}</h1>
        {description ? <span>{description}</span> : null}
      </header>

      {chair ? (
        <article className="board-chair">
          <div className="board-chair-media">
            <BoardPhoto name={chair.name} src={chair.photoUrl} size="lg" />
          </div>
          <div className="board-chair-copy">
            <p className="board-chair-kicker">{isBoardChair(chair) ? "Chair" : "Director"}</p>
            <h2>{chair.name}</h2>
            <p className="board-chair-role">{chair.title}</p>
            {chair.bio ? <BoardBio text={chair.bio} /> : null}
          </div>
        </article>
      ) : null}

      {directors.length ? (
        <section className="board-chamber" aria-label="Directors">
          <div className="board-chamber-head">
            <p>The chamber</p>
            <h2>Directors</h2>
          </div>
          <div className="board-grid">
            {directors.map((member, index) => (
              <article key={entityId(member)} className="board-card" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="board-card-media">
                  <BoardPhoto name={member.name} src={member.photoUrl} />
                </div>
                <div className="board-card-plate">
                  <p>{member.title}</p>
                  <h3>{member.name}</h3>
                  {member.bio ? <BoardBio text={member.bio} /> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!chair && !directors.length ? (
        <p className="board-empty">Directors will appear here once they are published in Admin → Board & Team.</p>
      ) : null}
    </div>
  );
}

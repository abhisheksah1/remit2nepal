import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { getErrorMessage } from "@/api/client";
import { cn } from "@/utils/cn";

function validControl(value: string) {
  return /^[A-Za-z0-9][A-Za-z0-9-]{3,39}$/.test(value.trim());
}

export function TrackTransfer({ standalone = false }: { standalone?: boolean }) {
  const [controlNumber, setControlNumber] = useState("");
  const [error, setError] = useState("");

  const lookup = useMutation({
    mutationFn: (value: string) => publicApi.track(value),
    onError: (err) => setError(getErrorMessage(err))
  });

  function onTrack(event: FormEvent) {
    event.preventDefault();
    if (!validControl(controlNumber)) {
      setError("Enter a valid control number.");
      lookup.reset();
      return;
    }
    setError("");
    lookup.reset();
    lookup.mutate(controlNumber.trim());
  }

  const status = lookup.data?.status;

  return (
    <section
      id="track-transfer"
      className={cn("track-radar reveal-skip", standalone && "is-page")}
      aria-labelledby="track-title"
    >
      <div className="track-radar-wrap">
        <h2 id="track-title">Track Remittance</h2>
        <form className="track-radar-lookup" onSubmit={onTrack}>
          <label htmlFor="track-ref">Control number</label>
          <div className="track-radar-bar">
            <input
              id="track-ref"
              name="controlNumber"
              autoComplete="off"
              spellCheck={false}
              placeholder="Control number"
              value={controlNumber}
              onChange={(event) => {
                setControlNumber(event.target.value);
                lookup.reset();
                setError("");
              }}
            />
            <button type="submit" disabled={lookup.isPending}>
              {lookup.isPending ? "Tracking…" : "Track"}
            </button>
          </div>
        </form>
        {error ? <p className="track-radar-error">{error}</p> : null}
        {!error && status ? (
          <p className={cn("track-status", status === "PAID" ? "is-paid" : "is-unpaid")} role="status">
            {status === "PAID" ? "Paid" : "Unpaid"}
          </p>
        ) : null}
      </div>
    </section>
  );
}

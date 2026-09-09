import { SeoHead } from "@/components/public/SeoHead";
import { TrackTransfer } from "@/components/public/TrackTransfer";

export default function Track() {
  return (
    <>
      <SeoHead
        title="Track remittance"
        description="Enter your control number to see whether the transfer is paid or unpaid."
      />
      <TrackTransfer standalone />
    </>
  );
}

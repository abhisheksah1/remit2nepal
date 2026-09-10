import { describe, expect, it } from "vitest";
import { ratioFromSize } from "./image-ratio";

describe("ratioFromSize", () => {
  it("maps portrait photos to 9:16", () => {
    expect(ratioFromSize(1080, 1920)).toBe("9:16");
    expect(ratioFromSize(900, 1600)).toBe("9:16");
    expect(ratioFromSize(750, 1200)).toBe("9:16");
  });

  it("maps square photos to 1:1", () => {
    expect(ratioFromSize(1000, 1000)).toBe("1:1");
    expect(ratioFromSize(1080, 1020)).toBe("1:1");
  });

  it("maps landscape photos to 16:9", () => {
    expect(ratioFromSize(1920, 1080)).toBe("16:9");
    expect(ratioFromSize(1600, 900)).toBe("16:9");
    expect(ratioFromSize(1400, 900)).toBe("16:9");
  });
});

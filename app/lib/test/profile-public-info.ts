import { describe, expect, it } from "vitest";

import {
  decodeProfilePublicInfo,
  detectContactPlatform,
  encodeProfilePublicInfo,
  normalizePublicUrl,
} from "../profile-public-info";

describe("profile public info", () => {
  it("keeps location, portfolio, and at most four contacts", () => {
    const encoded = encodeProfilePublicInfo({
      location: "Denpasar, Bali",
      portfolioUrl: "figma.com/@student",
      contacts: [
        "instagram.com/student",
        "linkedin.com/in/student",
        "github.com/student",
        "behance.net/student",
        "dribbble.com/student",
      ],
    });

    expect(decodeProfilePublicInfo(encoded)).toEqual({
      location: "Denpasar, Bali",
      portfolioUrl: "https://figma.com/@student",
      contacts: [
        "https://instagram.com/student",
        "https://linkedin.com/in/student",
        "https://github.com/student",
        "https://behance.net/student",
      ],
    });
  });

  it("keeps a legacy contact string as the first contact", () => {
    expect(decodeProfilePublicInfo("instagram.com/student").contacts).toEqual(["instagram.com/student"]);
  });

  it("recognizes common social platforms immediately from a pasted URL", () => {
    expect(detectContactPlatform("https://www.instagram.com/student").label).toBe("Instagram");
    expect(detectContactPlatform("linkedin.com/in/student").label).toBe("LinkedIn");
    expect(detectContactPlatform("github.com/student").label).toBe("GitHub");
  });

  it("adds a secure protocol when a user pastes a bare domain", () => {
    expect(normalizePublicUrl("instagram.com/student")).toBe("https://instagram.com/student");
  });
});

import { describe, it, expect } from "vitest";
import {
  decodePostIdentifier,
  escapeRegex,
  isMongoObjectId,
} from "./blogQueries";

describe("escapeRegex", () => {
  it("escapes regex special characters", () => {
    expect(escapeRegex("a.b*c?")).toBe("a\\.b\\*c\\?");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeRegex("hello-world")).toBe("hello-world");
  });
});

describe("decodePostIdentifier", () => {
  it("decodes URI-encoded slugs", () => {
    expect(decodePostIdentifier("my%20post")).toBe("my post");
  });

  it("trims whitespace", () => {
    expect(decodePostIdentifier("  hello  ")).toBe("hello");
  });

  it("returns trimmed value when decoding fails", () => {
    expect(decodePostIdentifier("%E0%A4%A")).toBe("%E0%A4%A");
  });
});

describe("isMongoObjectId", () => {
  it("accepts a valid 24-char ObjectId", () => {
    expect(isMongoObjectId("507f1f77bcf86cd799439011")).toBe(true);
  });

  it("rejects blog slugs", () => {
    expect(isMongoObjectId("my-blog-slug")).toBe(false);
  });

  it("rejects empty strings", () => {
    expect(isMongoObjectId("")).toBe(false);
  });
});

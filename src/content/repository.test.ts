import { describe, expect, it } from "vitest";
import { contentRepository } from "./repository";
describe("content repository", () => {
  it("finds content by slug", () =>
    expect(contentRepository.getServiceBySlug("data-ai")?.title).toBe(
      "Data & AI",
    ));
  it("searches across content types", () =>
    expect(contentRepository.search("cloud").length).toBeGreaterThan(0));
  it("returns no results for unknown terms", () =>
    expect(contentRepository.getInsights("not-a-real-topic")).toEqual([]));
});

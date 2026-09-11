import "@testing-library/jest-dom";

// jsdom strips the fetch globals, which firebase/auth probes at import time and
// which components use for /api/config. Individual tests can still override fetch.
const g = globalThis as Record<string, unknown>;
if (typeof g.fetch === "undefined") {
  g.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
}
for (const name of ["Response", "Request", "Headers"]) {
  if (typeof g[name] === "undefined") g[name] = class {};
}

// jsdom doesn't implement scrollIntoView — mock it globally
Element.prototype.scrollIntoView = jest.fn();

// Mock window.matchMedia (used by some UI libraries)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

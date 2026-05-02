// Mock for react-markdown (ESM-only package, incompatible with CommonJS Jest)
// This provides a simple pass-through renderer for unit tests
import React from "react";

interface ReactMarkdownProps {
  children: string;
}

const ReactMarkdown = ({ children }: ReactMarkdownProps) => (
  <div data-testid="react-markdown">{children}</div>
);

export default ReactMarkdown;

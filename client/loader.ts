// client/content-loader.ts

export class ContentLoader {
  /**
   * Fetch and extract HTML fragments from URLs
   */
  async loadContent(url: string, target: string = "main"): Promise<string> {
    try {
      // Fetch HTML from the provided URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch content: ${response.status} ${response.statusText}`,
        );
      }

      // Validate that we got HTML back
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("text/html")) {
        throw new Error(
          `Expected HTML but got ${contentType || "unknown content type"}`,
        );
      }

      // Parse the response text as a DOM document
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Check for parsing errors
      const parserError = doc.querySelector("parsererror");
      if (parserError) {
        throw new Error(`Failed to parse HTML: ${parserError.textContent}`);
      }

      // Query for the element matching the target selector
      const element = doc.querySelector(target);

      if (!element) {
        throw new Error(
          `Target element "${target}" not found in fetched content`,
        );
      }

      // Extract and return the innerHTML of the matched element (first match)
      return element.innerHTML;
    } catch (error) {
      // Handle network errors gracefully
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`Network error: Unable to fetch ${url}`);
      }
      throw error;
    }
  }
}

// Convenience function export
export async function loadContent(
  url: string,
  target: string = "main",
): Promise<string> {
  const loader = new ContentLoader();
  return loader.loadContent(url, target);
}

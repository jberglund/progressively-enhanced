export async function loadContent(
  url: string,
  target: string = "main",
): Promise<string> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch content: ${response.status} ${response.statusText}`,
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      throw new Error(
        `Expected HTML but got ${contentType || "unknown content type"}`,
      );
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const element = doc.querySelector(target);

    if (!element) {
      throw new Error(
        `Target element "${target}" not found in fetched content`,
      );
    }

    return element.innerHTML;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`Network error: Unable to fetch ${url}`);
    }
    throw error;
  }
}

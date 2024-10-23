export default function parseMultipartFormData(body, boundary) {
  const buffer = Buffer.from(body);
  const bodyString = buffer.toString("utf-8");

  const parts = bodyString.split(`--${boundary}`);
  const formData = {};

  for (const part of parts) {
    // Skip empty parts
    if (!part.trim() || part.includes("--")) continue;

    const [header, ...content] = part.split("\r\n\r\n");
    const data = content.join("\r\n\r\n").trim();

    // Extract content disposition to find field names
    const dispositionMatch = header.match(
      /Content-Disposition:\s*form-data;\s*name="([^"]+)";?\s*(?:filename="([^"]+)")?/
    );

    const contentTypeMatch = header.match(/Content-Type:\s*(.+)/);

    if (dispositionMatch) {
      const name = dispositionMatch[1]; // Extract field name
      const filename = dispositionMatch[2]; // Extracted filename (if exists)

      // Determine content type
      const contentType = contentTypeMatch ? contentTypeMatch[1] : "text/plain"; // Default to text/plain if not found

      // Handle file uploads
      if (filename) {
        formData[name] = {
          filename: filename,
          data: data, // Keep raw data for processing later
          contentType: contentType, // Save content type for future use
        };
      } else {
        formData[name] = data; // Store text fields as is
      }
    }
  }
  return formData;
}

const RENDER_BACKEND_URL =
  process.env.RENDER_BACKEND_URL || "https://csz-store-backend.onrender.com";

module.exports = async (req, res) => {
  const targetUrl = `${RENDER_BACKEND_URL}${req.url}`;

  try {
    const fetch = (await import("node-fetch")).default;

    // Forward request headers (strip host)
    const headers = { ...req.headers };
    delete headers["host"];

    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Forward body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      fetchOptions.body = JSON.stringify(req.body);
      fetchOptions.headers["content-type"] =
        fetchOptions.headers["content-type"] || "application/json";
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Copy response headers
    response.headers.forEach((value, key) => {
      if (key !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);
    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(502).json({ error: "Bad Gateway", details: error.message });
  }
};

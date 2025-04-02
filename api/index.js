export default async function handler(req, res) {
    // Simple CORS headers (no need for cors package)
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*"); // Change '*' to specific domain if you want to restrict
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization"
    );

    // Handle preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: "Missing slug" });
    }

    if (req.method === "GET") {
        // Handle GET requests
        return res.status(200).json({ message: `GET received for slug: ${slug}` });
    }

    if (req.method === "POST") {
        // Body is automatically parsed as JSON
        const data = req.body;

        // Do whatever you want with `data` here
        console.log("Received data:", data);

        return res.status(200).json({ message: "POST successful", data, slug });
    }

    // Unsupported methods
    return res.status(405).json({ error: "Method Not Allowed" });
}

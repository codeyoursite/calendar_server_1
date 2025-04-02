export default async function handler(req, res) {
    // Setup CORS headers
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization"
    );

    // Preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end(); // <-- prevents timeout
    }

    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: "Missing slug" }); // <-- prevents timeout
    }

    if (req.method === "GET") {
        return res.status(200).json({ message: `GET received for slug: ${slug}` }); // <-- prevents timeout
    }

    if (req.method === "POST") {
        const data = req.body;
        console.log("Received data:", data);
        return res.status(200).json({ message: "POST successful", data, slug }); // <-- prevents timeout
    }

    return res.status(405).json({ error: "Method Not Allowed" }); // <-- prevents timeout
}

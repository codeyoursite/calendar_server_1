// /pages/api/events/[id].js

export default function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        const event = events.find(e => e.id === id);
        if (!event) return res.status(404).json({ error: "Event not found" });
        return res.status(200).json(event);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}

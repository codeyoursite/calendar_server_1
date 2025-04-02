// /pages/api/events.js (or /api/events.js if you don't use /pages)

let events = [
    { id: "1", name: "Test Event", stime: new Date().toISOString(), ftime: new Date(Date.now() + 3600000).toISOString() }
];

export default function handler(req, res) {
    if (req.method === "GET") {
        // return all events
        return res.status(200).json(events);
    }

    if (req.method === "POST") {
        const { id, name, stime, ftime } = req.body;
        if (!id || !name || !stime || !ftime) {
            return res.status(400).json({ error: "Missing fields" });
        }
        events.push({ id, name, stime, ftime });
        return res.status(201).json({ message: "Event created", event: { id, name, stime, ftime } });
    }

    if (req.method === "DELETE") {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Missing id" });
        events = events.filter(e => e.id !== id);
        return res.status(200).json({ message: "Event deleted" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}

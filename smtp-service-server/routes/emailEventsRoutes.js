import express from "express";
import EventEmitter from "events";

const router = express.Router();
const emailEmitter = new EventEmitter();

/**
 * Function used by worker to broadcast email status updates
 * Supports both string and object payloads.
 */
export function emitEmailEvent(id, payload) {
  const eventData =
    typeof payload === "string"
      ? { id, status: payload, time: new Date().toISOString() }
      : { id, time: new Date().toISOString(), ...payload };

  emailEmitter.emit(id, eventData);
}

/**
 * Client subscribes to live updates for a specific email ID
 */
router.get("/events/:id", (req, res) => {
  const { id } = req.params;

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Initial ping to confirm connection
  res.write("event: ping\ndata: connected\n\n");

  const listener = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Subscribe to specific email ID events
  emailEmitter.on(id, listener);

  // Cleanup when connection closes
  req.on("close", () => {
    emailEmitter.removeListener(id, listener);
  });
});

export default router;

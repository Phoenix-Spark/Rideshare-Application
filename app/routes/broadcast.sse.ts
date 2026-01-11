import type { LoaderFunctionArgs } from "react-router";

const connections = new Set<ReadableStreamDefaultController>();

export async function loader({ request }: LoaderFunctionArgs) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
      );

      connections.add(controller);

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (error) {
          clearInterval(heartbeat);
        }
      }, 30000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        connections.delete(controller);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

export function broadcast(event: any) {
  const encoder = new TextEncoder();
  const data = `data: ${JSON.stringify(event)}\n\n`;

  connections.forEach((controller) => {
    try {
      controller.enqueue(encoder.encode(data));
    } catch (error) {
      connections.delete(controller);
    }
  });
}
import type { LoaderFunctionArgs } from "react-router";
import { requireUserId } from "server/session.server";
import { eventBus } from "server/events/eventBus.server";
import { prisma } from "server/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isDriver: true,
      base: { select: { id: true } },
    },
  });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const baseId = user.base?.id;
  const isDriver = user.isDriver ?? false;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: string, data: unknown) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      sendEvent("connected", { userId, baseId, isDriver });

      const unsubscribe = eventBus.subscribe({
        userId,
        baseId,
        isDriver,
        callback: (event) => {
          try {
            sendEvent(event.type, event.payload);
          } catch {
            // Connection closed, will be cleaned up
          }
        },
      });

      request.signal.addEventListener("abort", () => {
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export type SSEEventType =
  | "new_request"
  | "renew_request"
  | "request_accepted"
  | "request_cancelled"
  | "request_cancelled_passenger"
  | "request_pickup"
  | "request_complete"
  | "connected"
  | "heartbeat";

export interface SSEEvent {
  type: SSEEventType;
  payload: Record<string, unknown>;
}

export interface Subscriber {
  userId: string;
  baseId?: string;
  isDriver: boolean;
  callback: (event: SSEEvent) => void;
}

class EventBus {
  private driversByBase: Map<string, Set<Subscriber>> = new Map();
  private passengersByUser: Map<string, Subscriber> = new Map();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startHeartbeat();
  }

  subscribe(subscriber: Subscriber): () => void {
    const { userId, baseId, isDriver } = subscriber;

    this.passengersByUser.set(userId, subscriber);

    if (isDriver && baseId) {
      if (!this.driversByBase.has(baseId)) {
        this.driversByBase.set(baseId, new Set());
      }
      this.driversByBase.get(baseId)!.add(subscriber);
    }

    return () => {
      this.passengersByUser.delete(userId);
      if (isDriver && baseId) {
        this.driversByBase.get(baseId)?.delete(subscriber);
        if (this.driversByBase.get(baseId)?.size === 0) {
          this.driversByBase.delete(baseId);
        }
      }
    };
  }

  notifyDriversAtBase(baseId: string, event: SSEEvent): void {
    const drivers = this.driversByBase.get(baseId);
    if (drivers) {
      drivers.forEach((subscriber) => {
        try {
          subscriber.callback(event);
          console.log(drivers, event)
        } catch (error) {
          console.error(`Failed to notify driver ${subscriber.userId}:`, error);
        }
      });
    }
  }

  notifyPassenger(userId: string, event: SSEEvent): void {
    const subscriber = this.passengersByUser.get(userId);
    if (subscriber) {
      try {
        subscriber.callback(event);
        console.log('sent message', event, subscriber)
      } catch (error) {
        console.error(`Failed to notify passenger ${userId}:`, error);
      }
    }
  }

  broadcastAll(event: SSEEvent): void {
    this.passengersByUser.forEach((subscriber) => {
      try {
        subscriber.callback(event);
      } catch {
        // Silently ignore heartbeat errors
      }
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.broadcastAll({
        type: "heartbeat",
        payload: { timestamp: Date.now() },
      });
    }, 30000);
  }

  getStats(): {
    driversOnline: number;
    passengersOnline: number;
    baseConnections: Record<string, number>;
  } {
    const baseConnections: Record<string, number> = {};
    this.driversByBase.forEach((drivers, baseId) => {
      baseConnections[baseId] = drivers.size;
    });

    return {
      driversOnline: Array.from(this.driversByBase.values()).reduce(
        (sum, set) => sum + set.size,
        0
      ),
      passengersOnline: this.passengersByUser.size,
      baseConnections,
    };
  }
}

export const eventBus = new EventBus();

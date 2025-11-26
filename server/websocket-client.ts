import axios from "axios";

const WS_API_URL = process.env.WS_API_URL || "http://localhost:3001";

export async function notifyDriversOfNewRide(rideId: string, pickupLocation: string) {
      console.log('test from ndon')
  try {
    await axios.post(`${WS_API_URL}/broadcast`, {
      type: "new_ride_request",
      rideId: rideId,
      pickupLocation: pickupLocation
    });
  } catch (error) {
    console.error("Failed to notify drivers:", error);
  }
}

export async function notifyRiderOfConfirmation(rideId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      rideId: rideId,
      confirm: true,
      type: "accept_ride_request"
    });
    
    await axios.post(`${WS_API_URL}/broadcast`, {
      type: "ride_accepted",
      rideId: rideId
    });
  } catch (error) {
    console.error("Failed to notify rider:", error);
  }
}

export async function notifyDriverOfCancelation(rideId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      type: "user_cancelled_request",
      rideId: rideId,
    });
  } catch (error) {
    console.error("Failed to notify driver:", error);
  }
}

export async function notifyPassengerOfPickup(requestId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      type: "user_picked_up",
      rideId: requestId
    });
  } catch (error) {
    console.error("Failed to notify passenger:", error);
  }
}

export async function notifyPassengerOfDropoff(requestId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      type: "user_dropped_off",
      rideId: requestId
    });
  } catch (error) {
    console.error("Failed to notify passenger:", error);
  }
}
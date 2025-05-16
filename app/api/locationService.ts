import axios from "axios";

/**
 * Sends location data (longitude, latitude, and address) to the specified API endpoint.
 * @param endpoint - The API endpoint to send the data to.
 * @param longitude - The longitude of the location.
 * @param latitude - The latitude of the location.
 * @param studentId - The ID of the student for authentication
 * @param address - The detailed address of the location.
 * @returns A promise resolving to the API response.
 */
export const sendLocationData = async (
  endpoint: string,
  longitude: number,
  latitude: number,
  address: string,
  studentId: number
): Promise<void> => {
  try {
    const response = await axios.post(
      endpoint,
      {
        longitude,
        latitude,
        address,
      },
      {
        headers: {
          "X-Student-ID": studentId,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Location data sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending location data:", error);
    throw error;
  }
};

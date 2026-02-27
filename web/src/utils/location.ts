export const getUserState = async () => {
  try {
    // Get coordinates first
    const position: GeolocationPosition = await new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    // Reverse geocode to get state (using a free API)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position?.coords?.latitude}&lon=${position?.coords?.longitude}`
    );
    const data = await response.json();

    return data.address?.city || data.address?.residential;
  } catch (error) {
    console.error("Error getting location:", error);
    return "Lagos";
  }
};

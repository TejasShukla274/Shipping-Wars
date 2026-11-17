// PLACEHOLDERS for external APIs the prototype only simulates. Implement each and call from routes.
module.exports = {
  fastagBalance: async (tagId) => {
    throw new Error("Connect an NPCI-authorised FASTag issuer API");
  },
  fastagRecharge: async (tagId, amount) => {
    throw new Error("FASTag issuer + payment gateway (Razorpay/Cashfree etc.)");
  },
  trackVehicle: async (vehicleId) => {
    throw new Error("Connect GPS / telematics provider");
  },
  verifyDocument: async (type, number) => {
    throw new Error("VAHAN / Sarathi / DigiLocker / insurer APIs");
  },
};

var apn = require('apn');

module.exports = {

  sendPushNotification: function(device, alertMessage, payload) {
    // Create a connection to the service using mostly default parameters.
    var options = {
      key: "dev_certs/key.pem",
      cert: "dev_certs/cert.pem",
      production: true
    };

    var service = new apn.Provider(options);
    service.on("connected", function() {
        console.log("Connected");
    });
    service.on("transmitted", function(notification, device) {
        console.log("Notification transmitted to:" + device.token.toString("hex"));
    });
    service.on("transmissionError", function(errCode, notification, device) {
        console.error("Notification caused error: " + errCode + " for device ", device, notification);
        if (errCode === 8) {
            console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
        }
    });
    service.on("timeout", function () {
        console.log("Connection Timeout");
    });
    service.on("disconnected", function() {
        console.log("Disconnected from APNS");
    });
    service.on("socketError", console.error);

    console.log("Attempting to Push Notification to " + device.token);

    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.alert = alertMessage;
    note.payload = payload;
    note.topic = "com.membermoose";

    console.log(note);
    service.send(note, device.token).then( (result) => {
      // see documentation for an explanation of result
      console.log(result)
    });
  }
};
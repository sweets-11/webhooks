const stripe = require("stripe")(
  "sk_test_51NyHa9By5dpszgvtawQ8P0RYm07elCF0dW614Iy8ssrXjpM1C2OLXzjQCFxlpQlxpxqEVY9ekk85nSRKrIzRYWDi00d8wyRd2M"
);

const endpointSecret =
  "whsec_52e75bb67a9a926d71dd1504062663c0b809820db9b6f38263638eed76c98d54";
const express = require("express");
require('dotenv').config()
const app = express();
// app.use(express.json());


app.get("/home" , (req, res) => {
  res.send("Hello");
  console.log("hello");
})

app.post("/webhook",express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      // console.log("req", request.body);
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      // case "charge.succeeded":
      //   const chargeSucceeded = event.data.object;
      //   console.log("Charged Succeeded", chargeSucceeded);
      //   response.send(chargeSucceeded);
      //   break;

      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log("Payment Intent Succeeded", paymentIntentSucceeded);
        // response.send(paymentIntentSucceeded);
        break;
      // case "payment_intent.processing":
      //   const paymentIntentProcessing = event.data.object;
      //   console.log("Payment Processing", paymentIntentProcessing);
      //   response.send(paymentIntentProcessing);
      //   break;

      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object;
        console.log("Payment Failed", paymentIntentFailed);
        // response.send(paymentIntentFailed);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.listen(process.env.PORT, () => console.log("Running on port 4000"));

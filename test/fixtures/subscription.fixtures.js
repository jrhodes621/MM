var Fixtures = {
  StripeSubscription: {
    "id": "sub_7VaeoYjKcYJzQI",
    "object": "subscription",
    "application_fee_percent": null,
    "cancel_at_period_end": false,
    "canceled_at": null,
    "created": 1449773303,
    "current_period_end": 1484074103,
    "current_period_start": 1481395703,
    "customer": "cus_7Vaek4PEyYBvsJ",
    "discount": null,
    "ended_at": null,
    "livemode": false,
    "metadata": {
    },
    "plan": {
      "id": "Test ABCEFC",
      "object": "plan",
      "amount": 10000,
      "created": 1449549532,
      "currency": "usd",
      "interval": "month",
      "interval_count": 1,
      "livemode": false,
      "metadata": {
      },
      "name": "Test ABCEFC",
      "statement_descriptor": null,
      "trial_period_days": null
    },
    "quantity": 1,
    "start": 1481090207,
    "status": "active",
    "tax_percent": null,
    "trial_end": null,
    "trial_start": null
  },
  Subscription: {
    "reference_id": "sub_7Ub0lcBP8An6jC",
    "status": "active"
  }
}

module.exports = Fixtures

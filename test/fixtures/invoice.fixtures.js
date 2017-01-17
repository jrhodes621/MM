var Fixtures = {
  StripeInvoice: {
    "id": "in_19ZjOj4IZxLlgOpCnCIfvLPY",
    "object": "invoice",
    "amount_due": 10000,
    "application_fee": null,
    "attempt_count": 1,
    "attempted": true,
    "charge": null,
    "closed": true,
    "currency": "usd",
    "customer": "cus_9tagyvZXCzFCj9",
    "date": 1483892397,
    "description": null,
    "discount": null,
    "ending_balance": 0,
    "forgiven": false,
    "lines": {
      "data": [
        {
          "id": "sub_7VaeoYjKcYJzQI",
          "object": "line_item",
          "amount": 10000,
          "currency": "usd",
          "description": null,
          "discountable": true,
          "livemode": true,
          "metadata": {
          },
          "period": {
            "start": 1484074103,
            "end": 1486752503
          },
          "plan": {
            "id": "Test Plan BCD",
            "object": "plan",
            "amount": 10000,
            "created": 1481060635,
            "currency": "usd",
            "interval": "month",
            "interval_count": 1,
            "livemode": false,
            "metadata": {
            },
            "name": "Test Plan BCD4",
            "statement_descriptor": null,
            "trial_period_days": null
          },
          "proration": false,
          "quantity": 1,
          "subscription": null,
          "type": "subscription"
        }
      ],
      "total_count": 1,
      "object": "list",
      "url": "/v1/invoices/in_19ZjOj4IZxLlgOpCnCIfvLPY/lines"
    },
    "livemode": false,
    "metadata": {
    },
    "next_payment_attempt": null,
    "paid": true,
    "period_end": 1483892360,
    "period_start": 1481213960,
    "receipt_number": null,
    "starting_balance": 0,
    "statement_descriptor": null,
    "subscription": null,
    "subtotal": 10000,
    "tax": null,
    "tax_percent": null,
    "total": 10000,
    "webhooks_delivered_at": 1483892407
  }
}

module.exports = Fixtures

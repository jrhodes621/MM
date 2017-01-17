var Fixtures = {
  Created: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "invoice.created",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "id": "in_00000000000000",
        "object": "invoice",
        "amount_due": 10000,
        "application_fee": null,
        "attempt_count": 1,
        "attempted": false,
        "charge": null,
        "closed": false,
        "currency": "usd",
        "customer": "cus_00000000000000",
        "date": 1484074417,
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
              "metadata": {},
              "period": {
                "start": 1486752503,
                "end": 1489171703
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
                "metadata": {},
                "name": "Test Plan BCD4",
                "statement_descriptor": null,
                "trial_period_days": null,
                "statement_description": null
              },
              "proration": false,
              "quantity": 1,
              "subscription": null,
              "type": "subscription"
            }
          ],
          "total_count": 1,
          "object": "list",
          "url": "/v1/invoices/in_19aUkX4IZxLlgOpC0jgJfi0r/lines"
        },
        "livemode": false,
        "metadata": {},
        "next_payment_attempt": 1484592818,
        "paid": true,
        "period_end": 1484074103,
        "period_start": 1481395703,
        "receipt_number": null,
        "starting_balance": 0,
        "statement_descriptor": null,
        "subscription": "sub_00000000000000",
        "subtotal": 10000,
        "tax": null,
        "tax_percent": null,
        "total": 10000,
        "webhooks_delivered_at": null,
        "statement_description": null,
        "payment": null
      }
    }
  },
  PaymentFailed: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "invoice.payment_failed",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "id": "in_00000000000000",
        "object": "invoice",
        "amount_due": 10000,
        "application_fee": null,
        "attempt_count": 1,
        "attempted": true,
        "charge": null,
        "closed": false,
        "currency": "usd",
        "customer": "cus_00000000000000",
        "date": 1484074417,
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
              "metadata": {},
              "period": {
                "start": 1486752503,
                "end": 1489171703
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
                "metadata": {},
                "name": "Test Plan BCD4",
                "statement_descriptor": null,
                "trial_period_days": null,
                "statement_description": null
              },
              "proration": false,
              "quantity": 1,
              "subscription": null,
              "type": "subscription"
            }
          ],
          "total_count": 1,
          "object": "list",
          "url": "/v1/invoices/in_19aUkX4IZxLlgOpC0jgJfi0r/lines"
        },
        "livemode": false,
        "metadata": {},
        "next_payment_attempt": 1484592818,
        "paid": false,
        "period_end": 1484074103,
        "period_start": 1481395703,
        "receipt_number": null,
        "starting_balance": 0,
        "statement_descriptor": null,
        "subscription": "sub_00000000000000",
        "subtotal": 10000,
        "tax": null,
        "tax_percent": null,
        "total": 10000,
        "webhooks_delivered_at": null,
        "statement_description": null,
        "payment": null
      }
    }
  },
  PaymentSucceeded: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "invoice.payment_succeeded",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "id": "in_00000000000000",
        "object": "invoice",
        "amount_due": 10000,
        "application_fee": null,
        "attempt_count": 1,
        "attempted": true,
        "charge": "_00000000000000",
        "closed": true,
        "currency": "usd",
        "customer": "cus_00000000000000",
        "date": 1484074417,
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
              "metadata": {},
              "period": {
                "start": 1486752503,
                "end": 1489171703
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
                "metadata": {},
                "name": "Test Plan BCD4",
                "statement_descriptor": null,
                "trial_period_days": null,
                "statement_description": null
              },
              "proration": false,
              "quantity": 1,
              "subscription": null,
              "type": "subscription"
            }
          ],
          "total_count": 1,
          "object": "list",
          "url": "/v1/invoices/in_19aUkX4IZxLlgOpC0jgJfi0r/lines"
        },
        "livemode": false,
        "metadata": {},
        "next_payment_attempt": 1484592818,
        "paid": true,
        "period_end": 1484074103,
        "period_start": 1481395703,
        "receipt_number": null,
        "starting_balance": 0,
        "statement_descriptor": null,
        "subscription": "sub_00000000000000",
        "subtotal": 10000,
        "tax": null,
        "tax_percent": null,
        "total": 10000,
        "webhooks_delivered_at": null,
        "statement_description": null,
        "payment": null
      }
    }
  },
  Sent: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "invoice.sent",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "id": "in_00000000000000",
        "object": "invoice",
        "amount_due": 10000,
        "application_fee": null,
        "attempt_count": 1,
        "attempted": true,
        "charge": null,
        "closed": false,
        "currency": "usd",
        "customer": "cus_00000000000000",
        "date": 1484074417,
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
              "metadata": {},
              "period": {
                "start": 1486752503,
                "end": 1489171703
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
                "metadata": {},
                "name": "Test Plan BCD4",
                "statement_descriptor": null,
                "trial_period_days": null,
                "statement_description": null
              },
              "proration": false,
              "quantity": 1,
              "subscription": null,
              "type": "subscription"
            }
          ],
          "total_count": 1,
          "object": "list",
          "url": "/v1/invoices/in_19aUkX4IZxLlgOpC0jgJfi0r/lines"
        },
        "livemode": false,
        "metadata": {},
        "next_payment_attempt": 1484592818,
        "paid": false,
        "period_end": 1484074103,
        "period_start": 1481395703,
        "receipt_number": null,
        "starting_balance": 0,
        "statement_descriptor": null,
        "subscription": "sub_00000000000000",
        "subtotal": 10000,
        "tax": null,
        "tax_percent": null,
        "total": 10000,
        "webhooks_delivered_at": null,
        "statement_description": null,
        "payment": null
      }
    }
  },
  Updated: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "invoice.updated",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "id": "in_00000000000000",
        "object": "invoice",
        "amount_due": 10000,
        "application_fee": null,
        "attempt_count": 1,
        "attempted": true,
        "charge": null,
        "closed": false,
        "currency": "usd",
        "customer": "cus_00000000000000",
        "date": 1484074417,
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
              "metadata": {},
              "period": {
                "start": 1486752503,
                "end": 1489171703
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
                "metadata": {},
                "name": "Test Plan BCD4",
                "statement_descriptor": null,
                "trial_period_days": null,
                "statement_description": null
              },
              "proration": false,
              "quantity": 1,
              "subscription": null,
              "type": "subscription"
            }
          ],
          "total_count": 1,
          "object": "list",
          "url": "/v1/invoices/in_19aUkX4IZxLlgOpC0jgJfi0r/lines"
        },
        "livemode": false,
        "metadata": {},
        "next_payment_attempt": 1484592818,
        "paid": false,
        "period_end": 1484074103,
        "period_start": 1481395703,
        "receipt_number": null,
        "starting_balance": 0,
        "statement_descriptor": null,
        "subscription": "sub_00000000000000",
        "subtotal": 10000,
        "tax": null,
        "tax_percent": null,
        "total": 10000,
        "webhooks_delivered_at": null,
        "statement_description": null,
        "payment": null
      },
      "previous_attributes": {
        "lines": []
      }
    }
  }
}

module.exports = Fixtures

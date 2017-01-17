var Fixtures = {
  StripeInvoiceItem: var invoice_line_item = {
    "id": "ii_19NyQ74IZxLlgOpCyH61MJ3i",
    "object": "line_item",
    "amount": -1179,
    "currency": "usd",
    "description": "Unused time on Co-Working 3 days per week after 07 Dec 2016",
    "discountable": false,
    "livemode": false,
    "metadata": {
    },
    "period": {
      "start": 1481090207,
      "end": 1481090207
    },
    "plan": {
      "id": "First SomeHero Plan",
      "object": "plan",
      "amount": 10000,
      "created": 1449773230,
      "currency": "usd",
      "interval": "month",
      "interval_count": 1,
      "livemode": false,
      "metadata": {
        "description": "A membership doesn't just mean you get to work in a collaborative and creative space, but you become part of a community of freelancers, independents, and start-ups.  You'll get access to events, extra exposure, and chances to start great conversations.\n\nNo more hunting for that perfect person to work with on a big project because they are most likely sitting next to you.",
        "termsofservice": "These are my terms of service"
      },
      "name": "Co-Working 3 days per week",
      "statement_descriptor": null,
      "trial_period_days": null
    },
    "proration": true,
    "quantity": 1,
    "subscription": "sub_7VaeoYjKcYJzQI",
    "type": "invoiceitem"
  }
}

module.exports = Fixtures

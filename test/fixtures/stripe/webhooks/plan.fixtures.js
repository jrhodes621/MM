var Fixtures = {
  Created: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "plan.created",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "user_id": "acct_00000000000000",
    "data": {
      "object": {
        "id": "Test Plan BCD_00000000000000",
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
      }
    }
  },
  Updated: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "plan.updated",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "id": "Test Plan BCD_00000000000000",
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
      "previous_attributes": {
        "name": "Old name"
      }
    }
  },
  Deleted: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "plan.deleted",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "id": "Test Plan BCD_00000000000000",
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
      }
    }
  }
}

module.exports = Fixtures

Fixtures: {
  Closed: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.dispute.closed",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "user_id": "acct_00000000000000",
    "data": {
      "object": {
        "id": "dp_00000000000000",
        "object": "dispute",
        "amount": 1000,
        "balance_transactions": [],
        "charge": "ch_00000000000000",
        "created": 1484363958,
        "currency": "usd",
        "evidence": {
          "uncategorized_text": "Here is some evidence"
        },
        "is_charge_refundable": false,
        "livemode": false,
        "metadata": {},
        "reason": "general",
        "status": "won",
        "evidence_due_by": 1486079999
      }
    }
  },
  Created: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.dispute.created",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "user_id": "acct_00000000000000",
    "data": {
      "object": {
        "id": "dp_00000000000000",
        "object": "dispute",
        "amount": 1000,
        "balance_transactions": [],
        "charge": "ch_00000000000000",
        "created": 1484364003,
        "currency": "usd",
        "evidence": null,
        "is_charge_refundable": false,
        "livemode": false,
        "metadata": {},
        "reason": "general",
        "status": "needs_response",
        "evidence_due_by": 1486079999
      }
    }
  },
  FundsReinstated: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.dispute.funds_reinstated",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "user_id": "acct_00000000000000",
    "data": {
      "object": {
        "id": "dp_00000000000000",
        "object": "dispute",
        "amount": 1000,
        "balance_transactions": [],
        "charge": "ch_00000000000000",
        "created": 1484364022,
        "currency": "usd",
        "evidence": null,
        "is_charge_refundable": false,
        "livemode": false,
        "metadata": {},
        "reason": "general",
        "status": "needs_response",
        "evidence_due_by": 1486079999
      }
    }
  },
  FundsWithdrawn: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.dispute.funds_withdrawn",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "user_id": "acct_00000000000000",
    "data": {
      "object": {
        "id": "dp_00000000000000",
        "object": "dispute",
        "amount": 1000,
        "balance_transactions": [],
        "charge": "ch_00000000000000",
        "created": 1484364052,
        "currency": "usd",
        "evidence": null,
        "is_charge_refundable": false,
        "livemode": false,
        "metadata": {},
        "reason": "general",
        "status": "needs_response",
        "evidence_due_by": 1486079999
      }
    }
  },
  Updated: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.dispute.updated",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "user_id": "acct_00000000000000",
    "data": {
      "object": {
        "id": "dp_00000000000000",
        "object": "dispute",
        "amount": 1000,
        "balance_transactions": [],
        "charge": "ch_00000000000000",
        "created": 1484364078,
        "currency": "usd",
        "evidence": {
          "uncategorized_text": "Here is some evidence"
        },
        "is_charge_refundable": false,
        "livemode": false,
        "metadata": {},
        "reason": "general",
        "status": "under_review",
        "evidence_due_by": 1486079999
      },
      "previous_attributes": {
        "evidence": {
          "uncategorized_text": "Old uncategorized text"
        }
      }
    }
  }
}

module.exports = Fixtures

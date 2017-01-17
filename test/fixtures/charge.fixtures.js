var Fixtures = {
  StripeCharge: {
    "id": "ch_19ZkKz4IZxLlgOpCenAgbiox",
    "object": "charge",
    "amount": 10000,
    "amount_refunded": 0,
    "application": null,
    "application_fee": null,
    "balance_transaction": "txn_19ZZAA4IZxLlgOpCeGDfg50w",
    "captured": true,
    "created": 1483896009,
    "currency": "usd",
    "customer": "cus_7UTxa99v3FSx0M",
    "description": null,
    "destination": null,
    "dispute": null,
    "failure_code": null,
    "failure_message": null,
    "fraud_details": {
    },
    "invoice": "in_19ZjOj4IZxLlgOpCnCIfvLPY",
    "livemode": false,
    "metadata": {
    },
    "order": null,
    "outcome": {
      "network_status": "approved_by_network",
      "reason": null,
      "seller_message": "Payment complete.",
      "type": "authorized"
    },
    "paid": true,
    "receipt_email": null,
    "receipt_number": null,
    "refunded": false,
    "refunds": {
      "object": "list",
      "data": [

      ],
      "has_more": false,
      "total_count": 0,
      "url": "/v1/charges/ch_19ZkKz4IZxLlgOpCenAgbiox/refunds"
    },
    "review": null,
    "shipping": null,
    "source": {
      "id": "card_17GZSl4IZxLlgOpCvcYZN0qt",
      "object": "card",
      "address_city": null,
      "address_country": null,
      "address_line1": null,
      "address_line1_check": null,
      "address_line2": null,
      "address_state": null,
      "address_zip": null,
      "address_zip_check": null,
      "brand": "Visa",
      "country": "US",
      "customer": "cus_7UTxa99v3FSx0M",
      "cvc_check": null,
      "dynamic_last4": null,
      "exp_month": 6,
      "exp_year": 2019,
      "funding": "unknown",
      "last4": "1111",
      "metadata": {
      },
      "name": "James G Rhodes",
      "tokenization_method": null
    },
    "source_transfer": null,
    "statement_descriptor": null,
    "status": "succeeded"
  },
  Charge: {
    "status": "succeeded",
    "statement_descriptor": null,
    "source_transfer": null,
    "shipping": null,
    "refunded": false,
    "receipt_number": null,
    "receipt_email": null,
    "paid": true,
    "invoice": "in_19PFv14IZxLlgOpC4HW67z6x",
    "failure_message": null,
    "failure_code": null,
    "dispute": null,
    "destination": null,
    "description": null,
    "currency": "usd",
    "captured": true,
    "balance_transaction": "txn_19PGrJ4IZxLlgOpCf7g0t6DE",
    "amount_refunded": 0,
    "amount": 100,
    "reference_id": "ch_19PGrJ4IZxLlgOpCndNKvlqn",
    "card_info": "unknown card"
  }
}

module.exports = Fixtures

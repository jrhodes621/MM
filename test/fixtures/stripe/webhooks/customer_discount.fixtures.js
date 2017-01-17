var Fixtures = {
  Created: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.discount.created",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "object": "discount",
        "coupon": {
          "id": "QZ0GUAmh_00000000000000",
          "object": "coupon",
          "amount_off": 1000,
          "created": 1449773229,
          "currency": "usd",
          "duration": "once",
          "duration_in_months": null,
          "livemode": false,
          "max_redemptions": null,
          "metadata": {},
          "percent_off": null,
          "redeem_by": null,
          "times_redeemed": 2,
          "valid": true
        },
        "customer": "cus_00000000000000",
        "end": null,
        "start": 1449543999,
        "subscription": "sub_00000000000000"
      }
    }
  },
  Deleted: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.discount.deleted",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "object": "discount",
        "coupon": {
          "id": "QZ0GUAmh_00000000000000",
          "object": "coupon",
          "amount_off": 1000,
          "created": 1449773229,
          "currency": "usd",
          "duration": "once",
          "duration_in_months": null,
          "livemode": false,
          "max_redemptions": null,
          "metadata": {},
          "percent_off": null,
          "redeem_by": null,
          "times_redeemed": 2,
          "valid": true
        },
        "customer": "cus_00000000000000",
        "end": null,
        "start": 1449543999,
        "subscription": "sub_00000000000000"
      }
    }
  },
  Updated: {
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.discount.updated",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2014-08-20",
    "data": {
      "object": {
        "object": "discount",
        "coupon": {
          "id": "QZ0GUAmh_00000000000000",
          "object": "coupon",
          "amount_off": 1000,
          "created": 1449773229,
          "currency": "usd",
          "duration": "once",
          "duration_in_months": null,
          "livemode": false,
          "max_redemptions": null,
          "metadata": {},
          "percent_off": null,
          "redeem_by": null,
          "times_redeemed": 2,
          "valid": true
        },
        "customer": "cus_00000000000000",
        "end": null,
        "start": 1449543999,
        "subscription": "sub_00000000000000"
      },
      "previous_attributes": {
        "coupon": {
          "id": "OLD_COUPON_ID",
          "object": "coupon",
          "amount_off": 1000,
          "created": 1449773229,
          "currency": "usd",
          "duration": "once",
          "duration_in_months": null,
          "livemode": false,
          "max_redemptions": null,
          "metadata": {},
          "percent_off": null,
          "redeem_by": null,
          "times_redeemed": 2,
          "valid": true
        }
      }
    }
  }
}

module.exports = Fixtures

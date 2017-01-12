var paypal_plan = {
  "id": "P-7DC96732KA7763723UOPKETA",
  "state": "CREATED",
  "name": "Sample Plan",
  "description": "Plan with regular and trial",
  "type": "FIXED",
  "payment_definitions": [
    {
      "id": "PD-0MF87809KK310750TUOPKETA",
      "name": "Regular Payment Definition",
      "type": "REGULAR",
      "frequency": "Month",
      "amount": {
        "currency": "USD",
        "value": "100"
      },
      "charge_models": [
        {
          "id": "CHM-89H01708244053321UOPKETA",
          "type": "SHIPPING",
          "amount": {
            "currency": "USD",
            "value": "10"
          }
        },
        {
          "id": "CHM-1V202179WT9709019UOPKETA",
          "type": "TAX",
          "amount": {
            "currency": "USD",
            "value": "12"
          }
        }
      ],
      "cycles": "12",
      "frequency_interval": "2"
    },
    {
      "id": "PD-03223056L66578712UOPKETA",
      "name": "Trial Payment Definition",
      "type": "TRIAL",
      "frequency": "Week",
      "amount": {
        "currency": "USD",
        "value": "9.19"
      },
      "charge_models": [
        {
          "id": "CHM-7XN63093LF858372XUOPKETA",
          "type": "SHIPPING",
          "amount": {
            "currency": "USD",
            "value": "1"
          }
        },
        {
          "id": "CHM-6JY06508UT8026625UOPKETA",
          "type": "TAX",
          "amount": {
            "currency": "USD",
            "value": "2"
          }
        }
      ],
      "cycles": "2",
      "frequency_interval": "5"
    }
  ],
  "merchant_preferences": {
    "setup_fee": {
      "currency": "USD",
      "value": "1"
    },
    "max_fail_attempts": "0",
    "return_url": "http://www.paypal.com",
    "cancel_url": "http://www.yahoo.com",
    "auto_bill_amount": "YES",
    "initial_fail_amount_action": "CONTINUE"
  },
  "create_time": "2014-06-16T07:40:20.940Z",
  "update_time": "2014-06-16T07:40:20.940Z",
  "links": [
    {
      "href": "https://localhost:12379/v1/payments/billing-plans/P-7DC96732KA7763723UOPKETA",
      "rel": "self",
      "method": "GET"
    }
  ]
}

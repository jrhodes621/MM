var factory = require('factory-girl');
var faker = require('faker');
var Account    = require('../../models/account');

factory.define('account', Account, function(buildOptions) {
  var account = {
    company_name: faker.company.companyName(),
    subdomain: faker.internet.domainWord(),
    status: "active"
  }

  return account;
});

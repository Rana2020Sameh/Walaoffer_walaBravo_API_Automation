import CryptoJS from 'crypto-js';

describe('Aramco API Tests', () => {
  let data;
  let timestamp;
  let secret;
  before(() => {
    cy.fixture('loginNorma.json').then((Logindata) => {
      data = Logindata; // Store fixture data in a variable
    cy.log('data ::: ', data.user_identifier);
  });
    //Generate Timestamp
    timestamp = Math.floor(Date.now() / 1000);
    // Define request parameters
    let params = {
      method: 'POST',
      request: '/v2/users/login',
      user_identifier: 'user@walf.com',
      client: 'i',
      timestamp: timestamp,
      password: '2T+3oX5zp1TbEkEtwWq52g==',
    };
//+${params.password}
    // Generate Secret Key (Signature)
    const secret_key = 'f25522a5b819378b079ae015f0b4141de15baf33a366abfa015b5237ccaff71f';  // Replace with actual key
    const signature = `${params.method}+${params.request}+${params.timestamp}+${params.client}+${params.user_identifier}+${params.password}`;
    secret = CryptoJS.HmacSHA256(signature, secret_key).toString();
    cy.log(`signature: ${signature}`);
  });

  it('Login with Secure Authentication', () => {
    cy.request({
      method: "POST",
      url: data.request,
      body: {
          timestamp: timestamp,
          secret: secret,
          user_identifier: data.user_identifier,
          password: data.password,
          udid: data.udid,
          client: data.client,
          tenant: data.tenant,
          language: data.language
      },
      failOnStatusCode: false  // ✅ Prevent test from failing immediately
  }).then((response) => {
      cy.log(`Response: ${JSON.stringify(response.body)}`);  // ✅ Debugging
    });
  });
});


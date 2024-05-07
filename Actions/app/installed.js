/**
 *  this function is exeucted on "app.installed" action triggered by Salla .
 *
 * Action Body received from Salla
 * @param {Object} eventBody
 * { 
 *  event: 'app.installed',
    merchant: 472944967,
    created_at: '2021-11-22 13:51:57',
    data:
 *    {
 *      "id":1911645512,
 *      "app_name":"app name",
 *      "app_description":"desc",
 *      "app_type":"app",
 *      "app_scopes":[ 
 *        'settings.read',
 *        'customers.read_write',
 *        'orders.read_write',
 *        'carts.read',
 *        ...
 *      ],
 *      "installation_date":"2021-11-21 11:07:13"
 *    }
 * }
 * Arguments passed by you:
 * @param {Object} userArgs
 * { key:"val" }
 * @api public
 */
module.exports = (eventBody, userArgs) => {
  // Extract the scopes from the event body
  const receivedScopes = eventBody.data.app_scopes;

  // Define the required scopes
  const requiredScopes = [
    "settings.read",
    "customers.read_write",
    "orders.read_write",
    "carts.read",
  ];

  // Check if all required scopes are included in the received scopes
  const hasAllScopes = requiredScopes.every((scope) =>
    receivedScopes.includes(scope)
  );

  if (!hasAllScopes) {
    // Logic to handle the scenario where not all required scopes are granted
    console.log(
      "Not all required scopes are granted:",
      requiredScopes.filter((scope) => !receivedScopes.includes(scope))
    );
    // You might want to alert the user, log this issue, or handle it according to your application's needs
    return {
      error: "Insufficient permissions granted. Required scopes are missing.",
    };
  }

  // If all required scopes are present, proceed with your logic
  console.log("All required scopes are granted:", receivedScopes);

  // Your normal processing logic here
  return null; // or appropriate response/action
};

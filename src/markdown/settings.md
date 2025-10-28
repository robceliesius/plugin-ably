# Plugin Settings

## Token Endpoint URL (Required)

Your backend endpoint that generates Ably authentication tokens.

**Example:** `https://your-api.com/ably/token`

### What this endpoint should do:

1. Receive a POST request with:
   ```json
   {
     "clientId": "user-123",
     "userId": "weweb-user-id",
     "userEmail": "user@example.com"
   }
   ```

2. Generate an Ably token with appropriate capabilities

3. Return token data:
   ```json
   {
     "token": "xVLyHw.D-s7...",
     "expires": 1697832123456,
     "clientId": "user-123",
     "capability": "{\"*\":[\"*\"]}"
   }
   ```

### Example Implementation (Node.js/Express)

```javascript
const Ably = require('ably');
const ablyRest = new Ably.Rest({ key: process.env.ABLY_API_KEY });

app.post('/ably/token', async (req, res) => {
  const { clientId } = req.body;
  
  const tokenRequest = await ablyRest.auth.createTokenRequest({
    clientId: clientId || `user-${Date.now()}`,
    capability: {
      '*': ['subscribe', 'publish', 'presence', 'history']
    },
    ttl: 60 * 60 * 1000, // 1 hour
  });
  
  res.json(tokenRequest);
});
```

## Client ID (Optional)

Unique identifier for this client connection. Used for:
- Identifying users in presence
- Required for Ably Spaces features
- Tracking who sent messages

**Default:** WeWeb user ID (if logged in) or auto-generated

**Can be bound to:** Any formula (e.g., `user.email`, `user.id`)

## Echo Messages

If enabled, messages you publish will be echoed back to your client.

**Default:** Enabled

**Use case:** Disable if you want to avoid seeing your own messages in message listeners.

## Auto Connect

If enabled, the plugin automatically connects to Ably when the page loads.

**Default:** Enabled

**Use case:** Disable if you want to manually control when to connect (e.g., after user login).

## Testing Connection

Click "Test Connection" to verify:
- Token endpoint is reachable
- Token generation works
- Ably connection succeeds

If the test fails, check:
- Token endpoint URL is correct
- Endpoint is returning valid token data
- CORS is configured correctly
- Ably API key is valid in your backend


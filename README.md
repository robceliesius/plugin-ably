# Ably Plugin for WeWeb

A comprehensive WeWeb plugin that integrates Ably's real-time messaging and Ably Spaces collaboration features into your no-code applications.

## Features

### Core Ably Capabilities
- ✅ Real-time pub/sub messaging
- ✅ Channel subscriptions with event listeners
- ✅ Presence tracking (who's online)
- ✅ Message history as data source collections
- ✅ Token-based authentication
- ✅ Automatic token refresh

### Ably Spaces Collaboration
- ✅ Member location tracking
- ✅ Live cursor positions
- ✅ Avatar stack data
- ✅ Component locking for concurrent editing prevention
- ✅ Real-time member enter/leave events

## Installation

1. Add the plugin to your WeWeb project
2. Configure your token endpoint in plugin settings
3. Start using actions and triggers in your workflows

## Token Authentication Setup

This plugin uses **token authentication** for maximum security. Your Ably API keys never leave your backend.

### Step 1: Create a Token Endpoint

Create a backend endpoint that generates Ably tokens. Here's an example:

#### Node.js/Express

```javascript
const express = require('express');
const Ably = require('ably');

const app = express();
app.use(express.json());

// Initialize Ably REST client with your API key
const ablyRest = new Ably.Rest({ 
  key: process.env.ABLY_API_KEY // Keep this secret!
});

app.post('/api/ably/token', async (req, res) => {
  try {
    const { clientId, userId, userEmail } = req.body;
    
    // Optional: Verify the user is authenticated
    // const token = req.headers.authorization;
    // await verifyUserToken(token);
    
    // Define capabilities (permissions) for this token
    const capability = {
      '*': ['subscribe', 'publish', 'presence', 'history'],
      // Or restrict by channel pattern:
      // 'public:*': ['subscribe'],
      // 'private:user-123:*': ['subscribe', 'publish', 'presence']
    };
    
    // Generate token request
    const tokenRequest = await ablyRest.auth.createTokenRequest({
      clientId: clientId || userId || `user-${Date.now()}`,
      capability: capability,
      ttl: 60 * 60 * 1000, // 1 hour expiry
    });
    
    res.json(tokenRequest);
  } catch (error) {
    console.error('Token generation failed:', error);
    res.status(500).json({ 
      error: 'Token generation failed',
      message: error.message 
    });
  }
});

app.listen(3000, () => {
  console.log('Token server running on port 3000');
});
```

#### Supabase Edge Function

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Ably from 'https://esm.sh/ably@1.2.50'

serve(async (req) => {
  try {
    const { clientId, userId } = await req.json()
    
    const ably = new Ably.Rest({ 
      key: Deno.env.get('ABLY_API_KEY') 
    })
    
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: clientId || userId || crypto.randomUUID(),
      capability: { '*': ['subscribe', 'publish', 'presence', 'history'] },
      ttl: 60 * 60 * 1000,
    })
    
    return new Response(JSON.stringify(tokenRequest), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### Step 2: Configure CORS

Your token endpoint must allow requests from WeWeb domains:

```javascript
app.use(cors({
  origin: [
    'https://editor.weweb.io',
    'https://preview.weweb.io',
    'https://your-app.weweb.io', // Your published app domain
  ],
  credentials: true,
}));
```

### Step 3: Configure Plugin Settings

In WeWeb:
1. Open your Ably plugin settings
2. Enter your token endpoint URL (e.g., `https://your-api.com/api/ably/token`)
3. Optionally configure Client ID (defaults to WeWeb user ID)
4. Click "Test Connection" to verify

## Token Capabilities

Control what users can do with token capabilities:

```javascript
// Full access to all channels
capability: { '*': ['*'] }

// Read-only access
capability: { '*': ['subscribe', 'history'] }

// Channel-specific access
capability: {
  'public:*': ['subscribe'],
  'chat:room-1': ['subscribe', 'publish', 'presence'],
  'admin:*': ['subscribe', 'publish', 'presence', 'history']
}

// User-specific channels
capability: {
  [`private:${userId}:*`]: ['subscribe', 'publish', 'presence']
}
```

## Actions Reference

### Core Ably Actions

#### Connect to Ably
Manually connect to Ably (auto-connects by default).

**Use case:** Connect after user login

#### Disconnect from Ably
Disconnect and cleanup all channels and spaces.

**Use case:** Clean disconnect on logout

#### Subscribe to Channel
Subscribe to a channel to receive messages.

**Parameters:**
- `channelName` (string, required): Channel name
- `enablePresence` (boolean): Join presence and track who's online

**Example:**
```javascript
channelName: "chat-room-1"
enablePresence: true
```

#### Unsubscribe from Channel
Unsubscribe from a channel.

**Parameters:**
- `channelName` (string, required): Channel name

#### Publish Message
Publish a message to a channel.

**Parameters:**
- `channelName` (string, required): Channel name
- `messageName` (string, required): Event name for filtering
- `data` (object): Message payload

**Example:**
```javascript
channelName: "chat-room-1"
messageName: "message"
data: {
  text: "Hello world!",
  timestamp: Date.now()
}
```

#### Get Channel Presence
Get all members currently present on a channel.

**Parameters:**
- `channelName` (string, required): Channel name
- `waitForSync` (boolean): Wait for presence to sync (recommended)

**Returns:** Array of presence members

#### Get Channel History
Fetch message history from a channel.

**Parameters:**
- `channelName` (string, required): Channel name
- `limit` (number): Max messages to retrieve (default: 50)
- `direction` (string): "backwards" or "forwards"

**Returns:** Array of historical messages

### Ably Spaces Actions

#### Spaces | Enter Space
Enter a collaborative space.

**Parameters:**
- `spaceName` (string, required): Space name
- `memberName` (string): Display name
- `memberAvatar` (string): Avatar URL
- `memberColor` (string): Hex color for cursor/presence

**Example:**
```javascript
spaceName: "design-canvas"
memberName: "{{ user.name }}"
memberAvatar: "{{ user.avatar }}"
memberColor: "#FF5733"
```

#### Spaces | Leave Space
Leave a space.

**Parameters:**
- `spaceName` (string, required): Space name

#### Spaces | Update Location
Update your location within a space.

**Parameters:**
- `spaceName` (string, required): Space name
- `location` (object, required): Location data

**Example:**
```javascript
location: {
  slide: 1,
  element: "button-header",
  viewport: { x: 100, y: 200 }
}
```

#### Spaces | Update Cursor
Update your cursor position.

**Parameters:**
- `spaceName` (string, required): Space name
- `position` (object, required): `{ x: number, y: number }`
- `data` (object): Additional cursor metadata

**Example workflow:**
1. On mouse move event
2. Call Update Cursor action with `{ x: event.x, y: event.y }`

#### Spaces | Lock Component
Lock a component to prevent concurrent editing.

**Parameters:**
- `spaceName` (string, required): Space name
- `componentId` (string, required): Unique component identifier
- `metadata` (object): Optional lock metadata

**Example:**
```javascript
componentId: "element-123"
metadata: { reason: "editing" }
```

**Note:** Only the member who locked can unlock. Locks auto-release on space leave.

#### Spaces | Unlock Component
Release a component lock.

**Parameters:**
- `spaceName` (string, required): Space name
- `componentId` (string, required): Component identifier

#### Spaces | Get Members
Get all members in a space.

**Parameters:**
- `spaceName` (string, required): Space name

**Returns:**
```javascript
[
  {
    clientId: "user-123",
    profileData: { name: "John", avatar: "...", color: "#FF5733" },
    location: { slide: 1 },
    isConnected: true
  }
]
```

#### Spaces | Get Space State
Get complete space state (members, cursors, locks).

**Parameters:**
- `spaceName` (string, required): Space name

**Returns:**
```javascript
{
  spaceName: "design-canvas",
  members: [...],
  cursors: [...],
  locks: [...]
}
```

## Triggers Reference

### Core Ably Triggers

#### On Connection Status Change
Triggered when connection state changes.

**Event data:**
```javascript
{
  status: "connected" | "disconnected" | "failed",
  error: "error message" | null,
  timestamp: 1697828523000
}
```

**Conditions:**
- Status filter: All, Connected, Disconnected, Failed

#### On Message Received
Triggered when a message is received on a subscribed channel.

**Event data:**
```javascript
{
  channelName: "chat-room-1",
  messageName: "message",
  data: { /* message payload */ },
  timestamp: 1697828523000,
  clientId: "sender-id"
}
```

**Conditions:**
- Channel Name: Filter by specific channel
- Message Name: Filter by message type

#### On Presence Enter
Triggered when a member joins a channel.

**Event data:**
```javascript
{
  channelName: "chat-room-1",
  clientId: "user-123",
  data: { /* presence data */ },
  timestamp: 1697828523000
}
```

#### On Presence Leave
Triggered when a member leaves a channel.

#### On Presence Update
Triggered when a member updates their presence data.

### Ably Spaces Triggers

#### Spaces | On Member Enter
Triggered when a member enters a space.

**Event data:**
```javascript
{
  spaceName: "design-canvas",
  member: {
    clientId: "user-123",
    profileData: { name: "John", avatar: "...", color: "#FF5733" },
    location: { slide: 1 }
  }
}
```

#### Spaces | On Member Leave
Triggered when a member leaves a space.

#### Spaces | On Location Update
Triggered when a member changes location.

**Event data:**
```javascript
{
  spaceName: "design-canvas",
  member: { clientId: "user-123", location: { slide: 2 } },
  previousLocation: { slide: 1 }
}
```

#### Spaces | On Cursor Move
Triggered when a member moves their cursor.

**Event data:**
```javascript
{
  spaceName: "design-canvas",
  member: { clientId: "user-123" },
  position: { x: 150, y: 250 },
  data: { state: "drawing" }
}
```

#### Spaces | On Lock Acquired
Triggered when a component is locked.

**Event data:**
```javascript
{
  spaceName: "design-canvas",
  componentId: "element-123",
  member: { clientId: "user-123" },
  metadata: { reason: "editing" },
  timestamp: 1697828523000
}
```

#### Spaces | On Lock Released
Triggered when a component is unlocked.

## Collection Usage

Use the **Channel History** collection to fetch message history as a data source.

### Configuration

1. Create a new collection
2. Select Ably as the data source
3. Configure:
   - **Channel Name**: The channel to fetch from
   - **Limit**: Max messages (default: 50)
   - **Direction**: Backwards (newest first) or Forwards
   - **Start/End Time**: Optional time filters

### Example: Recent Chat Messages

```
Channel Name: "chat-room-1"
Limit: 20
Direction: Backwards
```

Bind this collection to a repeater to display recent messages.

## Real-World Examples

### Example 1: Chat Application

**Setup:**
1. Subscribe to channel on page load:
   - Action: Subscribe to Channel
   - Channel: `chat-room-{{ pageId }}`
   - Enable Presence: true

2. Display messages using collection:
   - Data source: Ably Channel History
   - Channel: `chat-room-{{ pageId }}`

3. Send message workflow:
   - Trigger: Button click
   - Action: Publish Message
   - Channel: `chat-room-{{ pageId }}`
   - Message Name: "message"
   - Data: `{ text: input.value, user: user.name }`

4. Receive messages workflow:
   - Trigger: On Message Received
   - Condition: Channel = `chat-room-{{ pageId }}`
   - Action: Append to variable (messages array)

5. Display who's online:
   - Trigger: On Presence Enter/Leave
   - Action: Update online users variable

### Example 2: Collaborative Whiteboard

**Setup:**
1. Enter space on page load:
   - Action: Enter Space
   - Space: "whiteboard-{{ boardId }}"
   - Member data from user profile

2. Track cursor movements:
   - Trigger: Mouse move
   - Action: Update Cursor
   - Position: `{ x: event.clientX, y: event.clientY }`

3. Display other cursors:
   - Trigger: On Cursor Move
   - Action: Update cursor variable (by clientId)
   - Display cursors using repeater

4. Lock elements when editing:
   - Trigger: Element click (edit mode)
   - Action: Lock Component
   - Component ID: `{{ element.id }}`

5. Show who's editing what:
   - Trigger: On Lock Acquired
   - Action: Add lock indicator to UI

6. Release lock when done:
   - Trigger: Save/Cancel button
   - Action: Unlock Component

### Example 3: Live Dashboard Updates

**Setup:**
1. Subscribe to data channel:
   - Action: Subscribe to Channel
   - Channel: "dashboard-updates"

2. Update dashboard on message:
   - Trigger: On Message Received
   - Condition: Message Name = "metrics-update"
   - Action: Update variables with new data
   - Effect: Charts auto-refresh

## Best Practices

### Security
- ✅ Always use token authentication (never API keys in frontend)
- ✅ Set minimal required capabilities in tokens
- ✅ Verify user identity in token endpoint
- ✅ Use channel namespaces for access control (e.g., `private:user-123:*`)

### Performance
- ✅ Unsubscribe from channels when leaving pages
- ✅ Use message name filters to reduce processing
- ✅ Limit collection history fetch sizes
- ✅ Debounce high-frequency updates (cursors)

### User Experience
- ✅ Show connection status to users
- ✅ Handle offline/reconnection gracefully
- ✅ Display loading states during token fetch
- ✅ Provide visual feedback for locks and presence

### Collaboration
- ✅ Use distinct colors for each member
- ✅ Show member names on cursors/avatars
- ✅ Auto-release locks on page leave
- ✅ Update location as users navigate

## Troubleshooting

### Connection fails
- ❌ **Issue:** "Token fetch failed"
- ✅ **Solution:** 
  - Verify token endpoint URL is correct
  - Check CORS configuration
  - Ensure endpoint returns valid token format
  - Check browser console for detailed errors

### Messages not received
- ❌ **Issue:** Workflow not triggering
- ✅ **Solution:**
  - Verify channel subscription succeeded
  - Check trigger conditions match event data
  - Ensure channel name matches exactly
  - Check browser console for Ably errors

### Presence not working
- ❌ **Issue:** Members not showing as online
- ✅ **Solution:**
  - Enable presence when subscribing
  - Verify clientId is set (required for presence)
  - Check presence capability in token
  - Call Get Channel Presence to verify

### Spaces features failing
- ❌ **Issue:** "Not in space" error
- ✅ **Solution:**
  - Ensure "Enter Space" action succeeded
  - Verify clientId is configured
  - Check space capabilities in token
  - Cannot use Spaces with anonymous clients

### Token expired
- ❌ **Issue:** Connection drops after 1 hour
- ✅ **Solution:**
  - Ably automatically refreshes tokens
  - Verify token endpoint is still accessible
  - Check token TTL is reasonable (1-24 hours)
  - Monitor connection status events

## Support & Resources

- **Ably Documentation:** https://ably.com/docs
- **Ably Spaces Guide:** https://ably.com/docs/spaces
- **WeWeb Community:** https://community.weweb.io
- **API Reference:** See plugin actions and triggers in WeWeb

## License

MIT

## Contributing

Contributions welcome! Please submit issues and pull requests on GitHub.


# Channel History Collection

Use this collection to fetch message history from Ably channels as a data source.

## Configuration

### Channel Name (Required)

The name of the channel to fetch history from.

**Can be bound:** Yes (in dynamic mode)

**Example:** `chat-room-1`, `notifications:user-123`

### Limit

Maximum number of messages to retrieve.

**Default:** 50

**Range:** 1-1000

### Direction

Order in which to retrieve messages:

- **Backwards (default):** Newest messages first
- **Forwards:** Oldest messages first

### Start Time (Optional)

Timestamp in milliseconds. Messages from this time onwards will be retrieved.

**Example:** `1697828523000` (Unix timestamp)

**Can be bound:** Yes

### End Time (Optional)

Timestamp in milliseconds. Messages up to this time will be retrieved.

**Example:** `1697832123000` (Unix timestamp)

**Can be bound:** Yes

## Returned Data Structure

Each message in the collection contains:

```javascript
{
  id: "message-id",
  name: "message-name",
  data: { /* message payload */ },
  timestamp: 1697828523000,
  clientId: "sender-client-id"
}
```

## Use Cases

### Recent Messages
Set limit to 10-20, direction to backwards, no time filters.

### Messages in Date Range
Set start and end timestamps to filter messages within a specific period.

### Paginated History
Use start time and limit to implement pagination, updating start time based on the last retrieved message.

## Notes

- History is only available if enabled on your Ably channels
- Message retention depends on your Ably plan
- Large limits may impact performance
- Consider using filters and pagination for better UX


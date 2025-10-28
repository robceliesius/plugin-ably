# Ably Plugin for WeWeb

## Overview

The Ably plugin brings real-time messaging and collaboration features to your WeWeb applications through:

- **Core Ably**: Publish/subscribe messaging, presence, and message history
- **Ably Spaces**: Collaborative features including live cursors, member locations, avatar stacks, and component locking

## Key Features

### Real-time Messaging
- Subscribe to channels and receive messages instantly
- Publish messages to channels
- Track who's online with presence
- Access message history

### Collaboration (Spaces)
- Track member locations in real-time
- Display live cursor positions
- Show active members with avatars
- Lock components to prevent concurrent editing

## Getting Started

1. Configure your token endpoint in plugin settings
2. Optionally set a client ID (defaults to WeWeb user ID)
3. Use actions to subscribe to channels or enter spaces
4. Set up workflow triggers to respond to events

## Security

This plugin uses **token authentication** for maximum security:

- Your Ably API keys never leave your backend
- Token endpoint generates short-lived tokens
- Tokens can have specific capabilities per channel
- Automatic token refresh before expiry

## Need Help?

Check the Settings and Collection tabs for detailed configuration guides.


/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/CollectionEdit.vue';
import './components/CollectionSummary.vue';
/* wwEditor:end */

import Ably from 'ably';
import Spaces from '@ably/spaces';
import axios from 'axios';

export default {
    // Plugin instance properties
    ablyClient: null,
    spacesClient: null,
    channels: {},
    spaces: {},
    state: null,
    _anonymousClientId: null,

    /*=============================================
        Plugin Lifecycle Hooks
    =============================================*/

    /**
     * Called when plugin is first loaded
     */
    async _onLoad(settings) {
        // Initialize reactive state
        if (typeof Vue !== 'undefined') {
            this.state = Vue.reactive({
                isConnected: false,
                connectionState: 'disconnected',
                activeChannels: [],
                activeSpaces: [],
                currentSpace: null,
                members: {},
                cursors: {},
                locks: {},
            });
        }

        await this.init(settings);
    },

    /**
     * Main initialization method
     */
    async init(settings) {
        const tokenEndpoint = settings.publicData?.tokenEndpoint;

        if (!tokenEndpoint) {
            /* wwEditor:start */
            wwLib.wwNotification.open({
                text: 'Ably token endpoint not configured',
                color: 'yellow',
            });
            /* wwEditor:end */
            console.warn('Ably token endpoint not configured');
            return;
        }

        try {
            // Initialize Ably client with token auth
            await this.initializeAbly(settings);

            // Make plugin globally accessible
            if (typeof wwLib !== 'undefined') {
                wwLib.wwPlugins.ably = this;
            }

            /* wwEditor:start */
            wwLib.wwLog.info('Ably plugin initialized successfully');
            /* wwEditor:end */
        } catch (error) {
            /* wwEditor:start */
            wwLib.wwNotification.open({
                text: `Failed to initialize Ably: ${error.message}`,
                color: 'red',
            });
            wwLib.wwLog.error('Ably initialization failed', { error: error.message });
            /* wwEditor:end */
            throw error;
        }
    },

    /**
     * Initialize Ably client with token authentication
     */
    async initializeAbly(settings) {
        // Close existing connection if any
        if (this.ablyClient) {
            await this.disconnect();
        }

        const clientId = this.getClientId();

        /* wwEditor:start */
        wwLib.wwLog.info('Initializing Ably client', { clientId });
        /* wwEditor:end */

        // Initialize Ably with token auth callback
        this.ablyClient = new Ably.Realtime({
            authCallback: async (tokenParams, callback) => {
                try {
                    /* wwEditor:start */
                    wwLib.wwLog.info('Fetching Ably token...');
                    /* wwEditor:end */

                    const tokenData = await this.fetchAblyToken();

                    /* wwEditor:start */
                    wwLib.wwLog.info('Token received', {
                        expires: tokenData.expires ? new Date(tokenData.expires).toISOString() : 'N/A',
                        clientId: tokenData.clientId,
                    });
                    /* wwEditor:end */

                    callback(null, tokenData);
                } catch (error) {
                    /* wwEditor:start */
                    wwLib.wwLog.error('Token fetch failed', { error: error.message });
                    /* wwEditor:end */

                    callback(error, null);
                }
            },
            clientId: clientId,
            echoMessages: settings.publicData?.echoMessages ?? true,
            autoConnect: settings.publicData?.autoConnect ?? true,
        });

        // Initialize Spaces client
        this.spacesClient = new Spaces(this.ablyClient);

        // Set up connection state listeners
        this.setupConnectionListeners();
    },

    /**
     * Fetch token from user's configured endpoint
     */
    async fetchAblyToken() {
        const tokenEndpoint = this.settings.publicData?.tokenEndpoint;
        const clientId = this.getClientId();

        try {
            const response = await axios.post(tokenEndpoint, {
                clientId,
                userId: wwLib.wwAuth?.user?.id,
                userEmail: wwLib.wwAuth?.user?.email,
            });

            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch Ably token: ${error.message}`);
        }
    },

    /**
     * Get client ID for this connection
     */
    getClientId() {
        // Priority order:
        // 1. User-configured (from settings)
        const configured = wwLib.wwFormula?.getValue(this.settings.publicData?.clientId);
        if (configured) return String(configured);

        // 2. WeWeb authenticated user
        const wewebUser = wwLib.wwAuth?.user?.id;
        if (wewebUser) return `weweb-${wewebUser}`;

        // 3. Anonymous (generate and persist in instance)
        if (!this._anonymousClientId) {
            this._anonymousClientId = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        return this._anonymousClientId;
    },

    /**
     * Set up connection state listeners
     */
    setupConnectionListeners() {
        this.ablyClient.connection.on('connected', () => {
            this.state.isConnected = true;
            this.state.connectionState = 'connected';

            /* wwEditor:start */
            wwLib.wwLog.info('Ably connected');
            /* wwEditor:end */

            this.triggerEvent('connection_status', {
                status: 'connected',
                timestamp: Date.now(),
            });
        });

        this.ablyClient.connection.on('disconnected', () => {
            this.state.isConnected = false;
            this.state.connectionState = 'disconnected';

            /* wwEditor:start */
            wwLib.wwLog.info('Ably disconnected');
            /* wwEditor:end */

            this.triggerEvent('connection_status', {
                status: 'disconnected',
                timestamp: Date.now(),
            });
        });

        this.ablyClient.connection.on('failed', stateChange => {
            this.state.connectionState = 'failed';

            const error = stateChange.reason?.message || 'Connection failed';

            /* wwEditor:start */
            wwLib.wwLog.error('Ably connection failed', { error });
            /* wwEditor:end */

            this.triggerEvent('connection_status', {
                status: 'failed',
                error,
                timestamp: Date.now(),
            });
        });

        this.ablyClient.connection.on('suspended', () => {
            this.state.connectionState = 'suspended';

            /* wwEditor:start */
            wwLib.wwLog.warn('Ably connection suspended');
            /* wwEditor:end */
        });
    },

    /*=============================================
        Collection API (Data Source)
    =============================================*/

    /**
     * Fetch channel history for data source collections
     */
    async _fetchCollection(collection) {
        if (collection.mode !== 'dynamic') {
            return { data: null, error: null };
        }

        const { channelName, limit, direction, start, end } = collection.config;

        if (!channelName) {
            return {
                data: null,
                error: { message: 'Channel name is required' },
            };
        }

        try {
            /* wwEditor:start */
            wwLib.wwLog.info('Fetching channel history', { channelName, limit, direction });
            /* wwEditor:end */

            const history = await this.getChannelHistory({
                channelName,
                limit: limit || 50,
                direction: direction || 'backwards',
                start,
                end,
            });

            return { data: history, error: null };
        } catch (error) {
            /* wwEditor:start */
            wwLib.wwLog.error('Collection fetch failed', { error: error.message });
            /* wwEditor:end */

            return {
                data: null,
                error: {
                    message: error.message,
                    details: error.response?.data,
                },
            };
        }
    },

    /*=============================================
        Core Ably Actions
    =============================================*/

    /**
     * Manually connect to Ably
     */
    async connect() {
        if (!this.ablyClient) {
            throw new Error('Ably client not initialized. Please configure the plugin settings.');
        }

        if (this.ablyClient.connection.state === 'connected') {
            /* wwEditor:start */
            wwLib.wwLog.info('Already connected to Ably');
            /* wwEditor:end */
            return { status: 'connected', message: 'Already connected' };
        }

        return new Promise((resolve, reject) => {
            this.ablyClient.connection.once('connected', () => {
                resolve({ status: 'connected', message: 'Connected successfully' });
            });

            this.ablyClient.connection.once('failed', stateChange => {
                reject(new Error(`Connection failed: ${stateChange.reason?.message}`));
            });

            this.ablyClient.connection.connect();
        });
    },

    /**
     * Disconnect from Ably
     */
    disconnect() {
        if (!this.ablyClient) {
            return { status: 'disconnected', message: 'Not connected' };
        }

        // Close all channels
        Object.keys(this.channels).forEach(channelName => {
            this.unsubscribeChannel({ channelName });
        });

        // Leave all spaces
        Object.keys(this.spaces).forEach(spaceName => {
            this.leaveSpace({ spaceName }).catch(console.error);
        });

        // Close connection
        this.ablyClient.close();

        this.state.isConnected = false;
        this.state.connectionState = 'disconnected';

        /* wwEditor:start */
        wwLib.wwLog.info('Disconnected from Ably');
        /* wwEditor:end */

        return { status: 'disconnected', message: 'Disconnected successfully' };
    },

    /**
     * Subscribe to a channel
     */
    async subscribeChannel({ channelName, enablePresence = false }) {
        if (!this.ablyClient) {
            throw new Error('Ably client not initialized');
        }

        if (!channelName) {
            throw new Error('Channel name is required');
        }

        // Check if already subscribed
        if (this.channels[channelName]) {
            /* wwEditor:start */
            wwLib.wwLog.warn(`Already subscribed to channel: ${channelName}`);
            /* wwEditor:end */
            return { channelName, status: 'already_subscribed' };
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Subscribing to channel', { channelName, enablePresence });
        /* wwEditor:end */

        const channel = this.ablyClient.channels.get(channelName);

        // Set up message listener
        channel.subscribe((message) => {
            this.triggerEvent('message', {
                channelName,
                messageName: message.name,
                data: message.data,
                timestamp: message.timestamp,
                clientId: message.clientId,
            });
        });

        // Set up presence listeners if enabled
        if (enablePresence) {
            await channel.presence.subscribe('enter', (member) => {
                this.triggerEvent('presence_enter', {
                    channelName,
                    clientId: member.clientId,
                    data: member.data,
                    timestamp: member.timestamp,
                });
            });

            await channel.presence.subscribe('leave', (member) => {
                this.triggerEvent('presence_leave', {
                    channelName,
                    clientId: member.clientId,
                    data: member.data,
                    timestamp: member.timestamp,
                });
            });

            await channel.presence.subscribe('update', (member) => {
                this.triggerEvent('presence_update', {
                    channelName,
                    clientId: member.clientId,
                    data: member.data,
                    timestamp: member.timestamp,
                });
            });

            // Enter presence
            await channel.presence.enter();
        }

        // Store channel reference
        this.channels[channelName] = channel;
        this.state.activeChannels.push(channelName);

        return { channelName, status: 'subscribed' };
    },

    /**
     * Unsubscribe from a channel
     */
    unsubscribeChannel({ channelName }) {
        if (!channelName) {
            throw new Error('Channel name is required');
        }

        const channel = this.channels[channelName];

        if (!channel) {
            /* wwEditor:start */
            wwLib.wwLog.warn(`Not subscribed to channel: ${channelName}`);
            /* wwEditor:end */
            return { channelName, status: 'not_subscribed' };
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Unsubscribing from channel', { channelName });
        /* wwEditor:end */

        // Unsubscribe from all events
        channel.unsubscribe();
        channel.presence.unsubscribe();

        // Detach channel
        channel.detach();

        // Remove from tracking
        delete this.channels[channelName];
        const index = this.state.activeChannels.indexOf(channelName);
        if (index > -1) {
            this.state.activeChannels.splice(index, 1);
        }

        return { channelName, status: 'unsubscribed' };
    },

    /**
     * Publish a message to a channel
     */
    async publishMessage({ channelName, messageName, data }) {
        if (!this.ablyClient) {
            throw new Error('Ably client not initialized');
        }

        if (!channelName) {
            throw new Error('Channel name is required');
        }

        if (!messageName) {
            throw new Error('Message name is required');
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Publishing message', { channelName, messageName, data });
        /* wwEditor:end */

        const channel = this.ablyClient.channels.get(channelName);
        await channel.publish(messageName, data);

        return {
            channelName,
            messageName,
            status: 'published',
            timestamp: Date.now(),
        };
    },

    /**
     * Get presence members for a channel
     */
    async getChannelPresence({ channelName, waitForSync = true }) {
        if (!this.ablyClient) {
            throw new Error('Ably client not initialized');
        }

        if (!channelName) {
            throw new Error('Channel name is required');
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Getting channel presence', { channelName, waitForSync });
        /* wwEditor:end */

        const channel = this.ablyClient.channels.get(channelName);

        const members = await channel.presence.get(waitForSync);

        return members.map(member => ({
            clientId: member.clientId,
            data: member.data,
            action: member.action,
            timestamp: member.timestamp,
        }));
    },

    /**
     * Get channel history
     */
    async getChannelHistory({ channelName, limit = 50, direction = 'backwards', start, end }) {
        if (!this.ablyClient) {
            throw new Error('Ably client not initialized');
        }

        if (!channelName) {
            throw new Error('Channel name is required');
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Getting channel history', { channelName, limit, direction });
        /* wwEditor:end */

        const channel = this.ablyClient.channels.get(channelName);

        const historyPage = await channel.history({
            limit,
            direction,
            start,
            end,
        });

        return historyPage.items.map(message => ({
            id: message.id,
            name: message.name,
            data: message.data,
            timestamp: message.timestamp,
            clientId: message.clientId,
        }));
    },

    /*=============================================
        Ably Spaces Actions
    =============================================*/

    /**
     * Enter a space
     */
    async enterSpace({ spaceName, memberName, memberAvatar, memberColor }) {
        if (!this.spacesClient) {
            throw new Error('Spaces client not initialized');
        }

        if (!spaceName) {
            throw new Error('Space name is required');
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Entering space', { spaceName, memberName });
        /* wwEditor:end */

        // Get or create space
        const space = await this.spacesClient.get(spaceName);

        // Enter space with profile data
        await space.enter({
            name: memberName || this.getClientId(),
            avatar: memberAvatar || '',
            color: memberColor || this.generateRandomColor(),
        });

        // Set up space event listeners
        this.setupSpaceListeners(spaceName, space);

        // Store space reference
        this.spaces[spaceName] = space;
        this.state.activeSpaces.push(spaceName);
        this.state.currentSpace = spaceName;

        return {
            spaceName,
            status: 'entered',
            clientId: this.getClientId(),
        };
    },

    /**
     * Leave a space
     */
    async leaveSpace({ spaceName }) {
        if (!spaceName) {
            throw new Error('Space name is required');
        }

        const space = this.spaces[spaceName];

        if (!space) {
            /* wwEditor:start */
            wwLib.wwLog.warn(`Not in space: ${spaceName}`);
            /* wwEditor:end */
            return { spaceName, status: 'not_in_space' };
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Leaving space', { spaceName });
        /* wwEditor:end */

        // Leave space
        await space.leave();

        // Remove from tracking
        delete this.spaces[spaceName];
        const index = this.state.activeSpaces.indexOf(spaceName);
        if (index > -1) {
            this.state.activeSpaces.splice(index, 1);
        }

        if (this.state.currentSpace === spaceName) {
            this.state.currentSpace = null;
        }

        return { spaceName, status: 'left' };
    },

    /**
     * Set up event listeners for a space
     */
    setupSpaceListeners(spaceName, space) {
        // Member enter
        space.members.subscribe('enter', member => {
            this.triggerEvent('space_member_enter', {
                spaceName,
                member: {
                    clientId: member.clientId,
                    profileData: member.profileData,
                    location: member.location,
                    lastEvent: member.lastEvent,
                },
            });
        });

        // Member leave
        space.members.subscribe('leave', member => {
            this.triggerEvent('space_member_leave', {
                spaceName,
                member: {
                    clientId: member.clientId,
                    profileData: member.profileData,
                },
            });
        });

        // Member update (location changes)
        space.members.subscribe('update', member => {
            this.triggerEvent('space_location_update', {
                spaceName,
                member: {
                    clientId: member.clientId,
                    location: member.location,
                },
                previousLocation: member.previousLocation,
            });
        });

        // Cursor updates
        space.cursors.subscribe('update', cursorUpdate => {
            this.triggerEvent('space_cursor_move', {
                spaceName,
                member: {
                    clientId: cursorUpdate.clientId,
                },
                position: cursorUpdate.position,
                data: cursorUpdate.data,
            });
        });

        // Lock events
        space.locks.subscribe('update', lockUpdate => {
            const eventType = lockUpdate.member ? 'space_lock_acquired' : 'space_lock_released';

            this.triggerEvent(eventType, {
                spaceName,
                componentId: lockUpdate.id,
                member: lockUpdate.member ? { clientId: lockUpdate.member.clientId } : null,
                metadata: lockUpdate.attributes,
                timestamp: lockUpdate.timestamp,
            });
        });
    },

    /**
     * Update member location in a space
     */
    async updateLocation({ spaceName, location }) {
        if (!spaceName) {
            throw new Error('Space name is required');
        }

        const space = this.spaces[spaceName];

        if (!space) {
            throw new Error(`Not in space: ${spaceName}. Use "Enter Space" action first.`);
        }

        if (!location || typeof location !== 'object') {
            throw new Error('Location object is required');
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Updating location', { spaceName, location });
        /* wwEditor:end */

        await space.locations.set(location);

        return { spaceName, location, status: 'updated' };
    },

    /**
     * Update cursor position in a space
     */
    async updateCursor({ spaceName, position, data = {} }) {
        if (!spaceName) {
            throw new Error('Space name is required');
        }

        const space = this.spaces[spaceName];

        if (!space) {
            throw new Error(`Not in space: ${spaceName}. Use "Enter Space" action first.`);
        }

        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            throw new Error('Position object with x and y coordinates is required');
        }

        await space.cursors.set({ position, data });

        return { spaceName, position, data, status: 'updated' };
    },

    /**
     * Lock a component in a space
     */
    async lockComponent({ spaceName, componentId, metadata = {} }) {
        if (!spaceName) {
            throw new Error('Space name is required');
        }

        if (!componentId) {
            throw new Error('Component ID is required');
        }

        const space = this.spaces[spaceName];

        if (!space) {
            throw new Error(`Not in space: ${spaceName}. Use "Enter Space" action first.`);
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Locking component', { spaceName, componentId });
        /* wwEditor:end */

        const lock = await space.locks.acquire(componentId, metadata);

        return {
            spaceName,
            componentId,
            status: 'locked',
            lockId: lock.id,
            timestamp: Date.now(),
        };
    },

    /**
     * Unlock a component in a space
     */
    async unlockComponent({ spaceName, componentId }) {
        if (!spaceName) {
            throw new Error('Space name is required');
        }

        if (!componentId) {
            throw new Error('Component ID is required');
        }

        const space = this.spaces[spaceName];

        if (!space) {
            throw new Error(`Not in space: ${spaceName}. Use "Enter Space" action first.`);
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Unlocking component', { spaceName, componentId });
        /* wwEditor:end */

        await space.locks.release(componentId);

        return {
            spaceName,
            componentId,
            status: 'unlocked',
            timestamp: Date.now(),
        };
    },

    /**
     * Get all members in a space
     */
    async getSpaceMembers({ spaceName }) {
        if (!spaceName) {
            throw new Error('Space name is required');
        }

        const space = this.spaces[spaceName];

        if (!space) {
            throw new Error(`Not in space: ${spaceName}. Use "Enter Space" action first.`);
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Getting space members', { spaceName });
        /* wwEditor:end */

        const members = await space.members.getAll();

        return members.map(member => ({
            clientId: member.clientId,
            profileData: member.profileData,
            location: member.location,
            isConnected: member.isConnected,
            lastEvent: member.lastEvent,
        }));
    },

    /**
     * Get space state (members, cursors, locks)
     */
    async getSpaceState({ spaceName }) {
        if (!spaceName) {
            throw new Error('Space name is required');
        }

        const space = this.spaces[spaceName];

        if (!space) {
            throw new Error(`Not in space: ${spaceName}. Use "Enter Space" action first.`);
        }

        /* wwEditor:start */
        wwLib.wwLog.info('Getting space state', { spaceName });
        /* wwEditor:end */

        const members = await space.members.getAll();
        const cursors = await space.cursors.getAll();
        const locks = await space.locks.getAll();

        return {
            spaceName,
            members: members.map(m => ({
                clientId: m.clientId,
                profileData: m.profileData,
                location: m.location,
                isConnected: m.isConnected,
            })),
            cursors: cursors.map(c => ({
                clientId: c.clientId,
                position: c.position,
                data: c.data,
            })),
            locks: locks.map(l => ({
                id: l.id,
                member: l.member ? { clientId: l.member.clientId } : null,
                attributes: l.attributes,
                timestamp: l.timestamp,
            })),
        };
    },

    /*=============================================
        Event System
    =============================================*/

    /**
     * Trigger a WeWeb workflow event
     */
    triggerEvent(triggerValue, eventData) {
        if (typeof wwLib === 'undefined') return;

        // Trigger workflows listening to this event
        wwLib.wwWorkflow.executeTrigger(this.id + '-' + triggerValue, {
            event: eventData,
            conditions: eventData,
        });
    },

    /*=============================================
        Utility Methods
    =============================================*/

    /**
     * Generate a random color for member profiles
     */
    generateRandomColor() {
        const colors = [
            '#FF5733',
            '#33FF57',
            '#3357FF',
            '#FF33F5',
            '#F5FF33',
            '#33FFF5',
            '#FF8C33',
            '#8C33FF',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /*=============================================
        Cleanup
    =============================================*/

    /**
     * Clean up resources when plugin is destroyed
     */
    destroy() {
        /* wwEditor:start */
        wwLib.wwLog.info('Destroying Ably plugin');
        /* wwEditor:end */

        // Disconnect and cleanup
        this.disconnect();

        // Clear references
        this.ablyClient = null;
        this.spacesClient = null;
        this.channels = {};
        this.spaces = {};
    },
};


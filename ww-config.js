export default {
    // Plugin features declaration
    features: {
        datasource: true, // Enable channel history as data source
    },

    // Editor integration configuration
    editor: {
        settings: [
            {
                label: 'Configuration',
                edit: () => import('./src/components/SettingsEdit.vue'),
                summary: () => import('./src/components/SettingsSummary.vue'),
                getIsValid(settings) {
                    return !!(
                        settings.publicData.tokenEndpoint &&
                        settings.publicData.tokenEndpoint.trim() !== ''
                    );
                },
                onSave: 'init',
            },
        ],

        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid({ channelName }) {
                return !!(channelName && channelName.trim() !== '');
            },
        },
    },

    // Custom workflow actions
    actions: [
        // Core Ably Actions
        {
            name: 'Connect to Ably',
            code: 'connect',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/Connect.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Disconnect from Ably',
            code: 'disconnect',
            /* wwEditor:start */
            edit: () => import('./src/components/actions/Disconnect.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Subscribe to Channel',
            code: 'subscribeChannel',
            parameters: [
                { name: 'channelName', type: 'string' },
                { name: 'enablePresence', type: 'boolean' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/SubscribeChannel.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Unsubscribe from Channel',
            code: 'unsubscribeChannel',
            parameters: [{ name: 'channelName', type: 'string' }],
            /* wwEditor:start */
            edit: () => import('./src/components/actions/UnsubscribeChannel.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Publish Message',
            code: 'publishMessage',
            parameters: [
                { name: 'channelName', type: 'string' },
                { name: 'messageName', type: 'string' },
                { name: 'data', type: 'object' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/PublishMessage.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Get Channel Presence',
            code: 'getChannelPresence',
            parameters: [
                { name: 'channelName', type: 'string' },
                { name: 'waitForSync', type: 'boolean' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/GetPresence.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Get Channel History',
            code: 'getChannelHistory',
            parameters: [
                { name: 'channelName', type: 'string' },
                { name: 'limit', type: 'number' },
                { name: 'direction', type: 'string' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/GetHistory.vue'),
            /* wwEditor:end */
        },

        // Ably Spaces Actions
        {
            name: 'Spaces | Enter Space',
            code: 'enterSpace',
            parameters: [
                { name: 'spaceName', type: 'string' },
                { name: 'memberName', type: 'string' },
                { name: 'memberAvatar', type: 'string' },
                { name: 'memberColor', type: 'string' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/EnterSpace.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Spaces | Leave Space',
            code: 'leaveSpace',
            parameters: [{ name: 'spaceName', type: 'string' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/LeaveSpace.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Spaces | Update Location',
            code: 'updateLocation',
            parameters: [
                { name: 'spaceName', type: 'string' },
                { name: 'location', type: 'object' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/UpdateLocation.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Spaces | Update Cursor',
            code: 'updateCursor',
            parameters: [
                { name: 'spaceName', type: 'string' },
                { name: 'position', type: 'object' },
                { name: 'data', type: 'object' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/UpdateCursor.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Spaces | Lock Component',
            code: 'lockComponent',
            parameters: [
                { name: 'spaceName', type: 'string' },
                { name: 'componentId', type: 'string' },
                { name: 'metadata', type: 'object' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/LockComponent.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Spaces | Unlock Component',
            code: 'unlockComponent',
            parameters: [
                { name: 'spaceName', type: 'string' },
                { name: 'componentId', type: 'string' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/UnlockComponent.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Spaces | Get Members',
            code: 'getSpaceMembers',
            parameters: [{ name: 'spaceName', type: 'string' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/GetSpaceMembers.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Spaces | Get Space State',
            code: 'getSpaceState',
            parameters: [{ name: 'spaceName', type: 'string' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/actions/GetSpaceState.vue'),
            /* wwEditor:end */
        },
    ],

    // Event triggers
    triggers: [
        // Core Ably Triggers
        {
            label: 'On Connection Status Change',
            value: 'connection_status',
            event: {
                status: 'connected', // 'connected' | 'disconnected' | 'failed'
                error: null,
                timestamp: 0,
            },
            conditions: [
                {
                    name: 'Status',
                    key: 'status',
                    type: 'TextSelect',
                    options: [
                        { label: 'All statuses', value: null },
                        { label: 'Connected', value: 'connected' },
                        { label: 'Disconnected', value: 'disconnected' },
                        { label: 'Failed', value: 'failed' },
                    ],
                },
            ],
        },
        {
            label: 'On Message Received',
            value: 'message',
            event: {
                channelName: '<channel-name>',
                messageName: '<message-name>',
                data: {},
                timestamp: 0,
                clientId: '<client-id>',
            },
            conditions: [
                {
                    name: 'Channel Name',
                    key: 'channelName',
                    type: 'Text',
                    placeholder: 'Default: All channels',
                },
                {
                    name: 'Message Name',
                    key: 'messageName',
                    type: 'Text',
                    placeholder: 'Default: All messages',
                },
            ],
        },
        {
            label: 'On Presence Enter',
            value: 'presence_enter',
            event: {
                channelName: '<channel-name>',
                clientId: '<client-id>',
                data: {},
                timestamp: 0,
            },
            conditions: [
                {
                    name: 'Channel Name',
                    key: 'channelName',
                    type: 'Text',
                    placeholder: 'Default: All channels',
                },
            ],
        },
        {
            label: 'On Presence Leave',
            value: 'presence_leave',
            event: {
                channelName: '<channel-name>',
                clientId: '<client-id>',
                data: {},
                timestamp: 0,
            },
            conditions: [
                {
                    name: 'Channel Name',
                    key: 'channelName',
                    type: 'Text',
                    placeholder: 'Default: All channels',
                },
            ],
        },
        {
            label: 'On Presence Update',
            value: 'presence_update',
            event: {
                channelName: '<channel-name>',
                clientId: '<client-id>',
                data: {},
                timestamp: 0,
            },
            conditions: [
                {
                    name: 'Channel Name',
                    key: 'channelName',
                    type: 'Text',
                    placeholder: 'Default: All channels',
                },
            ],
        },

        // Ably Spaces Triggers
        {
            label: 'Spaces | On Member Enter',
            value: 'space_member_enter',
            event: {
                spaceName: '<space-name>',
                member: {
                    clientId: '<client-id>',
                    profileData: {},
                    location: null,
                    lastEvent: {},
                },
            },
            conditions: [
                {
                    name: 'Space Name',
                    key: 'spaceName',
                    type: 'Text',
                    placeholder: 'Default: All spaces',
                },
            ],
        },
        {
            label: 'Spaces | On Member Leave',
            value: 'space_member_leave',
            event: {
                spaceName: '<space-name>',
                member: {
                    clientId: '<client-id>',
                    profileData: {},
                },
            },
            conditions: [
                {
                    name: 'Space Name',
                    key: 'spaceName',
                    type: 'Text',
                    placeholder: 'Default: All spaces',
                },
            ],
        },
        {
            label: 'Spaces | On Location Update',
            value: 'space_location_update',
            event: {
                spaceName: '<space-name>',
                member: {
                    clientId: '<client-id>',
                    location: {},
                },
                previousLocation: {},
            },
            conditions: [
                {
                    name: 'Space Name',
                    key: 'spaceName',
                    type: 'Text',
                    placeholder: 'Default: All spaces',
                },
            ],
        },
        {
            label: 'Spaces | On Cursor Move',
            value: 'space_cursor_move',
            event: {
                spaceName: '<space-name>',
                member: {
                    clientId: '<client-id>',
                },
                position: { x: 0, y: 0 },
                data: {},
            },
            conditions: [
                {
                    name: 'Space Name',
                    key: 'spaceName',
                    type: 'Text',
                    placeholder: 'Default: All spaces',
                },
            ],
        },
        {
            label: 'Spaces | On Lock Acquired',
            value: 'space_lock_acquired',
            event: {
                spaceName: '<space-name>',
                componentId: '<component-id>',
                member: {
                    clientId: '<client-id>',
                },
                metadata: {},
                timestamp: 0,
            },
            conditions: [
                {
                    name: 'Space Name',
                    key: 'spaceName',
                    type: 'Text',
                    placeholder: 'Default: All spaces',
                },
                {
                    name: 'Component ID',
                    key: 'componentId',
                    type: 'Text',
                    placeholder: 'Default: All components',
                },
            ],
        },
        {
            label: 'Spaces | On Lock Released',
            value: 'space_lock_released',
            event: {
                spaceName: '<space-name>',
                componentId: '<component-id>',
                member: {
                    clientId: '<client-id>',
                },
                timestamp: 0,
            },
            conditions: [
                {
                    name: 'Space Name',
                    key: 'spaceName',
                    type: 'Text',
                    placeholder: 'Default: All spaces',
                },
                {
                    name: 'Component ID',
                    key: 'componentId',
                    type: 'Text',
                    placeholder: 'Default: All components',
                },
            ],
        },
    ],
};


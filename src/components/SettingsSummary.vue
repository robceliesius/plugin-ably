<template>
    <div class="settings-summary">
        <div class="summary-row">
            <div class="summary-label">Token Endpoint:</div>
            <div class="summary-value">{{ tokenEndpoint || 'Not configured' }}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Status:</div>
            <div class="summary-value">
                <span :class="statusClass">{{ connectionStatus }}</span>
            </div>
        </div>
        <div v-if="plugin.state" class="summary-row">
            <div class="summary-label">Active Channels:</div>
            <div class="summary-value">{{ activeChannelCount }}</div>
        </div>
        <div v-if="plugin.state" class="summary-row">
            <div class="summary-label">Active Spaces:</div>
            <div class="summary-value">{{ activeSpaceCount }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SettingsSummary',
    props: {
        settings: { type: Object, required: true },
        plugin: { type: Object, required: true },
    },
    computed: {
        tokenEndpoint() {
            return this.settings.publicData?.tokenEndpoint || '';
        },
        connectionStatus() {
            if (!this.plugin.state) return 'Not initialized';
            const state = this.plugin.state.connectionState;
            return state.charAt(0).toUpperCase() + state.slice(1);
        },
        statusClass() {
            if (!this.plugin.state) return 'status-unknown';
            const state = this.plugin.state.connectionState;
            if (state === 'connected') return 'status-connected';
            if (state === 'failed') return 'status-failed';
            return 'status-disconnected';
        },
        activeChannelCount() {
            return this.plugin.state?.activeChannels?.length || 0;
        },
        activeSpaceCount() {
            return this.plugin.state?.activeSpaces?.length || 0;
        },
    },
};
</script>

<style scoped>
.settings-summary {
    padding: 12px;
    font-size: 14px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.summary-label {
    font-weight: 500;
    color: #666;
}

.summary-value {
    color: #333;
}

.status-connected {
    color: #10b981;
    font-weight: 500;
}

.status-disconnected {
    color: #f59e0b;
}

.status-failed {
    color: #ef4444;
    font-weight: 500;
}

.status-unknown {
    color: #6b7280;
}
</style>


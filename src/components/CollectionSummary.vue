<template>
    <div class="collection-summary">
        <div class="summary-row">
            <div class="summary-label">Channel:</div>
            <div class="summary-value">{{ channelName }}</div>
        </div>
        <div v-if="limit" class="summary-row">
            <div class="summary-label">Limit:</div>
            <div class="summary-value">{{ limit }}</div>
        </div>
        <div v-if="direction" class="summary-row">
            <div class="summary-label">Direction:</div>
            <div class="summary-value">{{ directionLabel }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CollectionSummary',
    props: {
        plugin: { type: Object, required: true },
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    computed: {
        channelName() {
            return this.config.channelName || 'Not set';
        },
        limit() {
            return this.config.limit || null;
        },
        direction() {
            return this.config.direction || null;
        },
        directionLabel() {
            return this.direction === 'forwards' ? 'Forwards' : 'Backwards';
        },
    },
};
</script>

<style scoped>
.collection-summary {
    padding: 12px;
    font-size: 14px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
}

.summary-label {
    font-weight: 500;
    color: #666;
}

.summary-value {
    color: #333;
}
</style>


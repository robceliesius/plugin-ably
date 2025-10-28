<template>
    <div class="collection-edit">
        <wwEditorFormRow label="Channel Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="config.channelName"
                :bindable="collection.mode === 'dynamic'"
                placeholder="my-channel"
                @update:modelValue="updateChannelName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Limit">
            <wwEditorInputRow
                type="query"
                :model-value="config.limit"
                :bindable="collection.mode === 'dynamic'"
                placeholder="50"
                @update:modelValue="updateLimit"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Maximum number of messages to retrieve (default: 50)"
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Direction">
            <wwEditorInputTextSelect
                :model-value="config.direction"
                :options="directionOptions"
                @update:modelValue="updateDirection"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Direction to retrieve messages: backwards (newest first) or forwards (oldest first)"
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Start Time (Optional)">
            <wwEditorInputRow
                type="query"
                :model-value="config.start"
                :bindable="collection.mode === 'dynamic'"
                placeholder="Timestamp (ms)"
                @update:modelValue="updateStart"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Start timestamp in milliseconds. Messages from this time onwards will be retrieved."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="End Time (Optional)">
            <wwEditorInputRow
                type="query"
                :model-value="config.end"
                :bindable="collection.mode === 'dynamic'"
                placeholder="Timestamp (ms)"
                @update:modelValue="updateEnd"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="End timestamp in milliseconds. Messages up to this time will be retrieved."
                />
            </template>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'CollectionEdit',
    props: {
        plugin: { type: Object, required: true },
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    data() {
        return {
            directionOptions: [
                { label: 'Backwards (Newest First)', value: 'backwards' },
                { label: 'Forwards (Oldest First)', value: 'forwards' },
            ],
        };
    },
    methods: {
        updateChannelName(value) {
            this.$emit('update:config', {
                ...this.config,
                channelName: value,
            });
        },
        updateLimit(value) {
            this.$emit('update:config', {
                ...this.config,
                limit: value,
            });
        },
        updateDirection(value) {
            this.$emit('update:config', {
                ...this.config,
                direction: value,
            });
        },
        updateStart(value) {
            this.$emit('update:config', {
                ...this.config,
                start: value,
            });
        },
        updateEnd(value) {
            this.$emit('update:config', {
                ...this.config,
                end: value,
            });
        },
    },
};
</script>

<style scoped>
.collection-edit {
    padding: 16px;
}
</style>


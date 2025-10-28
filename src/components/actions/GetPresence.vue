<template>
    <div class="action-get-presence">
        <wwEditorFormRow label="Channel Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.channelName"
                bindable
                placeholder="my-channel"
                @update:modelValue="updateChannelName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Wait for Sync">
            <wwEditorInputRow
                type="query"
                :model-value="args.waitForSync"
                bindable
                placeholder="true"
                @update:modelValue="updateWaitForSync"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="If true, waits for presence data to be synchronized before returning. Recommended for accuracy."
                />
            </template>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'GetPresence',
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    methods: {
        updateChannelName(value) {
            this.$emit('update:args', {
                ...this.args,
                channelName: value,
            });
        },
        updateWaitForSync(value) {
            this.$emit('update:args', {
                ...this.args,
                waitForSync: value,
            });
        },
    },
};
</script>

<style scoped>
.action-get-presence {
    padding: 16px;
}
</style>


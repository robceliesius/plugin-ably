<template>
    <div class="action-subscribe-channel">
        <wwEditorFormRow label="Channel Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.channelName"
                bindable
                placeholder="my-channel"
                @update:modelValue="updateChannelName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Enable Presence">
            <wwEditorInputRow
                type="query"
                :model-value="args.enablePresence"
                bindable
                placeholder="false"
                @update:modelValue="updateEnablePresence"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="If enabled, this client will join the channel's presence set and receive presence events."
                />
            </template>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'SubscribeChannel',
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
        updateEnablePresence(value) {
            this.$emit('update:args', {
                ...this.args,
                enablePresence: value,
            });
        },
    },
};
</script>

<style scoped>
.action-subscribe-channel {
    padding: 16px;
}
</style>


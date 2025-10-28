<template>
    <div class="action-publish-message">
        <wwEditorFormRow label="Channel Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.channelName"
                bindable
                placeholder="my-channel"
                @update:modelValue="updateChannelName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Message Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.messageName"
                bindable
                placeholder="message"
                @update:modelValue="updateMessageName"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="The event name for this message. Listeners can filter by this name."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Data">
            <wwEditorInputRow
                type="query"
                :model-value="args.data"
                bindable
                placeholder="{ key: 'value' }"
                @update:modelValue="updateData"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="The message payload. Can be any JSON-serializable data."
                />
            </template>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'PublishMessage',
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
        updateMessageName(value) {
            this.$emit('update:args', {
                ...this.args,
                messageName: value,
            });
        },
        updateData(value) {
            this.$emit('update:args', {
                ...this.args,
                data: value,
            });
        },
    },
};
</script>

<style scoped>
.action-publish-message {
    padding: 16px;
}
</style>


<template>
    <div class="action-unsubscribe-channel">
        <wwEditorFormRow label="Channel Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.channelName"
                bindable
                placeholder="my-channel"
                @update:modelValue="updateChannelName"
            />
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'UnsubscribeChannel',
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
    },
};
</script>

<style scoped>
.action-unsubscribe-channel {
    padding: 16px;
}
</style>


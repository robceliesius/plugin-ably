<template>
    <div class="action-get-history">
        <wwEditorFormRow label="Channel Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.channelName"
                bindable
                placeholder="my-channel"
                @update:modelValue="updateChannelName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Limit">
            <wwEditorInputRow
                type="query"
                :model-value="args.limit"
                bindable
                placeholder="50"
                @update:modelValue="updateLimit"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Direction">
            <wwEditorInputTextSelect
                :model-value="args.direction || 'backwards'"
                :options="directionOptions"
                @update:modelValue="updateDirection"
            />
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'GetHistory',
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
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
            this.$emit('update:args', {
                ...this.args,
                channelName: value,
            });
        },
        updateLimit(value) {
            this.$emit('update:args', {
                ...this.args,
                limit: value,
            });
        },
        updateDirection(value) {
            this.$emit('update:args', {
                ...this.args,
                direction: value,
            });
        },
    },
};
</script>

<style scoped>
.action-get-history {
    padding: 16px;
}
</style>


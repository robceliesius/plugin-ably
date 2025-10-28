<template>
    <div class="action-get-space-members">
        <wwEditorFormRow label="Space Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.spaceName"
                bindable
                placeholder="my-space"
                @update:modelValue="updateSpaceName"
            />
        </wwEditorFormRow>

        <div class="members-note">
            Returns an array of all members currently in the space, including their profile data, location, and connection status.
        </div>
    </div>
</template>

<script>
export default {
    name: 'GetSpaceMembers',
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    methods: {
        updateSpaceName(value) {
            this.$emit('update:args', {
                ...this.args,
                spaceName: value,
            });
        },
    },
};
</script>

<style scoped>
.action-get-space-members {
    padding: 16px;
}

.members-note {
    margin-top: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 13px;
    color: #666;
}
</style>


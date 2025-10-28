<template>
    <div class="action-lock-component">
        <wwEditorFormRow label="Space Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.spaceName"
                bindable
                placeholder="my-space"
                @update:modelValue="updateSpaceName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Component ID" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.componentId"
                bindable
                placeholder="element-123"
                @update:modelValue="updateComponentId"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Unique identifier for the component/element to lock. Prevents other users from editing."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Metadata (Optional)">
            <wwEditorInputRow
                type="query"
                :model-value="args.metadata"
                bindable
                placeholder="{ reason: 'editing' }"
                @update:modelValue="updateMetadata"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Optional metadata about why the component is locked."
                />
            </template>
        </wwEditorFormRow>

        <div class="lock-note">
            <strong>Note:</strong> Only the member who acquired the lock can release it. Locks are automatically released when the member leaves the space.
        </div>
    </div>
</template>

<script>
export default {
    name: 'LockComponent',
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
        updateComponentId(value) {
            this.$emit('update:args', {
                ...this.args,
                componentId: value,
            });
        },
        updateMetadata(value) {
            this.$emit('update:args', {
                ...this.args,
                metadata: value,
            });
        },
    },
};
</script>

<style scoped>
.action-lock-component {
    padding: 16px;
}

.lock-note {
    margin-top: 12px;
    padding: 12px;
    background: #fff3cd;
    border-radius: 4px;
    font-size: 13px;
    color: #856404;
}
</style>


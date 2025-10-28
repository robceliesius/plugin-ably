<template>
    <div class="action-update-cursor">
        <wwEditorFormRow label="Space Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.spaceName"
                bindable
                placeholder="my-space"
                @update:modelValue="updateSpaceName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Position" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.position"
                bindable
                placeholder="{ x: 100, y: 200 }"
                @update:modelValue="updatePosition"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Cursor position with x and y coordinates. Usually relative to the document or viewport."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Additional Data (Optional)">
            <wwEditorInputRow
                type="query"
                :model-value="args.data"
                bindable
                placeholder="{ state: 'drawing' }"
                @update:modelValue="updateData"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Optional metadata about the cursor state (e.g., drawing mode, selected tool)."
                />
            </template>
        </wwEditorFormRow>

        <div class="cursor-note">
            <strong>Tip:</strong> Use mouse move events to continuously update cursor position for real-time collaboration.
        </div>
    </div>
</template>

<script>
export default {
    name: 'UpdateCursor',
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
        updatePosition(value) {
            this.$emit('update:args', {
                ...this.args,
                position: value,
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
.action-update-cursor {
    padding: 16px;
}

.cursor-note {
    margin-top: 12px;
    padding: 12px;
    background: #e3f2fd;
    border-radius: 4px;
    font-size: 13px;
    color: #1976d2;
}
</style>


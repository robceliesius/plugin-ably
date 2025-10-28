<template>
    <div class="action-unlock-component">
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
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'UnlockComponent',
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
    },
};
</script>

<style scoped>
.action-unlock-component {
    padding: 16px;
}
</style>


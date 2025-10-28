<template>
    <div class="action-leave-space">
        <wwEditorFormRow label="Space Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.spaceName"
                bindable
                placeholder="my-space"
                @update:modelValue="updateSpaceName"
            />
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'LeaveSpace',
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
.action-leave-space {
    padding: 16px;
}
</style>


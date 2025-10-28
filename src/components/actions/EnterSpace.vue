<template>
    <div class="action-enter-space">
        <wwEditorFormRow label="Space Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.spaceName"
                bindable
                placeholder="my-space"
                @update:modelValue="updateSpaceName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Member Name">
            <wwEditorInputRow
                type="query"
                :model-value="args.memberName"
                bindable
                placeholder="John Doe"
                @update:modelValue="updateMemberName"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Display name for this member in the space."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Avatar URL">
            <wwEditorInputRow
                type="query"
                :model-value="args.memberAvatar"
                bindable
                placeholder="https://..."
                @update:modelValue="updateMemberAvatar"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Member Color">
            <wwEditorInputRow
                type="query"
                :model-value="args.memberColor"
                bindable
                placeholder="#FF5733"
                @update:modelValue="updateMemberColor"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Hex color code for this member's cursor and presence indicator."
                />
            </template>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'EnterSpace',
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
        updateMemberName(value) {
            this.$emit('update:args', {
                ...this.args,
                memberName: value,
            });
        },
        updateMemberAvatar(value) {
            this.$emit('update:args', {
                ...this.args,
                memberAvatar: value,
            });
        },
        updateMemberColor(value) {
            this.$emit('update:args', {
                ...this.args,
                memberColor: value,
            });
        },
    },
};
</script>

<style scoped>
.action-enter-space {
    padding: 16px;
}
</style>


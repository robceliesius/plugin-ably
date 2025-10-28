<template>
    <div class="action-get-space-state">
        <wwEditorFormRow label="Space Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.spaceName"
                bindable
                placeholder="my-space"
                @update:modelValue="updateSpaceName"
            />
        </wwEditorFormRow>

        <div class="state-note">
            <strong>Returns complete space state:</strong>
            <ul>
                <li>All members with their profile data and locations</li>
                <li>All cursor positions</li>
                <li>All active component locks</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GetSpaceState',
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
.action-get-space-state {
    padding: 16px;
}

.state-note {
    margin-top: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 13px;
    color: #333;
}

.state-note ul {
    margin-top: 8px;
    margin-left: 20px;
}

.state-note li {
    margin-bottom: 4px;
}
</style>


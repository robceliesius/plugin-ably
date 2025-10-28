<template>
    <div class="action-update-location">
        <wwEditorFormRow label="Space Name" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.spaceName"
                bindable
                placeholder="my-space"
                @update:modelValue="updateSpaceName"
            />
        </wwEditorFormRow>

        <wwEditorFormRow label="Location" required>
            <wwEditorInputRow
                type="query"
                :model-value="args.location"
                bindable
                placeholder="{ slide: 1, element: 'button-1' }"
                @update:modelValue="updateLocation"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Object describing where this member is located. Can include properties like slide, page, element, etc."
                />
            </template>
        </wwEditorFormRow>

        <div class="location-examples">
            <div class="example-title">Examples:</div>
            <code>{ slide: 1, element: 'button-1' }</code>
            <code>{ page: 'dashboard', section: 'analytics' }</code>
            <code>{ viewport: { x: 100, y: 200 } }</code>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UpdateLocation',
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
        updateLocation(value) {
            this.$emit('update:args', {
                ...this.args,
                location: value,
            });
        },
    },
};
</script>

<style scoped>
.action-update-location {
    padding: 16px;
}

.location-examples {
    margin-top: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
}

.example-title {
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 13px;
}

.location-examples code {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    color: #333;
}
</style>


<template>
    <div class="settings-edit">
        <wwEditorFormRow label="Token Endpoint URL" required>
            <wwEditorInput
                type="text"
                placeholder="https://your-api.com/ably/token"
                :model-value="settings.publicData.tokenEndpoint"
                @update:modelValue="updateTokenEndpoint"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="URL of your backend endpoint that generates Ably tokens. This endpoint will be called to fetch authentication tokens."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Client ID (Optional)">
            <wwEditorInputRow
                type="query"
                :model-value="settings.publicData.clientId"
                bindable
                placeholder="Auto: WeWeb User ID"
                @update:modelValue="updateClientId"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="Unique identifier for this client. Leave empty to use WeWeb user ID automatically. Required for Spaces features."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Echo Messages">
            <wwEditorInputSwitch
                :model-value="settings.publicData.echoMessages"
                @update:modelValue="updateEchoMessages"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="If enabled, messages published by this client will be echoed back to it."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow label="Auto Connect">
            <wwEditorInputSwitch
                :model-value="settings.publicData.autoConnect"
                @update:modelValue="updateAutoConnect"
            />
            <template #append>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    forced-content="If enabled, the plugin will automatically connect to Ably on page load."
                />
            </template>
        </wwEditorFormRow>

        <wwEditorFormRow>
            <button
                type="button"
                class="ww-editor-button -primary"
                :disabled="!isValid || isLoading"
                @click="testConnection"
            >
                {{ isLoading ? 'Testing...' : 'Test Connection' }}
            </button>
        </wwEditorFormRow>

        <wwLoader :loading="isLoading" />
    </div>
</template>

<script>
export default {
    name: 'SettingsEdit',
    props: {
        settings: { type: Object, required: true },
        plugin: { type: Object, required: true },
    },
    data() {
        return {
            isLoading: false,
        };
    },
    computed: {
        isValid() {
            return !!(
                this.settings.publicData.tokenEndpoint &&
                this.settings.publicData.tokenEndpoint.trim() !== ''
            );
        },
    },
    methods: {
        updateTokenEndpoint(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    tokenEndpoint: value,
                },
            });
        },
        updateClientId(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    clientId: value,
                },
            });
        },
        updateEchoMessages(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    echoMessages: value,
                },
            });
        },
        updateAutoConnect(value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    autoConnect: value,
                },
            });
        },
        async testConnection() {
            this.isLoading = true;

            try {
                await this.plugin.init(this.settings);

                wwLib.wwNotification.open({
                    text: 'Connection successful! Ably is ready.',
                    color: 'green',
                });
            } catch (error) {
                wwLib.wwNotification.open({
                    text: `Connection failed: ${error.message}`,
                    color: 'red',
                });
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.settings-edit {
    padding: 16px;
}
</style>


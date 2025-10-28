<template>
    <div class="action-connect">
        <div class="action-description">
            Manually connect to Ably. The plugin auto-connects by default when "Auto Connect" is enabled in settings.
        </div>
    </div>
</template>

<script>
export default {
    name: 'Connect',
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
};
</script>

<style scoped>
.action-connect {
    padding: 16px;
}

.action-description {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
}
</style>


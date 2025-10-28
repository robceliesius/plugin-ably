<template>
    <div class="action-disconnect">
        <div class="action-description">
            Disconnect from Ably. This will unsubscribe from all channels and leave all spaces.
        </div>
    </div>
</template>

<script>
export default {
    name: 'Disconnect',
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
};
</script>

<style scoped>
.action-disconnect {
    padding: 16px;
}

.action-description {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
}
</style>


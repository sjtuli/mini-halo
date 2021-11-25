<template>
  <view class="floating-button">
    <view
      class="button-icon flex self-center justify-center"
      hover-class="floating-button-hover"
      @click="onClick"
    >
      <cl-icon
        name="add-line"
        color="#fff"
        size="50"
        hover-class="default-hover-class"
      />
    </view>
  </view>
</template>
<script>
export default {
  name: "FloatingButton",
  methods: {
    onClick() {
      this.$emit("onClick");
    },
  },
};
</script>
<style lang="scss" scoped>
.floating-button {
  position: fixed;
  bottom: 160rpx;
  right: 30rpx;
  z-index: 99;
  .button-icon {
    width: 100rpx;
    height: 100rpx;
    flex-direction: column;
    align-items: center;
    border-radius: 100%;
    background: #4cd964;
  }
  &-hover {
    background: #17912b;
  }
}
</style>

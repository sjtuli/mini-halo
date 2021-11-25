<template>
  <view class="cl-default">
    <view class="cl-default-image">
      <image :src="image"></image>
    </view>
    <view class="cl-default-description"> {{ description }} </view>
    <view class="cl-default-action">
      <slot></slot>
    </view>
  </view>
</template>
<script>
export default {
  name: "cl-default",
  props: {
    image: {
      type: String,
      default: "/static/images/default/busy.png",
    },
    description: {
      type: String,
      default: "暂无数据",
    },
  },
};
</script>

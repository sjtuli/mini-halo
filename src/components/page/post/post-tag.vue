<template>
  <view
    class="post-tag"
    hover-class="default-hover-class"
    :style="[tagStyles]"
    @click.stop="onClick"
  >
    <text>#{{ tag.name }}</text>
    <text class="tag-post-count" v-if="showPostCount">{{ tag.postCount }}</text>
  </view>
</template>
<script>
export default {
  name: "PostTag",
  props: {
    tag: {
      type: Object,
      default: () => {},
    },
    fontSize: {
      type: Number,
      default: 26,
    },
    color: {
      type: String,
      default: "#576b95",
    },
    margin: {
      type: String,
      default: "0",
    },
    showPostCount: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tagStyles() {
      return {
        fontSize: `${this.fontSize}rpx`,
        color: this.color,
        margin: this.margin,
      };
    },
  },
  methods: {
    onClick() {
      this.$emit("onClick");
    },
  },
};
</script>
<style lang="scss" scoped>
.post-tag {
  display: inline-flex;
  font-weight: 500;

  .tag-post-count {
    color: rgba(0, 0, 0, 0.3) !important;
    margin-left: 8rpx;
  }
}
</style>

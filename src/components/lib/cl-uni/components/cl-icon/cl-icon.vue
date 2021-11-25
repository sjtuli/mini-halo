<template>
  <view class="cl-icon" :hover-class="hoverClass" @click="onClick">
    <image
      class="cl-icon-image"
      v-if="isImageIcon"
      :src="name"
      mode="widthFix"
      :style="[imgStyle]"
    ></image>
    <text v-else class="cl-icon-icon" :class="iconClass" :style="[iconStyle]">
    </text>
    <text v-if="label !== ''" class="cl-icon-label" :style="[labelStyle]"
      >{{ label }}
    </text>
  </view>
</template>
<script>
export default {
  name: "RiIcon",
  props: {
    name: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#606266",
    },
    size: {
      type: Number,
      default: 28,
    },
    hoverClass: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    labelColor: {
      type: String,
      default: "#606266",
    },
    labelSize: {
      type: Number,
      default: 28,
    },
    labelMargin: {
      type: Number,
      default: 6,
    },
  },
  computed: {
    isImageIcon() {
      return this.name.indexOf("/") !== -1;
    },
    iconClass() {
      return ["ri", `ri-${this.name}`];
    },
    iconStyle() {
      let style = {
        fontSize: `${this.size}rpx`,
        fontWeight: "normal",
        color: `${this.color}`,
        marginRight: `${this.label !== "" ? this.labelMargin : ""}rpx`,
      };
      if (this.label && this.label !== "") {
        style.marginRight = `${this.labelMargin}rpx`;
      }
      return style;
    },
    imgStyle() {
      return {
        width: `${this.size}rpx`,
        height: `${this.size}rpx`,
      };
    },
    labelStyle() {
      return {
        color: this.labelColor,
        fontSize: `${this.labelSize}rpx`,
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

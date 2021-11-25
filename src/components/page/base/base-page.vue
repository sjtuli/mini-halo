<template>
  <view>
    <cl-loading-mask
      ref="loader"
      :loading="loader.loading"
      :text="loader.text"
    ></cl-loading-mask>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: "BasePage",

  data() {
    return {
      loader: {
        loading: false,
        text: "",
        timer: null,
      },
    };
  },

  beforeDestroy() {
    clearTimeout(this.loader.timer);
  },

  methods: {
    showLoading(options = {}) {
      Object.assign(this.loader, options, {
        loading: true,
      });
    },

    hideLoading() {
      this.loader.timer = setTimeout(() => {
        this.loader.loading = false;
      }, 500);
    },
  },
};
</script>

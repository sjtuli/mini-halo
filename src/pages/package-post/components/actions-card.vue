<template>
  <view class="actions-wrap">
    <view class="actions">
      <view class="action-item">
        <button
          open-type="share"
          class="item-icon wechat-icon flex self-center justify-center"
          hover-class="default-hover-class"
          @click="handleShowShareMenu()"
        >
          <cl-icon
            name="wechat-fill"
            color="#fff"
            size="50"
            hover-class="default-hover-class"
          />
        </button>
        <view class="item-title">
          <text>微信转发</text>
        </view>
      </view>
      <view class="action-item">
        <view
          class="item-icon flex self-center justify-center"
          hover-class="default-hover-class"
          @click="handlePrepareGenPoster()"
        >
          <cl-icon
            name="image-line"
            color="#999"
            size="50"
            hover-class="default-hover-class"
          />
        </view>
        <view class="item-title">
          <text>创建海报</text>
        </view>
      </view>
      <view class="action-item">
        <view
          class="item-icon flex self-center justify-center"
          hover-class="default-hover-class"
          @click="handleGenQrcode()"
        >
          <cl-icon
            name="qr-code-line"
            color="#999"
            size="50"
            hover-class="default-hover-class"
          />
        </view>
        <view class="item-title">
          <text>二维码</text>
        </view>
      </view>
      <view class="action-item">
        <view
          class="item-icon flex self-center justify-center"
          hover-class="default-hover-class"
          @click="handleCopyLink()"
        >
          <cl-icon
            name="link-m"
            color="#999"
            size="50"
            hover-class="default-hover-class"
          />
        </view>
        <view class="item-title">
          <text>复制链接</text>
        </view>
      </view>
      <view class="action-item">
        <view
          class="item-icon flex self-center justify-center"
          hover-class="default-hover-class"
          @click="hasLiked ? null : handlePostLike()"
        >
          <cl-icon
            :name="`${hasLiked ? 'heart-3-fill' : 'heart-3-line'}`"
            :color="`${hasLiked ? 'red' : '#999'}`"
            size="50"
            hover-class="default-hover-class"
          />
        </view>
        <view class="item-title">
          <text>点赞</text>
        </view>
      </view>
    </view>
    <painter
      style="position: absolute; top: -9999rpx"
      :dancePalette="painter.data"
      :palette="painter.data"
      @imgOK="onPaintRendered"
    />

    <canvas
      canvas-id="qrcode"
      style="position: absolute; top: -9999rpx; width: 300px; height: 300px"
    />
  </view>
</template>
<script>
// libs
import postOne from "@/painter/post/post-one";
import uQRcode from "@/utils/uqrcode.js";
export default {
  name: "PostActionsCard",
  props: {
    post: {
      type: Object,
      default: () => {},
    },
    hasLiked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      painter: {
        data: null,
        image: null,
        qrcodePath: null,
      },
    };
  },
  methods: {
    /**
     * 微信分享
     */
    handleShowShareMenu() {
      uni.showShareMenu({});
    },

    /**
     * 复制链接
     */
    handleCopyLink() {
      uni.setClipboardData({
        data: this.post.fullPath,
      });
    },

    /**
     * 准备生成海报的数据
     */
    async handlePrepareGenPoster() {
      this.visible = false;

      uni.showLoading({
        title: "生成中",
      });

      const _this = this;

      if (this.envSharePainterQrcode === "mini") {
        wx.cloud.init();

        const response = await wx.cloud
          .callFunction({
            name: "functions",
            data: {
              scene: `id=${this.post.id}`,
              path: "pages/package-post/detail",
              type: "getMiniProgramCode",
            },
          })
          .catch(() => {
            uni.showModal({
              title: "提示",
              content: "生成小程序码失败，请配置好云开发之后再尝试",
              showCancel: false,
            });
            uni.hideLoading();
          });

        this.$log.debug("Generated wx qrcode:", response);

        const qrcodePath = `${wx.env.USER_DATA_PATH}/${
          this.post.slug
        }-${new Date().getTime()}.jpg`;

        this.$log.debug("Temperature wx qrcode path:", qrcodePath);

        let fileManager = wx.getFileSystemManager();
        fileManager.writeFile({
          filePath: qrcodePath,
          encoding: "binary",
          data: response.result.buffer,
          success() {
            _this.painter.qrcodePath = qrcodePath;
            _this.handleGenPoster();
          },
        });
        return;
      }

      if (this.envSharePainterQrcode === "normal") {
        uQRcode
          .make({
            canvasId: "qrcode",
            componentInstance: this,
            text: this.post.fullPath,
            size: 300,
            margin: 10,
            backgroundColor: "rgba(255,255,255,0)",
            foregroundColor: "#000000",
            fileType: "png",
            correctLevel: uQRcode.errorCorrectLevel.H,
          })
          .then((response) => {
            _this.painter.qrcodePath = response;
            _this.handleGenPoster();
          });
        return;
      }
    },

    /**
     * 生成海报
     */
    handleGenPoster() {
      const createTime = new Date(this.post.createTime);
      const data = {
        qrcode: this.painter.qrcodePath,
        postTitle: this.post.title,
        thumbnail: this.post.thumbnail,
        summary: this.post.summary,
        title: this.envPageTitle,
        year: createTime.getFullYear(),
        month:
          createTime.getMonth() + 1 < 10
            ? "0" + (createTime.getMonth() + 1)
            : createTime.getMonth() + 1,
        day:
          createTime.getDate() < 10
            ? "0" + createTime.getDate()
            : createTime.getDate(),
      };
      this.painter.data = new postOne(data).palette();
    },

    /**
     * 接收海报生成完毕事件
     */
    onPaintRendered(e) {
      this.painter.image = e.detail.path;
      uni.hideLoading();
      this.painter.data = null;

      uni.showShareImageMenu({
        path: this.painter.image,
      });
    },

    /**
     * 生成二维码分享
     */
    handleGenQrcode() {
      uni.showLoading({
        title: "生成中",
      });
      uQRcode
        .make({
          canvasId: "qrcode",
          componentInstance: this,
          text: this.post.fullPath,
          size: 300,
          margin: 10,
          backgroundColor: "#ffffff",
          foregroundColor: "#000000",
          fileType: "png",
          correctLevel: uQRcode.errorCorrectLevel.H,
        })
        .then((response) => {
          uni.showShareImageMenu({
            path: response,
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    },

    handlePostLike() {
      this.$emit("onPostLike");
    },
  },
};
</script>
<style lang="scss" scoped>
.actions-wrap {
  .actions {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: center;
    justify-items: center;
    justify-content: center;
    align-content: center;

    .action-item {
      text-align: center;

      .item-icon {
        flex-direction: column;
        align-items: center;
        width: 96rpx;
        height: 96rpx;
        border-radius: 100%;
        background: #f2f3f4;
      }

      .wechat-icon {
        background: #57be6a;
        padding: 0;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
      }

      .item-title {
        margin-top: 10rpx;
        text {
          font-size: 24rpx;
          color: #495057;
        }
      }
    }
  }
}
</style>

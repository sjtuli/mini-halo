<template>
  <view class="safe-area-inset-bottom">
    <page-meta>
      <navigation-bar :loading="detail.loading" :title="pageTitle" />
    </page-meta>
    <view class="attachment-preview section">
      <view v-if="isImage" @click="handlePreviewImage()" class="image-wrap">
        <image
          class="image"
          :src="detail.data.path"
          style="width: 100%"
          mode="widthFix"
        />
      </view>
      <view class="file-wrap" v-else>
        <text>当前格式没有预览</text>
      </view>
    </view>
    <view class="attachment-metas section">
      <view class="meta-object">
        <view class="meta-field">
          <text>附件名：</text>
        </view>
        <view class="meta-value">
          <text>{{ detail.data.name }}</text>
        </view>
      </view>
      <view class="meta-object">
        <view class="meta-field">
          <text>附件类型：</text>
        </view>
        <view class="meta-value">
          <text>{{ detail.data.mediaType }}</text>
        </view>
      </view>
      <view class="meta-object">
        <view class="meta-field">
          <text>存储位置：</text>
        </view>
        <view class="meta-value">
          <text>{{ storageType.text }}</text>
        </view>
      </view>
      <view class="meta-object">
        <view class="meta-field">
          <text>附件大小：</text>
        </view>
        <view class="meta-value">
          <text>{{ detail.data.size | fileSizeFormat }}</text>
        </view>
      </view>
      <view v-if="isImage" class="meta-object">
        <view class="meta-field">
          <text>图片尺寸：</text>
        </view>
        <view class="meta-value">
          <text>{{ detail.data.height + "x" + detail.data.width }}</text>
        </view>
      </view>
      <view class="meta-object">
        <view class="meta-field">
          <text>上传日期：</text>
        </view>
        <view class="meta-value">
          <text>{{ detail.data.createTime | datetime }}</text>
        </view>
      </view>
      <view class="meta-object">
        <view class="meta-field">
          <text>普通链接：</text>
        </view>
        <view
          class="meta-value"
          hover-class="default-hover-class"
          @click="handleCopyLink(encodeURI(detail.data.path))"
        >
          <text class="text-line-5"> {{ detail.data.path }}</text>
        </view>
      </view>
      <view v-if="isImage" class="meta-object">
        <view class="meta-field">
          <text>Markdown 格式：</text>
        </view>
        <view
          class="meta-value"
          hover-class="default-hover-class"
          @click="
            handleCopyLink(
              `![${detail.data.name}](${encodeURI(detail.data.path)})`
            )
          "
        >
          <text class="text-line-5">
            ![{{ detail.data.name }}]({{ detail.data.path }})
          </text>
        </view>
      </view>
    </view>
    <view class="section action">
      <cl-button type="error" @click="handleDelete()" fill> 删除 </cl-button>
    </view>
  </view>
</template>
<script>
// apis
import adminAttachmentApi from "@/apis/admin/attachment";
export default {
  name: "AdminAttachmentDetail",
  data() {
    return {
      detail: {
        data: {},
        loading: false,
      },
    };
  },
  onLoad(options) {
    if (options.id) {
      this.detail.data.id = options.id;
      this.handleGetAttachmentDetail();
    }
  },
  onPullDownRefresh() {
    this.handleGetAttachmentDetail();
  },
  computed: {
    pageTitle() {
      if (this.detail.data.name) {
        return `附件详情：${this.detail.data.name}`;
      }
      return "附件详情";
    },
    isImage() {
      var mediaType = this.detail.data.mediaType;
      if (mediaType) {
        var prefix = mediaType.split("/")[0];
        return prefix === "image";
      }
      return false;
    },
    storageType() {
      if (!this.detail.data.type) {
        return "";
      }
      return adminAttachmentApi.storageTypes[this.detail.data.type];
    },
  },
  methods: {
    /**
     * 获取附件详细信息
     */
    handleGetAttachmentDetail() {
      this.detail.loading = true;
      adminAttachmentApi
        .get(this.detail.data.id)
        .then((response) => {
          this.detail.data = response.data.data;
        })
        .finally(() => {
          this.detail.loading = false;
          uni.stopPullDownRefresh();
        });
    },

    /**
     * 打开图片
     */
    handlePreviewImage() {
      uni.previewImage({
        current: 0,
        urls: [this.detail.data.path],
      });
    },

    /**
     * 复制链接
     */
    handleCopyLink(text) {
      uni.setClipboardData({
        data: text,
      });
    },

    /**
     * 删除附件
     */
    handleDelete() {
      const _this = this;
      uni.showModal({
        title: "提示",
        content: "是否确定删除该附件？",
        success(option) {
          if (option.confirm) {
            adminAttachmentApi.delete(_this.detail.data.id).then(() => {
              const eventChannel = _this.getOpenerEventChannel();
              eventChannel.emit("onReloadAttachmentList");
              uni.navigateBack();
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.attachment-preview {
  background: #fff;
  border-radius: 16rpx;
  image {
    border-radius: 16rpx;
    display: block;
  }
  .file-wrap {
    padding: 20rpx;
    text-align: center;
    font-size: 26rpx;
    color: #999;
  }
}
.attachment-metas {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;

  .meta-object {
    padding: 20rpx 0;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
    }
    .meta-field {
      font-weight: bold;
      font-size: 28rpx;
      color: #333;
    }
    .meta-value {
      margin-top: 8rpx;
      font-size: 26rpx;
      color: #999;
    }
  }
}
.action {
  margin-top: 20rpx;
}
</style>

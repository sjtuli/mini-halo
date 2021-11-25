<template>
  <view class="safe-area-inset-bottom">
    <page-meta>
      <navigation-bar :loading="form.loading" :title="pageTitle" />
    </page-meta>
    <view class="photo-preview section">
      <view @click="handlePreviewImage()" class="image-wrap">
        <image
          class="image"
          :src="form.model.url"
          style="width: 100%"
          mode="widthFix"
        />
      </view>
    </view>
    <view class="photo-form section">
      <cl-form
        ref="photoForm"
        :model.sync="form.model"
        :rules="form.rules"
        label-width="256rpx"
        label-position="top"
      >
        <cl-form-item prop="name" label="图片名称：">
          <cl-input v-model="form.model.name"></cl-input>
        </cl-form-item>
        <cl-form-item prop="location" label="拍摄地点：">
          <cl-input v-model="form.model.location"></cl-input>
        </cl-form-item>
        <cl-form-item prop="description" label="描述：">
          <cl-textarea v-model="form.model.description"></cl-textarea>
        </cl-form-item>
      </cl-form>
    </view>
    <view class="section action">
      <cl-button
        type="success"
        @click="handleUpdatePhoto()"
        :loading="form.saving"
        fill
      >
        保存
      </cl-button>
    </view>
  </view>
</template>
<script>
// apis
import adminPhotoApi from "@/apis/admin/photo";
export default {
  name: "AdminPhotoIndex",
  data() {
    return {
      form: {
        model: {
          id: null,
          description: null,
          location: null,
          name: null,
          takeTime: null,
          team: null,
          thumbnail: null,
          url: null,
        },
        rules: {
          name: [
            {
              required: true,
              message: "* 图片名称不能为空",
              trigger: ["change"],
            },
          ],
        },
        loading: false,
        saving: false,
      },
    };
  },
  onLoad(options) {
    if (options.id) {
      this.form.model.id = options.id;
      this.handleGetPhotoDetail();
    }
  },
  onReady() {
    this.$refs.photoForm.setRules(this.form.rules);
  },
  computed: {
    pageTitle() {
      if (this.form.model.name) {
        return `图片详情：${this.form.model.name}`;
      }
      return "图片详情";
    },
  },
  methods: {
    /**
     * 获取图片详情
     */
    handleGetPhotoDetail() {
      this.form.loading = true;
      adminPhotoApi
        .get(this.form.model.id)
        .then((response) => {
          this.form.model = response.data.data;
        })
        .finally(() => {
          this.form.loading = false;
        });
    },

    /**
     * 保存更新
     */
    handleUpdatePhoto() {
      const _this = this;
      _this.$refs.photoForm.validate((valid) => {
        if (valid) {
          _this.form.saving = true;
          adminPhotoApi
            .update(_this.form.model.id, _this.form.model)
            .then(() => {
              uni.showToast({
                title: "保存成功",
              });
              const eventChannel = _this.getOpenerEventChannel();
              eventChannel.emit("onReloadPhotoList");
              uni.navigateBack();
            })
            .finally(() => {
              _this.form.saving = false;
            });
        }
      });
    },

    /**
     * 打开图片
     */
    handlePreviewImage() {
      uni.previewImage({
        current: 0,
        urls: [this.form.model.url],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.photo-preview {
  background: #fff;
  border-radius: 16rpx;
  image {
    border-radius: 16rpx;
    display: block;
  }
}

.photo-form {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
}

.action {
  margin-top: 20rpx;
}
</style>

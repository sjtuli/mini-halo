<template>
  <view>
    <cl-popup
      :visible.sync="visible"
      direction="bottom"
      :close-on-click-modal="true"
      padding="0"
      :borderRadius="40"
      @opened="onPopupOpened()"
    >
      <view>
        <view class="title section">
          <text class="text-line-1"> {{ title }} </text>
        </view>
        <view class="section">
          <cl-form
            :model.sync="form.model"
            :rules="form.rules"
            ref="journalForm"
            label-width="0rpx"
          >
            <cl-form-item prop="sourceContent">
              <cl-textarea
                v-model="form.model.sourceContent"
                :maxlength="2048"
                height="200rpx"
              ></cl-textarea>
            </cl-form-item>
            <view class="form-item-btn-image">
              <text
                class="flex justify-end"
                hover-class="default-hover-class"
                @click="handleAppendImage()"
              >
                添加图片
              </text>
            </view>
            <cl-form-item
              label="私密"
              label-width="300"
              :label-style="{
                color: '#999',
              }"
            >
              <cl-switch
                active-color="#4cd964"
                v-model="form.model.typeChecked"
              ></cl-switch>
            </cl-form-item>
          </cl-form>
        </view>
        <view class="section">
          <cl-button
            :loading="form.loading"
            type="success"
            @click="handleCreateOrUpdateJournal()"
            fill
          >
            {{ isUpdateMode ? "保存" : "发布" }}
          </cl-button>
        </view>
      </view>
    </cl-popup>
  </view>
</template>
<script>
// apis
import adminJournalApi from "@/apis/admin/journal";
import adminAttachmentApi from "@/apis/admin/attachment";

// libs
import { cloneDeep } from "@/components/lib/cl-uni/utils/index";
export default {
  name: "JournalPushDrawer",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    journal: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        model: {
          sourceContent: null,
          type: null,
          typeChecked: false,
        },
        rules: {
          sourceContent: [
            { required: true, message: "内容不能为空", trigger: ["change"] },
          ],
        },
        loading: false,
      },
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    isUpdateMode() {
      return !!this.journal;
    },
    title() {
      return this.isUpdateMode ? "编辑日志" : "发表日志";
    },
    journalType() {
      return this.form.model.typeChecked ? "INTIMATE" : "PUBLIC";
    },
  },
  methods: {
    /**
     * 发布或者编辑日志
     */
    handleCreateOrUpdateJournal() {
      const _this = this;
      _this.$refs.journalForm.validate((valid) => {
        if (valid) {
          _this.form.model.type = _this.journalType;
          _this.form.loading = true;
          if (_this.isUpdateMode) {
            adminJournalApi
              .update(_this.journal.id, _this.form.model)
              .then(() => {
                uni.showToast({
                  title: "编辑成功",
                });
                _this.visible = false;
                _this.$refs.journalForm.resetFields();
                _this.$emit("success");
              })
              .finally(() => {
                _this.form.loading = false;
              });
          } else {
            adminJournalApi
              .create(_this.form.model)
              .then(() => {
                uni.showToast({
                  title: "发布成功",
                });
                _this.visible = false;
                _this.$refs.journalForm.resetFields();
                _this.$emit("success");
              })
              .finally(() => {
                _this.form.loading = false;
              });
          }
        }
      });
    },

    /**
     * 选择图片上传追加到内容
     */
    handleAppendImage() {
      const _this = this;
      uni.chooseImage({
        count: 1,
        success: (chooseImageRes) => {
          if (chooseImageRes.errMsg === "chooseImage:ok") {
            const tempFilePaths = chooseImageRes.tempFilePaths;
            adminAttachmentApi.upload(tempFilePaths[0]).then((response) => {
              const data = response.data;
              const markdown = `![](${data.path})`;

              if (_this.form.model.sourceContent) {
                _this.form.model.sourceContent =
                  _this.form.model.sourceContent + "\n\n" + markdown;
              } else {
                _this.form.model.sourceContent = markdown;
              }
            });
          }
        },
      });
    },

    /**
     * 当弹窗被打开的时候，设置值
     */
    onPopupOpened() {
      this.$refs.journalForm.setRules(this.form.rules);
      if (this.journal) {
        const journal = cloneDeep(this.journal);
        this.form.model.sourceContent = journal.sourceContent;
        this.form.model.type = journal.type;
        this.form.model.typeChecked = journal.type === "INTIMATE";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  text-align: center;
  padding-bottom: 10rpx;
  text {
    font-weight: bold;
    font-size: 30rpx;
    color: #333;
  }
}
.form-item-btn-image {
  text {
    color: $uni-text-color-grey;
    font-size: 26rpx;
  }
}
</style>

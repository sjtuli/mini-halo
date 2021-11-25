<template>
  <view
    class="journal-card"
    :style="{
      borderRadius: `${borderRadius}rpx`,
    }"
  >
    <view class="card-title-wrap" @click="handleNavigateToAdminJournalDetail()">
      <view class="flex">
        <view class="self-center" style="margin-right: 15rpx">
          <cl-avatar :src="userProfile.avatar" :size="56"></cl-avatar>
        </view>
        <view class="flex-grow self-center">
          <text>{{ journal.createTime | datetime }}</text>
        </view>
        <view class="flex justify-end self-center">
          <view
            class="title-btn-edit"
            hover-class="default-hover-class"
            @click.stop="handleShowPushDrawer()"
            >编辑</view
          >
          <view
            class="title-btn-delete"
            hover-class="default-hover-class"
            @click.stop="handleDelete()"
            >删除</view
          >
        </view>
      </view>
    </view>
    <view class="card-content" @click="handleNavigateToAdminJournalDetail()">
      <markdown-parse :content="journal.sourceContent" :domain="envApiUrl" />
    </view>
    <!-- 底部 -->
    <view class="card-footer">
      <view class="footer-items flex">
        <view class="footer-item self-center">
          <cl-icon
            name="heart-3-line"
            color="#999"
            size="36"
            :label="journal.likes"
            label-size="26"
            label-color="#999"
          />
        </view>
        <view class="footer-item self-center">
          <cl-icon
            name="message-3-line"
            color="#999"
            size="36"
            :label="journal.commentCount || 0"
            label-size="26"
            label-color="#999"
            hover-class="default-hover-class"
            @click="handleNavigateToAdminJournalDetail()"
          />
        </view>
        <view class="footer-item self-center">
          <cl-icon
            :name="`${
              journal.type === 'INTIMATE' ? 'eye-off-line' : 'eye-line'
            }`"
            color="#999"
            size="36"
            :label="`${journal.type === 'INTIMATE' ? '私密' : '公开'}`"
            label-size="26"
            label-color="#999"
          />
        </view>
      </view>
    </view>

    <journal-push-drawer
      v-if="journalPushDrawer.visible"
      v-model="journalPushDrawer.visible"
      :journal="journal"
      @success="onReload()"
    />
  </view>
</template>
<script>
// apis
import adminJournalApi from "@/apis/admin/journal";

// components
import markdownParse from "@/wxcomponents/markdown-parse/index";
import JournalPushDrawer from "@/components/page/journal/journal-push-drawer";
import { mapGetters } from "vuex";
export default {
  name: "AdminJournalCard",
  components: {
    markdownParse,
    JournalPushDrawer,
  },
  props: {
    journal: {
      type: Object,
      default: () => {},
    },
    borderRadius: {
      type: Number,
      default: 16,
    },
  },
  data() {
    return {
      journalPushDrawer: {
        visible: false,
      },
    };
  },
  computed: {
    ...mapGetters(["userProfile"]),
  },
  methods: {
    /**
     * 显示编辑弹窗
     */
    handleShowPushDrawer() {
      this.journalPushDrawer.visible = true;
    },

    /**
     * 删除日志
     */
    handleDelete() {
      const _this = this;
      uni.showModal({
        title: "提示",
        content: "是否确认删除该日志？",
        success(option) {
          if (option.confirm) {
            adminJournalApi.delete(_this.journal.id).then(() => {
              uni.showToast({
                title: "删除成功",
              });
              _this.$emit("reload");
            });
          }
        },
      });
    },

    /**
     * 跳转到日志详情（管理端）
     */
    handleNavigateToAdminJournalDetail() {
      const _this = this;
      uni.navigateTo({
        url: "/pages/package-admin/journal/detail",
        success(res) {
          res.eventChannel.emit("onTransferJournal", {
            journal: _this.journal,
          });
        },
      });
    },

    /**
     * 发送事件到父组件刷新数据
     */
    onReload() {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="scss" scoped>
.journal-card {
  display: flex;
  flex: 1;
  background-color: #fff;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  .card-title-wrap {
    padding: $uni-spacing-col-base $uni-spacing-col-lg;
    text {
      font-size: 30rpx;
      color: #000;
      font-weight: bold;
    }

    .title-btn-edit {
      margin-right: 20rpx;
      font-weight: normal;
      font-size: 28rpx;
      color: $uni-text-color-placeholder;
    }

    .title-btn-delete {
      font-weight: normal;
      font-size: 28rpx;
      color: $uni-color-error;
    }
  }

  .card-content {
    border-top: 1rpx solid #f2f5f7;
    padding: $uni-spacing-col-base $uni-spacing-col-lg;
  }

  .card-footer {
    border-top: 1rpx solid #f2f5f7;
    padding: $uni-spacing-col-base $uni-spacing-col-lg;

    .footer-item {
      margin-right: 16rpx;
    }
  }
}
</style>

<template>
  <view
    class="journal-card"
    :style="{
      borderRadius: `${borderRadius}rpx`,
    }"
  >
    <view class="card-title-wrap" @click="onClick">
      <view class="flex">
        <view class="self-center" style="margin-right: 15rpx">
          <cl-avatar :src="userProfile.avatar" :size="56"></cl-avatar>
        </view>
        <view class="flex-grow self-center">
          <text>{{ journal.createTime | datetime }}</text>
        </view>
      </view>
    </view>
    <view class="card-content" @click="onClick">
      <markdown-parse :content="journal.sourceContent" :domain="envApiUrl" />
    </view>
    <!-- 底部 -->
    <view class="card-footer">
      <view class="footer-items flex">
        <view
          class="footer-item self-center"
          hover-class="default-hover-class"
          @click="hasLiked ? null : handleJournalLike()"
        >
          <cl-icon
            :name="`${hasLiked ? 'heart-3-fill' : 'heart-3-line'}`"
            :color="`${hasLiked ? 'red' : '#999'}`"
            size="38"
            :label="journal.likes"
            label-size="26"
            :label-color="`${hasLiked ? 'red' : '#999'}`"
          />
        </view>
        <view
          v-show="!isReviewMode"
          class="footer-item self-center"
          hover-class="default-hover-class"
          @click="onClick"
        >
          <cl-icon
            name="message-3-line"
            color="#999"
            size="38"
            :label="journal.commentCount || 0"
            label-size="26"
            label-color="#999"
          />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// libs
import markdownParse from "@/wxcomponents/markdown-parse/index";
import { mapGetters } from "vuex";
export default {
  name: "JournalCard",
  components: {
    markdownParse,
  },
  props: {
    journal: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    borderRadius: {
      type: Number,
      default: 16,
    },
  },
  computed: {
    ...mapGetters(["hasLikedJournalIds", "userProfile"]),
    hasLiked() {
      if (!this.hasLikedJournalIds || this.hasLikedJournalIds.length <= 0) {
        return false;
      }
      return this.hasLikedJournalIds.includes(Number(this.journal.id));
    },
  },
  methods: {
    onClick() {
      this.$emit("onClick");
    },

    /**
     * 点赞
     */
    handleJournalLike() {
      this.$emit("onJournalLike", this.index);
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

<template>
  <view>
    <page-meta>
      <navigation-bar
        :loading="detail.loading"
        :title="detail.data.createTime | datetime"
      />
    </page-meta>
    <view class="detail-wrap">
      <journal-card
        :journal="detail.data"
        :borderRadius="0"
        @onJournalLike="onJournalLike"
      />
    </view>
    <view class="comment-wrap" v-show="!isReviewMode">
      <base-comment
        ref="basecomment"
        :targetId="detail.data.id"
        target="journals"
        loadmoreBg="#fff"
      />
    </view>
  </view>
</template>
<script>
// apis
import journalApi from "@/apis/journal";

// components
import JournalCard from "@/components/page/journal/journal-card";
import BaseComment from "@/components/page/comment/base-comment";

// libs
import { mapGetters } from "vuex";
import store from "@/store/";
export default {
  name: "JournalDetail",
  components: {
    JournalCard,
    BaseComment,
  },
  data() {
    return {
      detail: {
        data: {},
        commentCount: 0,
        loading: false,
      },
    };
  },
  onLoad(options) {
    if (options.id) {
      this.detail.data.id = options.id;
      this.handleGetJournalDetail();
    }
    if (options.commentCount) {
      this.detail.commentCount = options.commentCount;
    }
  },
  onPullDownRefresh() {
    this.handleGetJournalDetail();
  },
  onReachBottom() {
    this.$refs.basecomment.handleFetchNextPage();
  },
  computed: {
    ...mapGetters(["hasLikedJournalIds"]),
  },
  methods: {
    /**
     * 获取日志详情
     */
    handleGetJournalDetail() {
      this.detail.loading = true;
      journalApi
        .get(this.detail.data.id)
        .then((response) => {
          this.detail.data = response.data.data;
          this.detail.data.commentCount = this.detail.commentCount;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.detail.loading = false;
          this.$refs.basecomment.handleListComments();
        });
    },

    /**
     * 接收日志点赞事件
     */
    onJournalLike() {
      const journal = this.detail.data;
      journalApi.likes(journal.id).then(() => {
        journal.likes++;
        this.$nextTick(() => {
          if (this.hasLikedJournalIds) {
            store.commit("REFRESH_LIKED_JOURNAL_IDS", [
              ...this.hasLikedJournalIds,
              Number(journal.id),
            ]);
          }
        });
      });
    },
  },
  onShareAppMessage() {
    return {
      title: "日志详情",
      path: `/pages/package-journal/detail?id=${this.detail.data.id}&commentCount=${this.detail.commentCount}`,
    };
  },
};
</script>
<style lang="scss">
.detail-wrap {
  margin-top: 20rpx;
}
.comment-wrap {
  background: #fff;
  margin-top: 20rpx;
  padding: $uni-spacing-col-base $uni-spacing-col-lg;
}
</style>

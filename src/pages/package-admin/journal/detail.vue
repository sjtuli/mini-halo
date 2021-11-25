<template>
  <view>
    <view class="detail-wrap">
      <admin-journal-card :journal="journal" :borderRadius="0" />
    </view>
    <view class="comment-wrap" v-show="!isReviewMode">
      <base-comment
        ref="basecomment"
        :targetId="journal.id"
        target="journals"
        loadmoreBg="#fff"
      />
    </view>
  </view>
</template>
<script>
// components
import AdminJournalCard from "./components/admin-journal-card";
import BaseComment from "@/components/page/comment/base-comment";
export default {
  name: "AdminJournalDetail",
  components: {
    AdminJournalCard,
    BaseComment,
  },
  data() {
    return {
      journal: {},
    };
  },
  onLoad() {
    const _this = this;
    const eventChannel = _this.getOpenerEventChannel();
    eventChannel.on("onTransferJournal", (data) => {
      // TODO: deepClone
      _this.journal = data.journal;
      _this.$nextTick(() => {
        _this.$refs.basecomment.handleListComments();
      });
    });
  },
};
</script>
<style lang="scss" scoped>
.detail-wrap {
  margin-top: 20rpx;
}
.comment-wrap {
  background: #fff;
  margin-top: 20rpx;
  padding: $uni-spacing-col-base $uni-spacing-col-lg;
}
</style>

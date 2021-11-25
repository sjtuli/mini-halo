<template>
  <base-page ref="basePage">
    <view class="safe-area-inset-bottom">
      <page-meta>
        <navigation-bar :loading="list.loading" />
      </page-meta>
      <view class="section" v-for="(item, index) in list.data" :key="index">
        <journal-card
          :journal="item"
          :index="index"
          @onClick="handleNavigateToDetail(item)"
          @onJournalLike="onJournalLike"
        />
      </view>
      <view v-if="list.total <= 0 && !list.loading">
        <cl-default image="/static/images/default/social-update.png" />
      </view>
      <view style="margin: 20rpx 0" v-if="list.total > 0">
        <cl-loadmore
          background-color="#f2f5f7"
          :loading="list.loading"
          :finish="!list.hasNext"
          color="#e2dada"
          width="300rpx"
        ></cl-loadmore>
      </view>
      <floating-button
        v-if="hasAdminLogined"
        @onClick="handleShowPushDrawer()"
      />

      <journal-push-drawer
        v-model="journalPushDrawer.visible"
        @success="handleListJournals()"
      />
    </view>
  </base-page>
</template>
<script>
// apis
import journalApi from "@/apis/journal";

// components
import JournalCard from "@/components/page/journal/journal-card";
import FloatingButton from "@/components/page/button/floating-button";
import JournalPushDrawer from "@/components/page/journal/journal-push-drawer";

// libs
import { mapGetters } from "vuex";
import store from "@/store/";
export default {
  name: "Journal",
  components: {
    JournalCard,
    FloatingButton,
    JournalPushDrawer,
  },
  data() {
    return {
      list: {
        data: [],
        params: {
          page: 0,
          size: 10,
        },
        loading: false,
        total: 0,
        hasNext: false,
      },
      journalPushDrawer: {
        visible: false,
      },
    };
  },
  onLoad() {
    this.$refs.basePage.showLoading();
    this.handleListJournals();
  },
  onPullDownRefresh() {
    this.list.params.page = 0;
    this.handleListJournals();
  },
  onReachBottom() {
    if (this.list.hasNext) {
      this.list.params.page++;
      this.handleListJournals(false);
    }
  },
  computed: {
    ...mapGetters(["hasLikedJournalIds"]),
  },
  methods: {
    /**
     * 获取日志列表
     */
    handleListJournals(refresh = true) {
      this.list.loading = true;
      journalApi
        .list(this.list.params)
        .then((response) => {
          if (refresh) {
            this.list.data = response.data.data.content;
          } else {
            this.list.data = this.list.data.concat(response.data.data.content);
          }
          this.list.total = response.data.data.total;
          this.list.hasNext = response.data.data.hasNext;
        })
        .finally(() => {
          this.list.loading = false;
          uni.stopPullDownRefresh();
          this.$refs.basePage.hideLoading();
        });
    },

    /**
     * 跳转到日志详情页面
     */
    handleNavigateToDetail(item) {
      uni.navigateTo({
        url: `/pages/package-journal/detail?id=${item.id}&commentCount=${item.commentCount}`,
      });
    },

    /**
     * 接收日志点赞事件
     */
    onJournalLike(index) {
      const journal = this.list.data[index];
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

    /**
     * 显示发表弹窗
     */
    handleShowPushDrawer() {
      this.journalPushDrawer.visible = true;
    },
  },
  onShareAppMessage() {
    return {
      title: this.envPageTitle,
      path: `/pages/package-main/tabbar/journal`,
    };
  },
};
</script>

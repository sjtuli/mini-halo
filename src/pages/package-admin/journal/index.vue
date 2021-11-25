<template>
  <view class="safe-area-inset-bottom">
    <page-meta>
      <navigation-bar :loading="list.loading" />
    </page-meta>
    <cl-sticky>
      <view class="bg-white">
        <view class="section-padding">
          <cl-search
            v-model="list.params.keyword"
            :show-search-button="false"
            placeholder="输入关键字搜索"
            @search="handleReloadJournals()"
            @clear="handleReloadJournals()"
          ></cl-search>
        </view>
      </view>
    </cl-sticky>
    <view>
      <view class="section" v-for="(item, index) in list.data" :key="index">
        <AdminJournalCard :journal="item" @reload="handleReloadJournals" />
      </view>
    </view>
    <view v-if="list.total <= 0 && !list.loading">
      <cl-default />
    </view>
    <view class="section" v-if="list.total > 0">
      <uni-pagination
        title="标题文字"
        :total="list.total"
        :pageSize="10"
        v-model="list.pagination.page"
        @change="handlePagination"
      ></uni-pagination>
    </view>
    <floating-button @onClick="handleShowPushDrawer()" />
    <journal-push-drawer
      v-model="journalPushDrawer.visible"
      @success="handleListJournals()"
    />
  </view>
</template>
<script>
// apis
import adminJournalApi from "@/apis/admin/journal";

// components
import AdminJournalCard from "./components/admin-journal-card";
import FloatingButton from "@/components/page/button/floating-button";
import JournalPushDrawer from "@/components/page/journal/journal-push-drawer";
export default {
  name: "AdminJournalIndex",
  components: {
    AdminJournalCard,
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
          keyword: null,
        },
        pagination: {
          page: 1,
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
    this.handleListJournals();
  },
  onPullDownRefresh() {
    this.handleReloadJournals();
  },
  methods: {
    /**
     * 刷新日志列表
     */
    handleReloadJournals() {
      this.list.params.page = 0;
      this.handleListJournals();
    },

    /**
     * 获取日志列表
     */
    handleListJournals() {
      this.list.loading = true;

      this.list.params.page = this.list.pagination.page - 1;

      adminJournalApi
        .list(this.list.params)
        .then((response) => {
          this.list.data = response.data.data.content;
          this.list.total = response.data.data.total;
          this.list.hasNext = response.data.data.hasNext;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.list.loading = false;
        });
    },

    /**
     * 分页
     */
    handlePagination(e) {
      this.$log.debug("Handle pagination:", e);
      this.list.pagination.page = e.current;
      this.handleListJournals();
    },

    /**
     * 显示发表弹窗
     */
    handleShowPushDrawer() {
      this.journalPushDrawer.visible = true;
    },
  },
};
</script>

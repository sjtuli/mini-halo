<template>
  <view class="safe-area-inset-bottom">
    <page-meta>
      <navigation-bar :title="pageTitle" :loading="list.loading" />
    </page-meta>
    <cl-sticky>
      <view class="bg-white">
        <view class="section-padding">
          <cl-search
            v-model="list.params.keyword"
            :show-search-button="false"
            placeholder="输入关键字搜索"
            @search="handleListSearchPosts()"
            @clear="handleListSearchPosts()"
          ></cl-search>
        </view>
      </view>
    </cl-sticky>
    <view class="post-list-container">
      <post-list
        :posts="list.data"
        :post-card="3"
        @onPostLikeRise="
          (index) => {
            list.data[index].likes++;
          }
        "
      />
    </view>
    <view v-if="list.data.length <= 0 && !list.loading">
      <cl-default />
    </view>
  </view>
</template>
<script>
// apis
import postApi from "@/apis/post";

// components
import PostList from "@/components/page/post/post-list";
export default {
  name: "SearchPosts",
  components: {
    PostList,
  },
  data() {
    return {
      list: {
        data: [],
        params: {
          keyword: "",
        },
        loading: false,
        total: 0,
        hasNext: false,
      },
    };
  },
  onLoad(options) {
    if (options.keyword) {
      this.list.params.keyword = options.keyword;
      this.handleListSearchPosts();
    }
  },
  onPullDownRefresh() {
    this.handleListSearchPosts();
  },
  computed: {
    pageTitle() {
      if (this.list.params.keyword && this.list.params.keyword !== "") {
        return `文章搜索：${this.list.params.keyword}`;
      }
      return "文章搜索";
    },
  },
  methods: {
    /**
     * 通过 keyword 搜索文章
     */
    handleListSearchPosts() {
      this.list.loading = true;
      postApi
        .search(this.list.params.keyword)
        .then((response) => {
          this.list.data = response.data.data.content;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.list.loading = false;
        });
    },
  },
};
</script>

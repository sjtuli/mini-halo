<template>
  <view>
    <view class="section" v-for="(item, index) in posts" :key="index">
      <post-card-one
        v-if="postCard === 1"
        :post="item"
        :index="index"
        @onClick="navigateToPostDetail(item)"
        @onShowSharePanel="onShowSharePanel"
        @onPostLike="onPostLike"
      />
      <post-card-two
        v-else-if="postCard === 2"
        :post="item"
        :index="index"
        @onClick="navigateToPostDetail(item)"
      />
      <post-card-three
        v-else-if="postCard === 3"
        :post="item"
        :index="index"
        @onClick="navigateToPostDetail(item)"
      />
    </view>
    <share-drawer
      v-model="shareDrawer.visible"
      :post="shareDrawer.selectedPost"
      :showWechatShare="false"
    />
  </view>
</template>

<script>
// apis
import postApi from "@/apis/post";

// components
import PostCardOne from "@/components/page/post/post-card-one";
import PostCardTwo from "@/components/page/post/post-card-two";
import PostCardThree from "@/components/page/post/post-card-three";
import ShareDrawer from "@/components/page/share/share-drawer";

// libs
import store from "@/store/";
import { mapGetters } from "vuex";

// mixins
import navigate from "@/mixins/navigate";
export default {
  name: "PostList",
  components: {
    PostCardOne,
    PostCardTwo,
    PostCardThree,
    ShareDrawer,
  },
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
    postCard: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      shareDrawer: {
        selectedPost: null,
        visible: false,
      },
    };
  },
  mixins: [navigate],
  computed: {
    ...mapGetters(["hasLikedPostIds"]),
  },
  methods: {
    /**
     * 显示分享面板
     */
    onShowSharePanel(index) {
      this.shareDrawer.selectedPost = this.posts[index];
      this.shareDrawer.visible = true;
    },

    onPostLike(index) {
      const post = this.posts[index];
      postApi.likes(post.id).then(() => {
        // 更新文章点赞数据
        this.$emit("onPostLikeRise", index);
        this.$nextTick(() => {
          if (this.hasLikedPostIds) {
            store.commit("REFRESH_LIKED_POST_IDS", [
              ...this.hasLikedPostIds,
              Number(post.id),
            ]);
          }
        });
      });
    },
  },
};
</script>

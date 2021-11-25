<template>
  <view>
    <view class="comment-node">
      <view class="comment-main flex">
        <view
          class="comment-avatar flex-none"
          hover-class="default-hover-class"
          @click="handleShowCommentActions()"
        >
          <cl-avatar
            :src="comment.avatar"
            :size="80"
            :lazy-load="true"
          ></cl-avatar>
        </view>
        <view class="flex-grow">
          <view
            class="comment-metas"
            hover-class="default-hover-class"
            @click="handleShowCommentActions()"
          >
            <view class="comment-author">
              <text>{{ comment.author }}</text>
            </view>
            <view></view>
            <view class="comment-datetime">
              <text>{{ comment.createTime | timeAgo }}</text>
            </view>
          </view>
          <view class="comment-content">
            <markdown-parse :content="content" :domain="envApiUrl" />
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="comment.children && comment.children.length > 0 && renderChilren"
    >
      <CommentNode
        v-for="(item, index) in comment.children"
        :key="index"
        :comment="item"
        :parent="comment"
        :targetId="targetId"
        :target="target"
      />
    </view>
    <comment-push-drawer
      v-if="commentPushDrawer.visible"
      v-model="commentPushDrawer.visible"
      :targetId="targetId"
      :target="target"
      :repliedComment="comment"
    />
  </view>
</template>
<script>
// components
import CommentNode from "./comment-node";
import markdownParse from "@/wxcomponents/markdown-parse/index";
import CommentPushDrawer from "./comment-push-drawer";
export default {
  name: "CommentNode",
  components: {
    CommentNode,
    markdownParse,
    CommentPushDrawer,
  },
  props: {
    targetId: {
      type: Number,
      required: true,
    },
    target: {
      type: String,
      required: false,
      default: "posts",
      validator(value) {
        return ["posts", "sheets", "journals"].indexOf(value) !== -1;
      },
    },
    comment: {
      type: Object,
      required: false,
      default: () => {},
    },
    parent: {
      type: Object,
      required: false,
      default: null,
    },
    renderChilren: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      commentPushDrawer: {
        visible: false,
      },
    };
  },
  computed: {
    content() {
      if (!this.comment.content) {
        return "";
      }
      return `${this.parent ? `**@${this.parent.author}**` : ""} ${
        this.comment.content
      }`;
    },
  },

  methods: {
    /**
     * 点击单条评论显示操作菜单
     */
    handleShowCommentActions() {
      const _this = this;
      uni.showActionSheet({
        itemList: ["复制", "回复"],
        success(res) {
          if (res.tapIndex === 0) {
            uni.setClipboardData({
              data: _this.comment.content,
            });
          } else if (res.tapIndex === 1) {
            _this.commentPushDrawer.visible = true;
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-node {
  margin-top: 10rpx;
  margin-bottom: 10rpx;

  .comment-avatar {
    margin-right: 15rpx;
  }

  .comment-metas {
    .comment-author {
      font-size: 32rpx;
      font-weight: bold;
      color: #666;
    }
    .comment-datetime {
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #657786;
    }
  }
}
</style>

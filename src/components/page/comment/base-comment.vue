<template>
  <view>
    <view class="comment-header">
      <view class="flex justify-between items-stretch">
        <view class="self-center">
          <text class="font-shadow">评论</text>
        </view>
        <view class="self-center" @click="commentPushDrawer.visible = true">
          <cl-icon
            name="quill-pen-line"
            color="#4cd964"
            size="36"
            label="发表"
            label-color="#4cd964"
            hover-class="default-hover-class"
          />
        </view>
      </view>
    </view>
    <view class="comment-nodes" v-if="list.data.length > 0">
      <block v-for="(item, index) in list.data" :key="index">
        <comment-node
          v-if="!item.children || item.children.length <= 0"
          :comment="item"
          :targetId="targetId"
          :target="target"
        />
        <block v-else>
          <comment-node
            :comment="item"
            :targetId="targetId"
            :target="target"
            :renderChilren="false"
          />
          <view class="children-nodes">
            <comment-node
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :comment="child"
              :parent="item"
              :targetId="targetId"
              :target="target"
            />
          </view>
        </block>
      </block>
    </view>
    <view v-if="list.total <= 0 && !list.loading">
      <cl-default
        image="/static/images/default/superhero.png"
        description="暂无评论"
      />
    </view>
    <view style="margin: 20rpx 0" v-if="list.total > 0">
      <cl-loadmore
        :background-color="loadmoreBg"
        :loading="list.loading"
        :finish="!list.hasNext"
        color="#e2dada"
        width="300rpx"
      ></cl-loadmore>
    </view>
    <comment-push-drawer
      v-if="commentPushDrawer.visible"
      v-model="commentPushDrawer.visible"
      :targetId="targetId"
      :target="target"
    />
  </view>
</template>
<script>
// apis
import commentApi from "@/apis/comment";

// components
import CommentNode from "./comment-node";
import CommentPushDrawer from "./comment-push-drawer";
export default {
  name: "BaseComment",
  components: {
    CommentNode,
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
    loadmoreBg: {
      type: String,
      default: "#f2f5f7",
    },
  },
  data() {
    return {
      list: {
        data: [],
        params: {
          page: 0,
          size: 10,
        },
        hasNext: false,
        total: 0,
        loading: false,
      },
      commentPushDrawer: {
        visible: false,
      },
    };
  },
  methods: {
    /**
     * 加载下一页
     */
    handleFetchNextPage() {
      if (this.list.hasNext) {
        this.list.params.page++;
        this.handleListComments(false);
      }
    },

    /**
     * 加载评论
     */
    handleListComments(refresh = true) {
      this.list.loading = true;
      commentApi
        .listComments(this.target, this.targetId, "tree_view", this.list.params)
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
        });
    },
  },
};
</script>

<style lang="scss">
.comment-nodes {
  margin-top: 30rpx;
  .children-nodes {
    margin-left: 80rpx;
  }
}
</style>

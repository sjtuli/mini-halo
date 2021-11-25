<template>
  <cl-popup
    :visible.sync="visible"
    direction="bottom"
    :close-on-click-modal="true"
    padding="0"
    :borderRadius="40"
  >
    <view>
      <view class="title section">
        <text class="text-line-1"> {{ title }} </text>
      </view>
      <view v-if="repliedComment" class="section replied-comment-wrap">
        <comment-node :comment="repliedComment" :renderChilren="false" />
      </view>
      <view class="section">
        <cl-form
          ref="commentForm"
          :model.sync="form.model"
          :rules="rules"
          label-width="0rpx"
        >
          <cl-form-item v-if="!form.useAdminRole" prop="author">
            <cl-input
              placeholder="昵称"
              v-model="form.model.author"
              ref="authorInput"
            />
          </cl-form-item>
          <cl-form-item v-if="!form.useAdminRole" prop="email">
            <cl-input
              placeholder="电子邮箱"
              v-model="form.model.email"
              ref="emailInput"
            />
          </cl-form-item>
          <cl-form-item prop="content">
            <cl-textarea
              v-model="form.model.content"
              ref="contentInput"
              :maxlength="2048"
            ></cl-textarea>
          </cl-form-item>
        </cl-form>
      </view>
      <view
        v-if="hasAdminLogined"
        class="section admin-tips"
        hover-class="default-hover-class"
        @click="form.useAdminRole = !form.useAdminRole"
      >
        <text>
          {{ adminTipsText }}
        </text>
      </view>
      <view class="section">
        <cl-button
          :loading="form.loading"
          type="success"
          @click="
            form.useAdminRole
              ? handlePushCommentUseAdminRole()
              : handlePushComment()
          "
          fill
        >
          发表
        </cl-button>
      </view>
      <view class="section">
        <cl-button type="default" @click="visible = false" fill>
          取消
        </cl-button>
      </view>
    </view>
  </cl-popup>
</template>
<script>
// components
import CommentNode from "./comment-node";

// libs
import commentApi from "@/apis/comment";
import adminCommentApi from "@/apis/admin/comment";
import store from "@/store/";
import { mapGetters } from "vuex";
export default {
  name: "CommentPushDrawer",
  components: {
    CommentNode,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    targetId: {
      type: [String, Number],
      default: null,
    },
    target: {
      type: String,
      default: "posts",
      validator: function (value) {
        return ["posts", "sheets", "journals"].indexOf(value) !== -1;
      },
    },
    repliedComment: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        model: {
          author: null,
          authorUrl: null,
          email: null,
          content: "",
          postId: null,
          parentId: null,
          allowNotification: false,
        },
        loading: false,
        useAdminRole: false,
      },
    };
  },
  mounted() {
    this.$refs.commentForm.setRules(this.rules);

    if (this.commentatorInfo.author) {
      this.form.model.author = this.commentatorInfo.author;
    }
    if (this.commentatorInfo.authorUrl) {
      this.form.model.authorUrl = this.commentatorInfo.authorUrl;
    }
    if (this.commentatorInfo.email) {
      this.form.model.email = this.commentatorInfo.email;
    }
  },
  computed: {
    ...mapGetters(["commentatorInfo"]),
    visible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    title() {
      if (this.repliedComment) {
        return `回复：${this.repliedComment.author}`;
      }
      return "发表评论";
    },
    adminTipsText() {
      return this.form.useAdminRole
        ? "使用游客身份评论"
        : "你已使用博主身份登录，点击使用博主身份评论";
    },
    rules() {
      if (this.form.useAdminRole) {
        return {
          content: [
            {
              required: true,
              message: "评论内容不能为空",
              trigger: ["change"],
            },
          ],
        };
      }
      return {
        author: [
          {
            required: true,
            message: "昵称不能为空",
            trigger: ["change"],
          },
        ],
        email: [
          {
            required: true,
            message: "电子邮箱不能为空",
            trigger: ["change"],
          },
          {
            type: "email",
            message: "电子邮箱格式不正确",
            trigger: ["change"],
          },
        ],
        content: [
          {
            required: true,
            message: "评论内容不能为空",
            trigger: ["change"],
          },
        ],
      };
    },
  },
  methods: {
    /**
     * 创建
     */
    handlePushComment() {
      this.$refs.commentForm.setRules(this.rules);

      // 基本数据
      this.form.model.postId = this.targetId;

      // 被评论信息
      if (this.repliedComment) {
        this.form.model.parentId = this.repliedComment.id;
      }

      const _this = this;
      _this.$refs.commentForm.validate((valid) => {
        if (valid) {
          _this.form.loading = true;
          commentApi
            .createComment(_this.target, _this.form.model)
            .then((response) => {
              // 缓存评论者信息到评论者本地
              store.commit("SET_COMMENTATOR_INFO", {
                author: _this.form.model.author,
                authorUrl: _this.form.model.authorUrl,
                email: _this.form.model.email,
              });

              const createdComment = response.data.data;

              uni.showModal({
                title: "提示",
                content: `${
                  createdComment.status === "PUBLISHED"
                    ? "评论成功，刷新即可显示最新评论"
                    : "您的评论已经投递至博主，等待博主审核"
                }`,
                showCancel: false,
                success(option) {
                  if (option.confirm) {
                    _this.$refs.commentForm.resetFields();
                    _this.visible = false;
                  }
                },
              });
            })
            .finally(() => {
              _this.form.loading = false;
            });
        }
      });
    },

    /**
     * 使用博主身份评论
     */
    handlePushCommentUseAdminRole() {
      this.$refs.commentForm.setRules(this.rules);

      let data = {
        postId: this.targetId,
        content: this.form.model.content,
      };

      if (this.repliedComment) {
        data.parentId = this.repliedComment.id;
      }

      const _this = this;
      _this.$refs.commentForm.validate((valid) => {
        if (valid) {
          _this.form.loading = true;
          adminCommentApi
            .create(_this.target, data)
            .then(() => {
              uni.showModal({
                title: "提示",
                content: `评论成功，刷新即可显示最新评论`,
                showCancel: false,
                success(option) {
                  if (option.confirm) {
                    _this.$refs.commentForm.resetFields();
                    _this.visible = false;
                  }
                },
              });
            })
            .finally(() => {
              _this.form.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  padding-bottom: 10rpx;
  text {
    font-weight: bold;
    font-size: 30rpx;
    color: #333;
  }
}

.replied-comment-wrap {
  border-bottom: 1rpx solid #f2f5f7;
}

.admin-tips {
  text {
    font-size: 26rpx;
    color: #999;
  }
}
</style>

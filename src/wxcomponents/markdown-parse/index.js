const towxml = require("../towxml/index");

Component({
  properties: {
    content: {
      type: String,
      value: "",
    },
    base: {
      type: String,
      value: "",
    },
  },
  lifetimes: {
    attached: function() {
      this.handleRenderContent();
    },
  },
  observers: {
    content: function() {
      this.handleRenderContent();
    },
  },
  methods: {
    tap(e) {
      let element = e.currentTarget.dataset.data;
      if (element.tag == "img") {
        wx.previewImage({
          current: element.attrs.src,
          urls: [element.attrs.src],
        });
      } else if (element.tag == "navigator") {
        wx.showModal({
          title: "提示",
          content: "这是一个外部链接，需要复制到浏览器中打开，是否复制？",
          confirmText: "复制链接",
          success: (res) => {
            if (res.confirm) {
              wx.setClipboardData({
                data: element.attrs.href,
              });
            }
          },
        });
      }
    },
    handleRenderContent: function() {
      const result = towxml(this.data.content, "markdown", {
        base: this.data.base,
        events: {
          tap: (e) => {
            this.tap(e);
          },
        },
      });
      this.setData({
        nodes: result,
      });
    },
  },
});

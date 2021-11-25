export default class LastMayday {
  data = {};
  constructor(data) {
    this.data = data;
  }
  palette() {
    return {
      width: "650px",
      height: "1000px",
      background: "#f8f8f8",
      views: [
        {
          type: "image",
          url: this.data.thumbnail,
          css: {
            width: "650px",
            height: "420px",
            top: "0px",
            left: "0px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            mode: "scaleToFill",
          },
        },
        {
          type: "rect",
          css: {
            background: "rgba(0,0,0,.3)",
            width: "650px",
            height: "420px",
            top: "0px",
            left: "0px",
            rotate: "0",
            borderRadius: "",
            shadow: "",
            color: "rgba(0,0,0,.3)",
          },
        },
        {
          type: "text",
          text: "扫描二维码查看内容",
          css: {
            color: "#999",
            background: "rgba(0,0,0,0)",
            width: "150px",
            height: "20.02px",
            top: "950px",
            left: "250px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            padding: "0px",
            fontSize: "14px",
            fontWeight: "normal",
            maxLines: "2",
            lineHeight: "20.202000000000005px",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "center",
          },
        },
        {
          type: "image",
          url: this.data.qrcode,
          css: {
            width: "150px",
            height: "150px",
            top: "780px",
            left: "250px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            mode: "scaleToFill",
          },
        },
        {
          type: "text",
          text: this.data.title,
          css: {
            color: "#fff",
            background: "rgba(0,0,0,0)",
            width: "479.00000000000006px",
            height: "60.059999999999995px",
            top: "360px",
            left: "10px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            padding: "0px",
            fontSize: "42px",
            fontWeight: "bold",
            maxLines: "1",
            lineHeight: "60.60600000000001px",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "left",
          },
        },
        {
          type: "text",
          text: `${this.data.year} / ${this.data.month}`,
          css: {
            color: "#fff",
            background: "rgba(0,0,0,0)",
            width: "630px",
            height: "42.89999999999999px",
            top: "371px",
            left: "10px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            padding: "0px",
            fontSize: "30px",
            fontWeight: "normal",
            maxLines: "2",
            lineHeight: "43.290000000000006px",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "right",
          },
        },
        {
          type: "text",
          text: this.data.day + "",
          css: {
            color: "#fff",
            background: "rgba(0,0,0,0)",
            width: "630px",
            height: "80.08px",
            top: "307px",
            left: "10px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            padding: "0px",
            fontSize: "56px",
            fontWeight: "bold",
            maxLines: "2",
            lineHeight: "80.80800000000002px",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "right",
          },
        },
        {
          type: "text",
          text: this.data.summary,
          css: {
            color: "#999",
            background: "rgba(0,0,0,0)",
            width: "570px",
            height: "128.414px",
            top: "598px",
            left: "40px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            padding: "0px",
            fontSize: "22px",
            fontWeight: "normal",
            maxLines: "4",
            lineHeight: "31.746000000000006px",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "center",
          },
        },
        {
          type: "text",
          text: this.data.postTitle,
          css: {
            color: "#000000",
            background: "rgba(0,0,0,0)",
            width: "570px",
            height: "54.34px",
            top: "462px",
            left: "40px",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#000000",
            shadow: "",
            padding: "0px",
            fontSize: "38px",
            fontWeight: "bold",
            maxLines: "2",
            lineHeight: "54.83400000000001px",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "center",
          },
        },
      ],
    };
  }
}

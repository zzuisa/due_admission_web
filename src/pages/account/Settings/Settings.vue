<template>
  <d2-container>
    <div class="page-header-index-wide">
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '16px 0', height: '100%' }"
        :style="{ height: '100%' }"
      >
        <el-tabs @tab-click="sendcmd" v-model="active" tab-position="left">
          <el-tab-pane :label="$t('message.student.settings.basic_info')" style="margin:20px">
            <Base />
          </el-tab-pane>
          <el-tab-pane :label="$t('message.student.settings.advance_info')">
            <BaseForm ref="basef" />
          </el-tab-pane>
          <el-tab-pane :label="$t('message.student.settings.new_notification')">
            <a-empty />
          </el-tab-pane>
        </el-tabs>
      </a-card>
    </div>
  </d2-container>
</template>

<script>
import Base from "./BaseSetting";
import util from "@/libs/util.js";
import BaseForm from "./BasicForm";
import i18n from "@/i18n";
export default {
  components: { Base, BaseForm },
  name: "Setting",
  data() {
    return {
      // horizontal  inline
      mode: "inline",
      active: 0,
      device: "pc",
      openKeys: [],
      selectedKeys: [],

      // cropper
      preview: {},
      option: {
        img: "https://preview.pro.loacg.com/avatar2.jpg",
        info: true,
        size: 1,
        outputType: "jpeg",
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },

      pageTitle: ""
    };
  },
  mounted() {
    this.updateMenu();
    let account = JSON.parse(util.cookies.get("user"));
    if (account.username == "admin") {
      this.$router.push({ path: "/admin" });
    }
    if (this.$router.history.current.hash.indexOf("#") != -1) {
      this.active = this.$router.history.current.hash.split("#")[1];
    }
  },
  methods: {
    sendcmd(e) {
      console.log(e);
      if (e.index == 1) {
        this.$refs.basef.init(); // 方法2:直接调用
      }
    },
    onOpenChange(openKeys) {
      this.openKeys = openKeys;
    },
    updateMenu() {
      const routes = this.$route.matched.concat();
      this.selectedKeys = [routes.pop().path];
    }
  },
  watch: {
    $route(val) {
      this.updateMenu();
    }
  }
};
</script>

<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>

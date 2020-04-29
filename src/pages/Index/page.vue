<template>
  <d2-container class="page">
    <div class="container">
      <p>
        <a href="index.html">
          <img :src="studying" width="230" height="110" border="0" />
        </a>
        <img :src="studium" height="110" />
        <img :src="zollvereinruhr" height="110" />
        <img :src="logo" height="110" />
        <img :src="innenhafen" width="218" height="110" />
        <img :src="bach" height="110" />
      </p>
      <el-tabs tab-position="left">
        <el-tab-pane label="Home" style="padding:20px">
          <Home />
            <div class="page__btn-group">
              <span @click="$open('https://github.com/d2-projects')">Open Source Organization</span> |
              <span @click="$open('https://fairyever.com/d2-admin/doc/zh/')">Documentation</span> |
              <span @click="$open('https://github.com/d2-projects/d2-admin-start-kit')">Simplified Version</span> |
              <span @click="$open('https://alibaba.github.io/ice/scaffold?type=vue')">Fei Bing </span> |
              <span @click="$open('https://juejin.im/user/57a48b632e958a006691b946/posts')">Nuggets </span> |
              <el-popover :width="172" trigger="hover">
                <p class="d2-mt-0 d2-mb-10">D2Projects</p>
                <img src="./image/qr@2x.png" style="width: 172px;" />
                <span slot="reference">WeChat Official Account</span>
                <p
                  style="font-size: 12px; margin-top: 0px; margin-bottom: 0px;"
                >官方公众号，主要推送前端技术类文章、框架资源、学习教程，以及 D2 系列项目更新信息</p>
              </el-popover>
            </div>
        </el-tab-pane>
        <el-tab-pane label="Subject">学科</el-tab-pane>
        <el-tab-pane label="Background">背景</el-tab-pane>
        <el-tab-pane label="Requirement">定时任务补偿</el-tab-pane>
        <el-tab-pane label="Application">应用</el-tab-pane>
        <el-tab-pane label="Experience of earlier applicants">较早申请者的经验</el-tab-pane>
        <el-tab-pane label="Links">链接</el-tab-pane>
        <el-tab-pane label="Contact">联系</el-tab-pane>
      </el-tabs>
    </div>
  </d2-container>
</template>

<script>
import D2HelpBtn from "./components/d2-help-btn";
import D2Badge from "./components/d2-badge";
import D2PageCover from "./components/d2-page-cover";
import Home from "./components/Home";
export default {
  components: {
    Home,
    D2HelpBtn,
    D2Badge,
    D2PageCover
  },
  data() {
    return {
      studying: "images/studying.jpg",
      logo: "images/logo_claim_en_72dpi_rgb.jpg",
      bach: "images/bach-end.jpg",
      innenhafen:
        "images/innenhafen_duisburgruhr_tourismusjochen_schlutius300x150_300x150.jpg",
      zollvereinruhr:
        "images/zollvereinruhr_tourismusjochen_schlutius300x300_300x300.jpg",
      studium: "images/studium_foerderung_neu_300x300.jpg",
      filename: __filename
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1600px;
  text-align: center;
  margin: 0 auto;
}
.page {
  .page__logo {
    width: 120px;
  }
  .page__btn-group {
    color: $color-text-placehoder;

    font-size: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    span {
      color: $color-text-sub;
      cursor: pointer;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>

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
        <el-tab-pane :label="$t('message.index.tabs.home')" style="padding:20px">
          <Home />
            <div class="page__btn-group">
              <span @click="$open('https://gitee.com/duisburg/due_admission_web')">{{$t('message.index.footer.open_source_organization')}}</span> |
              <span @click="$open('https://gitee.com/duisburg/due_admission_web')">{{$t('message.index.footer.document')}}</span> |
              <span @click="$open('https://gitee.com/duisburg/due_admission_web')">{{$t('message.index.footer.simplified_version')}}</span> |
              <el-popover :width="172" trigger="hover">
                <p class="d2-mt-0 d2-mb-10">DUE</p>
                <img src="./image/qr@2x.jpg" style="width: 142px;" />
                <span slot="reference">{{$t('message.index.footer.wechat')}}</span>
                <p
                  style="font-size: 12px; margin-top: 0px; margin-bottom: 0px;"
                >Ao</p>
              </el-popover>
            </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('message.index.tabs.subject')"><Empty/></el-tab-pane>
        <el-tab-pane :label="$t('message.index.tabs.background')"><Empty/></el-tab-pane>
        <el-tab-pane :label="$t('message.index.tabs.requirement')"><Empty/></el-tab-pane>
        <el-tab-pane :label="$t('message.index.tabs.application')"><Empty/></el-tab-pane>
        <el-tab-pane :label="$t('message.index.tabs.experience_of_earlier_applicants')"><Empty/></el-tab-pane>
        <el-tab-pane :label="$t('message.index.tabs.links')"><Empty/></el-tab-pane>
        <el-tab-pane :label="$t('message.index.tabs.contact')"><Empty/></el-tab-pane>
      </el-tabs>
    </div>
  </d2-container>
</template>

<script>
import D2HelpBtn from './components/d2-help-btn'
import D2Badge from './components/d2-badge'
import D2PageCover from './components/d2-page-cover'
import Home from './components/Home'
import Empty from '../Empty/page'
export default {
  components: {
    Empty,
    Home,
    D2HelpBtn,
    D2Badge,
    D2PageCover
  },
  data () {
    return {
      studying: 'images/studying.jpg',
      logo: 'images/logo_claim_en_72dpi_rgb.jpg',
      bach: 'images/bach-end.jpg',
      innenhafen:
        'images/innenhafen_duisburgruhr_tourismusjochen_schlutius300x150_300x150.jpg',
      zollvereinruhr:
        'images/zollvereinruhr_tourismusjochen_schlutius300x300_300x300.jpg',
      studium: 'images/studium_foerderung_neu_300x300.jpg',
      filename: __filename
    }
  }
}
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

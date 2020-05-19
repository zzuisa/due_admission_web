<template>
  <d2-container class="page">
    <div id="mainContent">
      <!-- InstanceBeginEditable name="EditRegion1" -->
      <h3>
        <span class="brown">{{$t('message.index.title')}}</span>
        <br />
      </h3>
      <p>
        {{$t('message.index.p1')}}
        <br />
        <br />{{$t('message.index.p2')}}
        <br />{{$t('message.index.p3')}}
        <br />
      </p>
      <p>
        {{$t('message.index.p4')}}
        <a href="#/login">{{$t('message.index.login_in_p')}}</a> <a target="_blank" href="/others/FastTrack2ISE-UDE-Flyer.pdf">{{$t('message.index.program_detail')}}</a> {{$t('message.index.p5')}}

        <br />
      </p>
      <p>{{$t('message.index.p6')}}</p>
      <p>
        <br />
        <br />
      </p>
       <div class="locale-changer">
            {{$t('message.common.change_language')}}
            <a-select @change="saveLanguage" style="margin-left:15px" v-model="$i18n.locale">
              <a-select-option
                v-for="(lang, i) in langs"
                :key="`Lang${i}`"
                :value="lang"
              >{{ lang==='en'?'English':'简体中文' }}</a-select-option>
            </a-select>
          </div>
      <!-- InstanceEndEditable -->
      <!-- end #mainContent -- >
  </div>
      <br class="clearfloat" />
       end #container -->
    </div>
  </d2-container>
</template>

<script>
import util from '@/libs/util.js'

export default {
  name: 'Home',
  data () {
    return {
      langs: ['cn', 'en']
    }
  },
  methods: {
    saveLanguage (e) {
      util.cookies.set('locale', e)
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
  .locale-changer {
    line-height: 35px;
    display: flex;
    justify-content: center;
    margin-bottom: 22px;
  }
</style>

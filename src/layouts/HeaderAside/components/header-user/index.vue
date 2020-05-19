<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.username ? `${ $t('message.common.hello')},  ${info.username}` : $t('message.common.no_login')}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5" />{{$t('message.common.logout')}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import util from '@/libs/util.js'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      info: {}
    }
  },
  mounted () {
    let user = util.cookies.get('user')
    this.info = JSON.parse(user)
    console.log('u', JSON.parse(user))
  },
  methods: {
    ...mapActions('d2admin/account', ['logout']),

    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>

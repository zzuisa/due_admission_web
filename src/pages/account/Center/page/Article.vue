<template>
<div>
  <a-list :grid="{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }" :dataSource="dataSource">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card :hoverable="true">
        <a-card-meta>
          <div style="margin-bottom: 3px" slot="title">{{ item.title }}</div>
          <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" />
        </a-card-meta>
        <template class="ant-card-actions" slot="actions">
          <a _target="blank" :href="item.url">
            <a-icon type="download" />
          </a>
          <router-link to="settings#1">
            <a-icon type="edit" />
          </router-link>
          <a>
            <a-icon type="share-alt" />
          </a>
        </template>
      </a-card>
    </a-list-item>
  </a-list>

  <a-card title="received file">
      <a-list :grid="{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }" :dataSource="rData">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card :hoverable="true">
        <a-card-meta>
          <div style="margin-bottom: 3px" slot="title">{{ item.type }}</div>
          <a-avatar class="card-avatar" slot="avatar" :src="pdf" size="large" />
        </a-card-meta>
        <template class="ant-card-actions" slot="actions">
          <a _target="blank" :href="setting.domain+item.path">
            <a-icon type="download" />
          </a>
        </template>
      </a-card>
    </a-list-item>
  </a-list>
  </a-card>
  </div>
</template>

<script>
import setting from '@/setting'
import pdf from '@/assets/img/pdf.png'
import moment from 'moment'
import util from '@/libs/util.js'
import request from '@/utils/request'
export default {
  name: 'Article',
  components: {},
  data () {
    return {
      loading: true,
      setting: setting,
      pdf: pdf,
      loadingMore: false,
      rData: [],
      dataSource: [],
      data: [],
      dataset: [],
      current: 1,
      total: 0
    }
  },
  created () {
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      let domain = 'http://localhost:888'
      request({
        url: '/api/member/getfiles',
        method: 'get',
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        console.log('@', res)
        this.loading = false
        this.data = res.content.uploaded
        let d = []
        let data = []
        for (let i in res.content.uploaded) {
          if (res.content.uploaded[i] != null) {
            d.push(i)
            data.push(res.content.uploaded[i])
          }
        }
        this.data = d
        this.dataset = data
        console.log(data)
        this.rData = res.content.myfiles.records
        for (let i = 0; i < data.length; i++) {
          this.dataSource.push({
            title: d[i],
            avatar: pdf,
            url: domain + data[i]
          })
        }
      })
      // this.$http.get('/list/article').then(res => {
      //   console.log('res', res)
      //   this.data = res.result
      //   this.loading = false
      // })
    },
    loadMore () {
      this.loadingMore = true
      this.$http
        .get('/list/article')
        .then(res => {
          this.data = this.data.concat(res.result)
        })
        .finally(() => {
          this.loadingMore = false
        })
    }
  }
}
</script>

<style scoped>
</style>

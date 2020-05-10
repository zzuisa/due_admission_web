<template>
  <div class="app-list">
    <a-list size="large" rowKey="id" :loading="loading" itemLayout="vertical" :dataSource="data">
      <a-list-item :key="item.id" slot="renderItem" slot-scope="item">
        <a-list-item-meta>
          <a slot="title" href="#">
            <span>{{ item.event_title }}</span>
            <a-button v-show="item.isread==='0'" style="float:right" type="primary" size="small" @click="read(item.id)">{{$t('message.student.profile.set_as_read')}}</a-button>
          </a>

        </a-list-item-meta>
        <div class="description">
          <slot>{{ item.event_content }}</slot>
        </div>
        <div class="extra">
          <a-avatar
            src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
            size="small"
          />
          admin {{$t('message.student.profile.public')}}
          <em>{{ item.create_time }}</em>
        </div>
      </a-list-item>
      <!-- <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
      <a-button @click="loadMore" :loading="loadingMore">加载更多</a-button>
      </div>-->
    </a-list>
    <a-pagination @change="onPagichange" v-model="current" :total="total" showLessItems />
  </div>
</template>

<script>
import util from '@/libs/util.js'
import request from '@/utils/request'
import { BB } from './ArticleListContent'
import i18n from '@/i18n'
const dataSource = []
for (let i = 0; i < 11; i++) {
  dataSource.push({
    title: 'Alipay',
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    activeUser: 17,
    newUser: 1700
  })
}

export default {
  name: 'Article',
  components: { BB },
  data () {
    return {
      dataSource,
      current: 1,
      total: 1,
      loading: true,
      data: []
    }
  },
  mounted () {
    this.getList(1)
  },
  methods: {
    read (id) {
      request({
        url: `/api/notice/update`,
        method: 'put',
        data: {
          isread: '1',
          id: id
        },
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        console.log('@@@@@$$$$$$$$$', res)
        this.getList(this.current)
        this.$emit('m', res.content)
        this.$message.success(i18n.t('message.common.success'))
      })
    },
    onPagichange (e) {
      this.current = e
      this.getList(e)
    },
    getList (current) {
      request({
        url: `/api/notice/page?current=${current}`,
        method: 'get',
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        console.log('res!~~~~', res)
        this.loading = false
        this.data = res.content.records
        this.total = res.content.total
      })
    },
    onPagichange (e) {
      this.getList(e)
    }
  }
}
</script>

<style lang="less" scoped>
.description {
  max-width: 720px;
  line-height: 22px;
}
.extra {
  margin-top: 16px;
  color: "black";
  line-height: 22px;

  & /deep/ .ant-avatar {
    position: relative;
    top: 1px;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: top;
  }

  & > em {
    margin-left: 16px;
    color: "grey";
    font-style: normal;
  }
}
.app-list {
  .meta-cardInfo {
    zoom: 1;
    margin-top: 16px;

    > div {
      position: relative;
      text-align: left;
      float: left;
      width: 50%;

      p {
        line-height: 32px;
        font-size: 24px;
        margin: 0;

        &:first-child {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
          line-height: 20px;
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>

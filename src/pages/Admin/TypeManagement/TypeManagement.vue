<template>
  <d2-container>
  <a-button @click="addnew" type="dashed" style="width:100%;margin-bottom:10px"><a-icon type="plus" /> {{$t('message.admin.file_type_management.add_new')}}  </a-button>
 <a-table bordered :data-source="data" :columns="columns">
      <template slot="operation" slot-scope="text, record">
        <a-button @click="edit(record)" type='warnning'>{{$t('message.admin.file_type_management.edit')}}</a-button>
        <a-popconfirm
          type='primary'
          v-if="data.length"
          :title="$t('message.admin.file_type_management.sure_to_delete')"
          @confirm="doDelete(record.id)"
        >
          <a-button type="danger" href="javascript:;">{{$t('message.admin.file_type_management.delete')}}</a-button>
        </a-popconfirm>
      </template>
    </a-table>
     <a-drawer
      :title="$t('message.admin.file_type_management.add_update_type')"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item :label="$t('message.admin.file_type_management.name')">
              <a-input
               v-model="form.val.name"
                :placeholder="$t('message.admin.file_type_management.hint_name')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('message.admin.file_type_management.description')">
              <a-input
               v-model="form.val.description"
                :placeholder="$t('message.admin.file_type_management.hint_description')"
              />
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose">{{$t('message.admin.file_type_management.cancel')}}</a-button>
        <a-button type="primary" @click="doSubmit()">{{$t('message.admin.file_type_management.submit')}}</a-button>
      </div>
    </a-drawer>
    </d2-container>
</template>
<script>
import moment from 'moment'
import util from '@/libs/util.js'
import request from '@/utils/request'
import i18n from '@/i18n'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: '5%',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: i18n.t('message.admin.file_type_management.name'),
    dataIndex: 'name',
    width: '30%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: i18n.t('message.admin.file_type_management.description'),
    dataIndex: 'description',
    width: '45%',
    scopedSlots: { customRender: 'description' }
  },
  {
    width: '20%',
    title: i18n.t('message.admin.file_type_management.operation'),
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'TypeManagement',
  data () {
    return {
      visible: false,
      columns,
      data: [],
      method: '',
      form: {
        val: {}
      },
      loading: true,
      current: 1,
      total: 0
    }
  },
  filters: {
    fromNow (date) {
      return moment(date).fromNow()
    }
  },
  mounted () {
    console.log('form.', this.form)
    this.getList(1)
  },
  methods: {
    edit (row) {
      this.method = 'update'
      this.visible = true
      this.form.val = row
    },
    onClose () {
      this.visible = false
      this.form.val = {}
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList (current) {
      request({
        url: `/api/type/list?current=${current}&size=10`,
        method: 'get',
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        console.log('res!!', res)
        this.loading = false
        this.data = res.content.records
        this.total = res.content.total
      })
    },
    addnew () {
      this.visible = true
      this.method = 'add'
    },
    doSubmit () {
      if (this.method === 'add') {
        this.add()
      } else if (this.method === 'update') {
        this.update()
      }
    },
    add () {
      request({
        url: `/api/type/add`,
        method: 'post',
        data: this.form.val,
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        this.loading = true
        this.$message.success(i18n.t('message.common.success'))
        this.onClose()
        this.getList(this.current)
      })
    },
    update () {
      delete this.form.val.create_time
      delete this.form.val.update_time
      console.log(this.form.val)
      request({
        url: `/api/type/update`,
        method: 'put',
        data: this.form.val,
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        this.loading = true
        this.$message.success(i18n.t('message.common.success'))
        this.onClose()
      })
    },
    doDelete (id) {
      console.log('id', id)
      request({
        url: `/api/type/delete?id=${id}`,
        method: 'delete',
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        this.loading = true
        this.$message.success(i18n.t('message.common.success'))
        this.getList(this.current)
      })
    },

    onPagichange (e) {
      this.current = e
      this.getList(e)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-pages-account-projects-cardList {
  margin-top: 24px;

  /deep/ .ant-card-meta-title {
    margin-bottom: 4px;
  }

  /deep/ .ant-card-meta-description {
    height: 44px;
    overflow: hidden;
    line-height: 22px;
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;

    > span {
      flex: 1 1;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }

    /deep/ .ant-pro-avatar-list {
      flex: 0 1 auto;
    }
  }
}
</style>

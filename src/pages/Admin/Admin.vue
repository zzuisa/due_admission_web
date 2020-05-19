<template>
  <d2-container>
    <vxe-grid
      align="center"
      border
      resizable
      export-config
      import-config
      keep-source
      stripe
      highlight-current-row
      :tooltip-config="{enabled: true, contentMethod: showTooltipMethod}"
      show-overflow
      highlight-hover-row
      id="toolbar_demo_1"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :keyboard-config="{isArrow: true}"
      :checkbox-config="{trigger: 'row', highlight: true, range: true}"
      height="100vh"
      :form-config="tableForm"
      @page-change="handlePageChange"
      :pager-config="tablePage"
      :columns="tableColumn"
      :data="tableData"
      :toolbar="tableToolbar"
      :custom-config="{storage: true}"
      ref="xGrid"
      @toolbar-button-click="toolbarButtonClickEvent"
      :context-menu="tableMenu"
      @context-menu-click="contextMenuClickEvent"
      @form-submit="getList(1)"
      @cell-click="cellClickEvent"
    >
      <template v-slot:toolbar_buttons>
        <vxe-button @click="$refs.xGrid.commitProxy('save')">保存</vxe-button>
      </template>
    </vxe-grid>

    <vxe-modal
      v-model="showDetails"
      title="Detail"
      width="600"
      height="400"
      :mask="false"
      :lock-view="false"
      resize
    >
      <vxe-table
        border="inner"
        auto-resize
        show-overflow
        highlight-hover-row
        height="auto"
        :show-header="false"
        :sync-resize="showDetails"
        :data="detailData"
      >
        <vxe-table-column field="label" width="40%"></vxe-table-column>
        <vxe-table-column field="value"></vxe-table-column>
      </vxe-table>
    </vxe-modal>
    <a-drawer
      :title="$t('message.admin.edit.title')"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-form-item :label="$t('message.admin.edit.send_to')">
          <a-input :value="nname" :disabled="true" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="20">
            <a-form-item :label="$t('message.admin.edit.label_title')">
              <a-input
                v-decorator="[
                  'eventTitle',
                  {
                    rules: [{ required: true, message: $t('message.admin.edit.hint_title') }],
                  },
                ]"
                :placeholder="$t('message.admin.edit.hint_title')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Content">
              <a-textarea
                v-decorator="[
                  'eventContent',
                  {
                    rules: [{ required: true, message: $t('message.admin.edit.hint_content') }],
                  },
                ]"
                :rows="4"
                :placeholder="$t('message.admin.edit.hint_content')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-switch
              :checked-children="$t('message.admin.edit.upload_file')"
              :un-checked-children="$t('message.admin.edit.upload_file')"
              v-model="uswitch"
            />
          </a-col>
          <a-col v-show="uswitch">
            <a-divider></a-divider>
            <a-upload
              name="file"
              listType="picture-card"
              :multiple="false"
              :fileList="file"
              :remove="handleRemove"
              @change="handleChange"
              :beforeUpload="beforeUpload"
            >
              <a-icon type="upload" />
              <a-button style="width:100%">Select File</a-button>
            </a-upload>
            <a-input-group size="large">
              <a-row>
                <a-col :span="4">
                  <a-input value="File Type:" :disabled="true" />
                </a-col>
                <a-col :span="12">
                  <a-select
                    v-model="fileForm.type"
                    default-value="lucy"
                    style="width: 220px"
                    @change="selectChange"
                  >
                    <a-select-option v-for="item in types" :value="item.name">{{item.name}}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-input-group>
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
        <a-button :style="{ marginRight: '8px' }" @click="onClose">{{$t('message.admin.edit.cancel')}}</a-button>
        <a-button type="primary" @click="onSubmit">{{$t('message.admin.edit.submit')}}</a-button>
      </div>
    </a-drawer>
  </d2-container>
</template>

<script>
import XEClipboard from 'xe-clipboard'
import request from '@/utils/request'
import util from '@/libs/util.js'
import i18n from '@/i18n'
import setting from '@/setting'
export default {
  data () {
    return {
      domain: setting.domain,
      form: this.$form.createForm(this),
      nid: 1,
      sid: 100000,
      nname: '',
      showDetails: false,
      types: [],
      detailData: [],
      tableData: [],
      uswitch: false,
      fileForm: {},
      rowdata: {},
      file: [],
      tableMenu: {
        className: 'my-menus',
        header: {
          options: [[{ code: 'exportAll', name: 'export all .csv' }]]
        },
        body: {
          options: [
            [
              {
                code: 'notify',
                name: i18n.t('message.admin.right_click_menu.notify'),
                prefixIcon: 'vxe-icon--info',
                className: 'my-copy-item'
              },
              {
                code: 'copy',
                name: i18n.t('message.admin.right_click_menu.copy'),
                prefixIcon: 'fa fa-copy',
                className: 'my-copy-item'
              }
            ],
            [
              {
                code: 'detail',
                name: i18n.t('message.admin.right_click_menu.detail')
              },
              {
                code: 'marked',
                name: i18n.t('message.admin.right_click_menu.mark_as_read')
              },
              {
                code: 'sort',
                name: i18n.t('message.admin.right_click_menu.sort'),
                prefixIcon: 'fa fa-sort color-blue',
                children: [
                  {
                    code: 'clearSort',
                    name: i18n.t('message.admin.clearSort')
                  },
                  {
                    code: 'sortAsc',
                    name: i18n.t('message.admin.right_click_menu.asc'),
                    prefixIcon: 'fa fa-sort-alpha-asc color-orange'
                  },
                  {
                    code: 'sortDesc',
                    name: i18n.t('message.admin.right_click_menu.desc'),
                    prefixIcon: 'fa fa-sort-alpha-desc color-orange'
                  }
                ]
              }
            ]
          ]
        },
        footer: {
          options: [
            [{ code: 'clearAll', name: i18n.t('message.admin.clearAll') }]
          ]
        }
      },
      _row: [],
      tableForm: {
        data: {
          name: '',
          gender: '',
          address: '',
          phone: '',
          nationality: '',
          ger_exam: ''
        },
        items: [
          {
            field: 'name',
            title: i18n.t('message.admin.name'),
            itemRender: {
              name: 'input',
              attrs: { placeholder: i18n.t('message.admin.hint') }
            }
          },
          {
            field: 'apsid',
            title: i18n.t('message.admin.apsid'),
            itemRender: {
              name: 'input',
              attrs: { placeholder: i18n.t('message.admin.hint') }
            }
          },
          {
            field: 'address',
            title: i18n.t('message.admin.address'),
            itemRender: {
              name: 'input',
              attrs: { placeholder: i18n.t('message.admin.hint') }
            }
          },
          {
            field: 'phone',
            showOverflow: 'title',
            title: i18n.t('message.admin.phone'),
            itemRender: {
              name: 'input',
              attrs: { placeholder: i18n.t('message.admin.hint') }
            }
          },

          {
            field: 'gender',
            title: i18n.t('message.admin.gender'),
            itemRender: {
              name: '$select',
              options: [
                { label: i18n.t('message.common.male'), value: 'm' },
                { label: i18n.t('message.common.female'), value: 'f' }
              ]
            }
          },
          {
            field: 'ger_exam',
            title: i18n.t('message.admin.german_level'),
            itemRender: {
              name: '$select',
              options: [
                { label: 'A1', value: 'A1' },
                { label: 'A2', value: 'A2' },
                { label: 'B1', value: 'B1' },
                { label: 'B2', value: 'B2' },
                { label: 'C1', value: 'C1' },
                { label: 'C2', value: 'C2' }
              ]
            }
          },
          {
            field: 'nationality',
            title: i18n.t('message.admin.nationality'),
            itemRender: {
              name: '$select',
              options: [
                { label: 'China', value: 'China' },
                { label: 'Germany', value: 'germany' }
              ]
            }
          },
          {
            itemRender: {
              name: '$button',
              props: {
                content: i18n.t('message.admin.search'),
                type: 'submit',
                status: 'primary'
              }
            }
          },
          {
            itemRender: {
              name: '$button',
              props: { content: i18n.t('message.admin.reset'), type: 'reset' }
            }
          }
        ]
      },
      tablePage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tableProxy: {
        // ajax: {
        //   // page 对象： { pageSize, currentPage }
        //   query: ({ page }) =>
        //     request({
        //       method: "get",
        //       url: `/api/admin/page?current=${page.currentPage}`,
        //       headers: {
        //         token: util.cookies.get("token")
        //       }
        //     }).then(res => {
        //       console.log("r", res);
        //       return res.content.records;
        //     }),
        //   // XEAjax.get(`/api/user/page/list/${page.pageSize}/${page.currentPage}`),
        //   // body 对象： { removeRecords }
        //   // delete: ({ body }) => XEAjax.post("/api/user/save", body),
        //   // // body 对象： { insertRecords, updateRecords, removeRecords, pendingRecords }
        // save: ({ body }) => {
        //   this.save()
        // }
        // }
      },
      tableToolbar: {
        buttons: [
          { code: 'insert_actived', name: i18n.t('message.admin.new') },
          {
            code: 'mark_cancel',
            name: i18n.t('message.admin.target'),
            dropdowns: [
              {
                code: 'delete',
                name: i18n.t('message.admin.target1'),
                type: 'text'
              },
              {
                code: 'remove',
                name: i18n.t('message.admin.target2'),
                type: 'text'
              }
            ]
          },
          {
            name: i18n.t('message.admin.data_export'),
            dropdowns: [
              {
                code: 'open_import',
                name: i18n.t('message.admin.data_export1'),
                type: 'text'
              },
              {
                code: 'open_export',
                name: i18n.t('message.admin.data_export2'),
                type: 'text'
              }
            ]
          }
          // {
          //   code: "exportData111",
          //   name: "自定义按钮",
          //   type: "text",
          //   status: "warning"
          // },
          // {
          //   name: "禁用按钮",
          //   disabled: false,
          //   dropdowns: [
          //     {
          //       code: "other1",
          //       name: "下拉的按钮1",
          //       type: "text",
          //       disabled: false
          //     },
          //     {
          //       code: "other2",
          //       name: "下拉的按钮2",
          //       type: "text",
          //       disabled: true
          //     },
          //     {
          //       code: "other3",
          //       name: "下拉的按钮3",
          //       type: "text",
          //       disabled: false
          //     }
          //   ]
          // }
        ],
        refresh: true,
        import: true,
        export: true,
        zoom: true,
        custom: true
      },
      visible: false,

      tableColumn: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60 },
        { field: 'name', title: 'Name', editRender: { name: 'input' } },
        { field: 'gender', title: 'Gender', editRender: { name: 'input' } },
        {
          field: 'nationality',
          title: 'Country',
          editRender: { name: 'input' }
        },
        {
          field: 'phone',
          title: 'Phone',
          width: 80,
          editRender: { name: 'input' }
        },
        {
          field: 'address',
          title: 'Address',
          width: 100,
          editRender: { name: 'input' }
        },
        {
          field: 'aps_passed',
          title: 'aps status',
          width: 80,
          editRender: { name: 'input' },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != 'China') {
                return '░░░░'
              } else if (row.aps_passed == null || row.aps_passed == '') {
                return [
                  <el-tag type="warning">
                    {i18n.t('message.admin.no_update')}
                  </el-tag>
                ]
              } else if (row.aps_passed == 'passed') {
                return [<el-tag type="success">{row.aps_passed}</el-tag>]
              } else if (row.aps_passed == 'failed') {
                return [<el-tag type="danger">{row.aps_passed}</el-tag>]
              }
              return [<el-tag type="warning">{row.aps_passed}</el-tag>]
            }
          }
        },
        {
          field: 'apsid',
          title: 'aps team id',
          editRender: { name: 'input' },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != 'China') {
                return '░░░░'
              }
              return row.apsid
            }
          }
        },
        {
          field: 'cet4',
          title: 'CET-4',
          editRender: { name: 'input' },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != 'China') {
                return '░░░░'
              }
              return row.cet4
            }
          }
        },
        {
          field: 'cet6',
          title: 'CET-6',
          editRender: { name: 'input' },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != 'China') {
                return '░░░░'
              }
              return row.cet6
            }
          }
        },
        {
          field: 'ger_exam',
          title: 'access exam',
          editRender: { name: 'input' },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != 'China') {
                return '░░░░'
              }
              return row.ger_exam
            }
          }
        },
        {
          field: 'aps_auth_file',
          title: 'aps-auth-file',
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != 'China') {
                return '░░░░'
              } else if (row.aps_auth_file == null || row.aps_auth_file == '') {
                return [
                  <el-tag type="warning">
                    {i18n.t('message.admin.no_update')}
                  </el-tag>
                ]
              }
              return [
                <a href={this.domain + row.aps_auth_file}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  {i18n.t('message.admin.download')}
                </a>
              ]
            }
          }
        },
        {
          field: 'exam_auth_file',
          title: 'exam-auth-file',
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.exam_auth_file == null || row.exam_auth_file == '') {
                return [
                  <el-tag type="warning">
                    {i18n.t('message.admin.no_update')}
                  </el-tag>
                ]
              }
              return [
                <a target="_blank" href={this.domain + row.exam_auth_file}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  {i18n.t('message.admin.download')}
                </a>
              ]
            }
          }
        },
        {
          field: 'passport',
          title: 'passport-file',
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.passport == null || row.passport == '') {
                return [
                  <el-tag type="warning">
                    {i18n.t('message.admin.no_update')}
                  </el-tag>
                ]
              }

              return [
                <a href={this.domain + row.passport}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  {i18n.t('message.admin.download')}
                </a>
              ]
            }
          }
        }
      ]
    }
  },
  mounted () {
    console.log(this.domain)
    this.getList()
    this.getTypes()
    // XEAjax.mockList(50).then(data => {
    //   this.tableData = data;
    //   this.loading = false;
    // });
  },

  methods: {
    save () {
      console.log('s')
    },
    showTooltipMethod ({ type, column, row, items, _columnIndex }) {
      return null
    },
    rowStyle ({ row, rowIndex }) {
      if (this._row.includes(row.u_id)) {
        return {
          backgroundColor: '#E6A23B',
          color: '#ffffff'
        }
      }
    },
    cellStyle ({ row, rowIndex, column, columnIndex }) {
      if (column.property === 'sex') {
        if (row.sex >= '1') {
          return {
            backgroundColor: '#187'
          }
        } else if (row.age === 26) {
          return {
            backgroundColor: '#2db7f5'
          }
        }
      }
    },
    selectChange (e) {
      console.log(this.fileForm)
    },
    handleChange (info) {
      console.log('!!!!!!!!!!!!', info)
      if (info.fileList.length > 0) {
        this.handleUpload()
      }
    },
    handleRemove (file) {
      const index = this.file.indexOf(file)
      const newFileList = this.file.slice()
      newFileList.splice(index, 1)
      this.file = newFileList
    },
    beforeUpload (file) {
      this.file = [...this.file, file]
      if (this.file.length > 0) {
        this.file = []
      }
      this.file.push(file)
      console.log('!', this.file)
      return false
    },
    handleUpload () {
      const { file } = this
      const formData = new FormData()
      file.forEach(f => {
        formData.append('file', f)
      })
      this.uploading = true

      // You can use any AJAX library you like
      console.log(this.file)
      request({
        url: '/api/file/common',
        method: 'post',
        data: formData,
        headers: {
          token: util.cookies.get('token')
        }
      })
        .then(res => {
          this.fileList = []
          this.uploading = false
          this.$message.success('upload successfully.')
          // this.infoForm.apsAuthFile = res.content
          this.fileForm.path = res.content
          console.log('res!!', res)
          return 1
        })
        .catch(res => {
          this.uploading = false
          this.$message.error('upload failed.')
        })
    },
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.userId = this.nid
        this.fileForm.studentId = this.sid.toString()
        console.log(values)
        if (!err) {
          console.log('Received values of form: ', values)
          request({
            method: 'post',
            url: `/api/notice/send`,
            data: values,
            headers: {
              token: util.cookies.get('token')
            }
          }).then(res => {
            this.form.fieldsStore.fields = {}
            this.onClose()
            this.$message.success(i18n.t('message.common.success'))
            if (this.uswitch) {
              console.log('@', this.fileForm)
              request({
                method: 'post',
                url: `/api/file/admin/upload`,
                data: this.fileForm,
                headers: {
                  token: util.cookies.get('token')
                }
              }).then(r => {
                this.file = []
                this.uswitch = false
                this.fileForm = {}
              })
            }
          })
        }
      })
    },
    cellClickEvent ({ row }) {
      this.showDetails = false
      this.rowdata = row
    },
    onClose () {
      this.visible = false
    },
    toolbarButtonClickEvent ({ code }, event) {
      switch (code) {
        case 'myBtn':
          this.$XModal.alert(code)
          break
      }
    },
    contextMenuClickEvent ({ menu, row, column }) {
      switch (menu.code) {
        case 'copy':
          // 示例
          if (row && column) {
            if (XEClipboard.copy(row[column.property])) {
              this.$XModal.message({
                message: 'Copied to clipboard!',
                status: 'success'
              })
            }
          }
          break
        case 'detail':
          // 示例
          if (row && column) {
            if (row.nationality !== 'China') {
              this.detailData = [
                'name',
                'avatar',
                'gender',
                'nationality',
                'birthday',
                'address',
                'phone',
                'exam_auth_file',
                'passport'
              ].map(field => {
                return { label: field, value: row[field] }
              })
            } else {
              this.detailData = [
                'name',
                'avatar',
                'gender',
                'nationality',
                'birthday',
                'address',
                'phone',
                'cet4',
                'cet6',
                'aps_passed',
                'apsid',
                'aps_auth_file',
                'exam_auth_file',
                'passport'
              ].map(field => {
                return { label: field, value: row[field] }
              })
            }
            this.showDetails = true
          }
          break
        case 'notify':
          console.log('Row', row)
          this.visible = true
          this.nid = row.u_id
          this.sid = row.id
          this.nname = row.name
          break
        case 'marked':
          this.notify(row.u_id)
          break
        default:
          this.$XModal.message(`clicked ${menu.name} `)
      }
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.getList()
    },
    getTypes () {
      request({
        method: 'get',
        url: `/api/type/list?current=1&size=99`,
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        this.types = res.content.records
      })
    },
    notify (id) {
      request({
        method: 'put',
        url: `/api/member/nofity?notify=1&uid=${id}`,
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        this.$message.success(i18n.t('message.common.success'))
        if (this._row.includes(res.content.uid)) {
          this._row.splice(this._row.indexOf(res.content.uid), 1)
        }
        this.$refs.xGrid.refreshColumn()
        console.log(this.$refs.xGrid)
      })
    },
    getList (key) {
      let page = this.tablePage
      // XEAjax.get("/api/admin/page", this.tableForm.data).then(data => {
      //   console.log
      //   this.tableData = data;
      //   this.loading = false;
      // });
      let tf = {}
      let row = []
      if (key == 1) {
        tf = Object.assign({}, this.tableForm.data)
        for (let i in tf) {
          if (tf[i] == '') {
            delete tf[i]
          }
        }
      }

      request({
        method: 'get',
        url: `/api/admin/page?current=${page.currentPage}&size=${page.pageSize}`,
        params: tf,
        headers: {
          token: util.cookies.get('token')
        }
      }).then(res => {
        console.log('rsssssss', res)
        this.tableData = res.content.records
        for (let i of res.content.records) {
          if (i.notify === '0') {
            row.push(i.u_id)
          }
        }
        this._row = row
        console.log('_rrr', row)
        this.tablePage.total = res.content.total
      })
    }
  }
}
</script>

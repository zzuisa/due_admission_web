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
      highlight-hover-row
      id="toolbar_demo_1"
      height="100%"
      :form-config="tableForm"
      @page-change="handlePageChange"
      :pager-config="tablePage"
      :columns="tableColumn"
      :data="tableData"
      :toolbar="tableToolbar"
      :custom-config="{storage: true}"
      @toolbar-button-click="toolbarButtonClickEvent"
      @form-submit="getList(1)"
    ></vxe-grid>
  </d2-container>
</template>

<script>
const domain = "http://localhost:888";
import request from "@/utils/request";
import util from "@/libs/util.js";
export default {
  data() {
    return {
      tableData: [],
      tableForm: {
        data: {
          name: "",
          gender: "",
          address: "",
          phone: "",
          nationality: "",
          ger_exam: ""
        },
        items: [
          {
            field: "name",
            title: "姓名",
            itemRender: { name: "input", attrs: { placeholder: "请输入名称" } }
          },
          {
            field: "apsid",
            title: "APS组号",
            itemRender: { name: "input", attrs: { placeholder: "请输入名称" } }
          },
          {
            field: "address",
            title: "地址",
            itemRender: { name: "input", attrs: { placeholder: "请输入名称" } }
          },
          {
            field: "phone",
            title: "手机号码",
            itemRender: { name: "input", attrs: { placeholder: "请输入名称" } }
          },

          {
            field: "gender",
            title: "性别",
            itemRender: {
              name: "$select",
              options: [
                { label: "男", value: "m" },
                { label: "女", value: "f" }
              ]
            }
          },
          {
            field: "ger_exam",
            title: "德语水平",
            itemRender: {
              name: "$select",
              options: [
                { label: "A1", value: "A1" },
                { label: "A2", value: "A2" },
                { label: "B1", value: "B1" },
                { label: "B2", value: "B2" },
                { label: "C1", value: "C1" },
                { label: "C2", value: "C2" }
              ]
            }
          },
          {
            field: "nationality",
            title: "国籍",
            itemRender: {
              name: "$select",
              options: [
                { label: "中国", value: "china" },
                { label: "德国", value: "germany" }
              ]
            }
          },
          {
            itemRender: {
              name: "$button",
              props: { content: "查询", type: "submit", status: "primary" }
            }
          },
          {
            itemRender: {
              name: "$button",
              props: { content: "重置", type: "reset" }
            }
          }
        ]
      },
      tablePage: {
        pageSize: 15,
        currentPage: 1
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
        //   // save: ({ body }) => XEAjax.post("/api/user/save", body)
        // }
      },
      tableToolbar: {
        buttons: [
          { code: "insert_actived", name: "新增" },
          {
            code: "mark_cancel",
            name: "标记/取消",
            dropdowns: [
              { code: "delete", name: "删除选中", type: "text" },
              { code: "remove", name: "移除数据", type: "text" }
            ]
          },
          { code: "save", name: "保存", status: "success" },
          {
            name: "数据导出",
            dropdowns: [
              { code: "open_import", name: "高级导入", type: "text" },
              { code: "open_export", name: "高级导出", type: "text" }
            ]
          },
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
      tableColumn: [
        { type: "checkbox", width: 50 },
        { type: "seq", width: 60 },
        { field: "name", title: "Name", editRender: { name: "input" } },
        { field: "gender", title: "Gender", editRender: { name: "input" } },
        {
          field: "nationality",
          title: "Country",
          editRender: { name: "input" }
        },
        {
          field: "phone",
          title: "Phone",
          width: 80,
          editRender: { name: "input" }
        },
        {
          field: "address",
          title: "Address",
          width: 100,
          editRender: { name: "input" }
        },
        {
          field: "aps_passed",
          title: "aps status",
          width: 80,
          editRender: { name: "input" },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != "china") {
                return "░░░░";
              } else if (row.aps_passed == null || row.aps_passed == "") {
                console.log("!!~~~", row.aps_auth_file);
                return [<el-tag type="warning">待更新</el-tag>];
              } else if (row.aps_passed == "已通过") {
                return [<el-tag type="success">{row.aps_passed}</el-tag>];
              } else if (row.aps_passed == "未通过") {
                return [<el-tag type="danger">{row.aps_passed}</el-tag>];
              }
              return [<el-tag type="warning">{row.aps_passed}</el-tag>];
            }
          }
        },
        {
          field: "apsid",
          title: "aps team id",
          editRender: { name: "input" },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != "china") {
                return "░░░░";
              }
              return row.apsid;
            }
          }
        },
        {
          field: "cet4",
          title: "CET-4",
          editRender: { name: "input" },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != "china") {
                return "░░░░";
              }
              return row.cet4;
            }
          }
        },
        {
          field: "cet6",
          title: "CET-6",
          editRender: { name: "input" },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != "china") {
                return "░░░░";
              }
              return row.cet6;
            }
          }
        },
        {
          field: "ger_exam",
          title: "access exam",
          editRender: { name: "input" },
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.nationality != "china") {
                return "░░░░";
              }
              return row.cet6;
            }
          }
        },
        {
          field: "aps_auth_file",
          title: "aps-auth-file",
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              let domain = "http://localhost:888";
              if (row.nationality != "china") {
                return "░░░░";
              } else if (row.aps_auth_file == null || row.aps_auth_file == "") {
                return [<el-tag type="warning">待上传</el-tag>];
              }
              return [
                <a href={domain + row.aps_auth_file}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  下载
                </a>
              ];
            }
          }
        },
        {
          field: "exam_auth_file",
          title: "exam-auth-file",
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              let domain = "http://localhost:888";
              if (row.exam_auth_file == null || row.exam_auth_file == "") {
                return [<el-tag type="warning">待上传</el-tag>];
              }
              return [
                <a href={domain + row.exam_auth_file}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  下载
                </a>
              ];
            }
          }
        },
        {
          field: "passport",
          title: "passport-file",
          slots: {
            // 使用 JSX 渲染
            default: ({ row }) => {
              if (row.passport == null || row.passport == "") {
                return [<el-tag type="warning">待上传</el-tag>];
              }
              let domain = "http://localhost:888";
              return [
                <a href={domain + row.passport}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  下载
                </a>
              ];
            }
          }
        }
      ]
    };
  },
  mounted() {
    this.getList();
    // XEAjax.mockList(50).then(data => {
    //   this.tableData = data;
    //   this.loading = false;
    // });
  },

  methods: {
    toolbarButtonClickEvent({ code }, event) {
      switch (code) {
        case "myBtn":
          this.$XModal.alert(code);
          break;
      }
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.getList();
    },
    getList(key) {
      let page = this.tablePage;
      // XEAjax.get("/api/admin/page", this.tableForm.data).then(data => {
      //   console.log
      //   this.tableData = data;
      //   this.loading = false;
      // });
      let tf = {};
      if (key == 1) {
        tf = Object.assign({}, this.tableForm.data);
        for (let i in tf) {
          if (tf[i] == "") {
            delete tf[i];
          }
        }
      }

      request({
        method: "get",
        url: `/api/admin/page?current=${page.currentPage}`,
        params: tf,
        headers: {
          token: util.cookies.get("token")
        }
      }).then(res => {
        console.log("rsssssss", res);
        this.tableData = res.content.records;
      });
    }
  }
};
</script>

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
      :keyboard-config="{isArrow: true}"
      :checkbox-config="{trigger: 'row', highlight: true, range: true}"
      height="100%"
      :form-config="tableForm"
      @page-change="handlePageChange"
      :pager-config="tablePage"
      :columns="tableColumn"
      :data="tableData"
      :toolbar="tableToolbar"
      :custom-config="{storage: true}"
      @toolbar-button-click="toolbarButtonClickEvent"
      :context-menu="tableMenu"
      @context-menu-click="contextMenuClickEvent"
      @form-submit="getList(1)"
      @cell-click="cellClickEvent"
    ></vxe-grid>

    <vxe-modal
      v-model="showDetails"
      title="查看详情"
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
  </d2-container>
</template>

<script>
const domain = "http://localhost:888";
import XEClipboard from "xe-clipboard";
import request from "@/utils/request";
import util from "@/libs/util.js";
import i18n from "@/i18n";
export default {
  data() {
    return {
      showDetails: false,
      detailData: [],
      tableData: [],
      rowdata: {},
      tableMenu: {
        className: "my-menus",
        header: {
          options: [[{ code: "exportAll", name: "export all .csv" }]]
        },
        body: {
          options: [
            [
              {
                code: "copy",
                name: "copy",
                prefixIcon: "fa fa-copy",
                className: "my-copy-item"
              }
            ],
            [
              {
                code: "detail",
                name: "detail"
              },
              {
                code: "filter",
                name: "filter",
                children: [
                  {
                    code: "clearFilter",
                    name: i18n.t("message.admin.clearFilter")
                  },
                  {
                    code: "filterSelect",
                    name: i18n.t("message.admin.filterSelect")
                  }
                ]
              },
              {
                code: "sort",
                name: "sort",
                prefixIcon: "fa fa-sort color-blue",
                children: [
                  {
                    code: "clearSort",
                    name: i18n.t("message.admin.clearSort")
                  },
                  {
                    code: "sortAsc",
                    name: "asc",
                    prefixIcon: "fa fa-sort-alpha-asc color-orange"
                  },
                  {
                    code: "sortDesc",
                    name: "desc",
                    prefixIcon: "fa fa-sort-alpha-desc color-orange"
                  }
                ]
              },
              {
                code: "print",
                name: i18n.t("message.admin.print"),
                disabled: true
              }
            ]
          ]
        },
        footer: {
          options: [
            [{ code: "clearAll", name: i18n.t("message.admin.clearAll") }]
          ]
        }
      },
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
            title: i18n.t("message.admin.name"),
            itemRender: {
              name: "input",
              attrs: { placeholder: i18n.t("message.admin.hint") }
            }
          },
          {
            field: "apsid",
            title: i18n.t("message.admin.apsid"),
            itemRender: {
              name: "input",
              attrs: { placeholder: i18n.t("message.admin.hint") }
            }
          },
          {
            field: "address",
            title: i18n.t("message.admin.address"),
            itemRender: {
              name: "input",
              attrs: { placeholder: i18n.t("message.admin.hint") }
            }
          },
          {
            field: "phone",
            title: i18n.t("message.admin.phone"),
            itemRender: {
              name: "input",
              attrs: { placeholder: i18n.t("message.admin.hint") }
            }
          },

          {
            field: "gender",
            title: i18n.t("message.admin.gender"),
            itemRender: {
              name: "$select",
              options: [
                { label: i18n.t("message.common.male"), value: "m" },
                { label: i18n.t("message.common.female"), value: "f" }
              ]
            }
          },
          {
            field: "ger_exam",
            title: i18n.t("message.admin.german_level"),
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
            title: i18n.t("message.admin.nationality"),
            itemRender: {
              name: "$select",
              options: [
                { label: "China", value: "China" },
                { label: "Germany", value: "germany" }
              ]
            }
          },
          {
            itemRender: {
              name: "$button",
              props: {
                content: i18n.t("message.admin.search"),
                type: "submit",
                status: "primary"
              }
            }
          },
          {
            itemRender: {
              name: "$button",
              props: { content: i18n.t("message.admin.reset"), type: "reset" }
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
        //   // save: ({ body }) => XEAjax.post("/api/user/save", body)
        // }
      },
      tableToolbar: {
        buttons: [
          { code: "insert_actived", name: i18n.t("message.admin.new") },
          {
            code: "mark_cancel",
            name: i18n.t("message.admin.target"),
            dropdowns: [
              {
                code: "delete",
                name: i18n.t("message.admin.target1"),
                type: "text"
              },
              {
                code: "remove",
                name: i18n.t("message.admin.target2"),
                type: "text"
              }
            ]
          },
          {
            code: "save",
            name: i18n.t("message.admin.save"),
            status: "success"
          },
          {
            name: i18n.t("message.admin.data_export"),
            dropdowns: [
              {
                code: "open_import",
                name: i18n.t("message.admin.data_export1"),
                type: "text"
              },
              {
                code: "open_export",
                name: i18n.t("message.admin.data_export2"),
                type: "text"
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
              if (row.nationality != "China") {
                return "░░░░";
              } else if (row.aps_passed == null || row.aps_passed == "") {
                console.log("!!~~~", row.aps_auth_file);
                return [
                  <el-tag type="warning">
                    {i18n.t("message.admin.no_update")}
                  </el-tag>
                ];
              } else if (row.aps_passed == "passed") {
                return [<el-tag type="success">{row.aps_passed}</el-tag>];
              } else if (row.aps_passed == "failed") {
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
              if (row.nationality != "China") {
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
              if (row.nationality != "China") {
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
              if (row.nationality != "China") {
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
              if (row.nationality != "China") {
                return "░░░░";
              }
              return row.ger_exam;
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
              if (row.nationality != "China") {
                return "░░░░";
              } else if (row.aps_auth_file == null || row.aps_auth_file == "") {
                return [
                  <el-tag type="warning">
                    {i18n.t("message.admin.no_update")}
                  </el-tag>
                ];
              }
              return [
                <a href={domain + row.aps_auth_file}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  {i18n.t("message.admin.download")}
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
                return [
                  <el-tag type="warning">
                    {i18n.t("message.admin.no_update")}
                  </el-tag>
                ];
              }
              return [
                <a href={domain + row.exam_auth_file}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  {i18n.t("message.admin.download")}
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
                return [
                  <el-tag type="warning">
                    {i18n.t("message.admin.no_update")}
                  </el-tag>
                ];
              }
              let domain = "http://localhost:888";
              return [
                <a href={domain + row.passport}>
                  <a-avatar
                    shape="square"
                    src="https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png"
                  />
                  <br />
                  {i18n.t("message.admin.download")}
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
    /**
     * 
     * name: "",
          gender: "",
          address: "",
          phone: "",
          nationality: "",
          ger_exam: ""
     */
    cellClickEvent({ row }) {
      this.showDetails = false;
      this.rowdata = row;
    },
    toolbarButtonClickEvent({ code }, event) {
      switch (code) {
        case "myBtn":
          this.$XModal.alert(code);
          break;
      }
    },
    contextMenuClickEvent({ menu, row, column }) {
      switch (menu.code) {
        case "copy":
          // 示例
          if (row && column) {
            if (XEClipboard.copy(row[column.property])) {
              this.$XModal.message({
                message: "Copied to clipboard!",
                status: "success"
              });
            }
          }
          break;
        case "detail":
          // 示例
          if (row && column) {
            if (row.nationality != "China") {
              this.detailData = [
                "name",
                "avatar",
                "gender",
                "nationality",
                "birthday",
                "address",
                "phone",
                "exam_auth_file",
                "passport"
              ].map(field => {
                return { label: field, value: row[field] };
              });
            } else {
              this.detailData = [
                "name",
                "avatar",
                "gender",
                "nationality",
                "birthday",
                "address",
                "phone",
                "cet4",
                "cet6",
                "aps_passed",
                "apsid",
                "aps_auth_file",
                "exam_auth_file",
                "passport"
              ].map(field => {
                return { label: field, value: row[field] };
              });
            }
            this.showDetails = true;
          }
          break;
        default:
          this.$XModal.message(`点击了 ${menu.name} 选项`);
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
        url: `/api/admin/page?current=${page.currentPage}&size=${page.pageSize}`,
        params: tf,
        headers: {
          token: util.cookies.get("token")
        }
      }).then(res => {
        console.log("rsssssss", res);
        this.tableData = res.content.records;
        this.tablePage.total = res.content.total;
        
      });
    }
  }
};
</script>

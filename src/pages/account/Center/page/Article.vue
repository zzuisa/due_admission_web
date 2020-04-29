<template>
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
          <a>
            <a-dropdown>
              <a class="ant-dropdown-link" href="javascript:;">
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">1st menu item</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">2nd menu item</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">3rd menu item</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a>
        </template>
      </a-card>
    </a-list-item>
  </a-list>
</template>

<script>
import moment from "moment";
import util from "@/libs/util.js";
import request from "@/utils/request";
export default {
  name: "Article",
  components: {},
  data() {
    return {
      loading: true,
      loadingMore: false,
      dataSource: [],
      data: [],
      dataset: [],
      current: 1,
      total: 0
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let domain = "http://localhost:888";
      request({
        url: "/api/member/getfiles",
        method: "get",
        headers: {
          token: util.cookies.get("token")
        }
      }).then(res => {
        console.log("@", res);
        this.loading = false;
        this.data = res.content;
        let d = [];
        let data = [];
        for (let i in res.content) {
          if (res.content[i] != null) {
            d.push(i);
            data.push(res.content[i]);
          }
        }
        this.data = d;
        this.dataset = data;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          this.dataSource.push({
            title: d[i],
            avatar:
              "https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png",
            url: domain + data[i]
          });
        }
      });
      // this.$http.get('/list/article').then(res => {
      //   console.log('res', res)
      //   this.data = res.result
      //   this.loading = false
      // })
    },
    loadMore() {
      this.loadingMore = true;
      this.$http
        .get("/list/article")
        .then(res => {
          this.data = this.data.concat(res.result);
        })
        .finally(() => {
          this.loadingMore = false;
        });
    }
  }
};
</script>

<style scoped>
</style>

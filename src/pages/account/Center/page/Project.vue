<template>
  <div class="ant-pro-pages-account-projects-cardList">
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta :description="'TIME:['+item.create_time+'] URL:['+item.url +']'">
          <a slot="title" href="https://www.antdv.com/">
          {{ item.content }}
          <a-tag style="float:right">{{item.type}}</a-tag>
          </a>
          <a-avatar
            slot="avatar"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Info_icon-72a7cf.svg/1200px-Info_icon-72a7cf.svg.png"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <a-pagination @change="onPagichange" v-model="current" :total="total" showLessItems />
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: 2
    };
  }
};
</script>

  </div>
</template>

<script>
import moment from "moment";
import util from "@/libs/util.js";
import request from "@/utils/request";

export default {
  name: "Project",

  data() {
    return {
      data: [],
      form: this.$form.createForm(this),
      loading: true,
      current: 1,
      total: 0
    };
  },
  filters: {
    fromNow(date) {
      return moment(date).fromNow();
    }
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    getList(current) {
      request({
        url: `/api/log/mylogs?current=${current}&size=5`,
        methods: "get",
        headers: {
          token: util.cookies.get("token")
        }
      }).then(res => {
        console.log("res!!", res);
        this.loading = false;
        this.data = res.content.records;
        this.total = res.content.total
      });
      // this.$http.get('/list/article', { params: { count: 8 } }).then(res => {
      //   console.log('res', res)
      //   this.data = res.result
      //   this.loading = false
      // })
    },
    onPagichange(e){
      this.getList(e)
    }
  }
};
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

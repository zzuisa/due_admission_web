<template>
  <div class="antd-pro-components-article-list-content-index-listContent">
    <div class="description">
      <slot>
        {{ description }}
      </slot>
    </div>
    <div class="extra">
      <a-avatar :src="avatar" size="small" />
      <a :href="href">{{ owner }}</a> 发布在 <a :href="href">{{ href }}</a>
      <em>{{ updateAt | moment }}</em>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BB',
  props: {
    prefixCls: {
      type: String,
      default: 'antd-pro-components-article-list-content-index-listContent'
    },
    description: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    updateAt: {
      type: String,
      required: true
    }
  },
   mounted() {
     console.log("@@@@@")
  },
}
</script>

<style lang="less" scoped>
// @import './index.less';

.antd-pro-components-article-list-content-index-listContent {
  .description {
    max-width: 720px;
    line-height: 22px;
  }
  .extra {
    margin-top: 16px;
    color: 'black';
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
      color: 'grey';
      font-style: normal;
    }
  }
}

@media screen and (max-width: '500px') {
  .antd-pro-components-article-list-content-index-listContent {
    .extra {
      & > em {
        display: block;
        margin-top: 8px;
        margin-left: 0;
      }
    }
  }
}
</style>

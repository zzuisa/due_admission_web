<template>
  <d2-container>
    <div class="page-header-index-wide page-header-wrapper-grid-content-main">
      <a-row :gutter="24">
        <a-col :md="24" :lg="7">
          <a-card :bordered="false">
            <div class="account-center-avatarHolder">
              <div class="avatar">
                <img :src="user.avatar" />
              </div>
              <div class="username">{{ user.name }}</div>
              <div class="bio">Be tolerant to diversity, tolerance is a virtue</div>
            </div>
            <div class="account-center-detail">
              <p>
                <i class="title"></i>Interaction expert
              </p>
              <p>
                <i class="group"></i>Ant Financial-XX business group-XX platform department-XX technology department-DUE
              </p>
              <p>
                <i class="address"></i>
                <span>Zhe Jiang</span>
                <span>Hang Zhou</span>
              </p>
            </div>
            <a-divider />

            <div class="account-center-tags">
              <div class="tagsTitle">{{$t('message.student.profile.tag')}}</div>
              <div>
                <template v-for="(tag, index) in tags">
                  <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                    <a-tag
                      :key="tag"
                      :closable="index !== 0"
                      :afterClose="() => handleTagClose(tag)"
                    >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                  </a-tooltip>
                  <a-tag
                    v-else
                    :key="tag"
                    :closable="index !== 0"
                    :afterClose="() => handleTagClose(tag)"
                  >{{ tag }}</a-tag>
                </template>
                <a-input
                  v-if="tagInputVisible"
                  ref="tagInput"
                  type="text"
                  size="small"
                  :style="{ width: '78px' }"
                  :value="tagInputValue"
                  @change="handleInputChange"
                  @blur="handleTagInputConfirm"
                  @keyup.enter="handleTagInputConfirm"
                />
                <a-tag v-else @click="showTagInput" style="background: #fff; borderStyle: dashed;">
                  <a-icon type="plus" />New Tag
                </a-tag>
              </div>
            </div>
            <a-divider :dashed="true" />

            <div class="account-center-team">
              <div class="teamTitle">{{$t('message.student.profile.team')}}</div>
              <a-spin :spinning="teamSpinning">
                <div class="members">
                  <a-row>
                    <a-col :span="12" v-for="(item, index) in teams" :key="index">
                      <a>
                        <a-avatar size="small" :src="item.avatar" />
                        <span class="member">{{ item.name }}</span>
                      </a>
                    </a-col>
                  </a-row>
                </div>
              </a-spin>
            </div>
          </a-card>
        </a-col>
        <a-col :md="24" :lg="17">
          <a-card
            style="width:100%"
            :bordered="false"
            :tabList="tabListNoTitle"
            :activeTabKey="noTitleKey"
            @tabChange="key => handleTabChange(key, 'noTitleKey')"
          >
            <article-page v-if="noTitleKey === 'article'"></article-page>
            <app-page v-else-if="noTitleKey === 'app'"></app-page>
            <project-page v-else-if="noTitleKey === 'project'"></project-page>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </d2-container>
</template>

<script>
import { AppPage, ArticlePage, ProjectPage } from "./page";
import i18n from "@/i18n";
import { mapGetters } from "vuex";
import util from "@/libs/util.js";
export default {
  name: "Center",
  components: {
    AppPage,
    ArticlePage,
    ProjectPage
  },
  data() {
    return {
      tags: i18n.t("message.student.profile.tags").split(","),
      user: {},

      account: {},
      tagInputVisible: false,
      tagInputValue: "",

      teams: [],
      teamSpinning: true,

      tabListNoTitle: [
        {
          key: "article",
          tab: i18n.t("message.student.profile.file")
        },
        {
          key: "app",
          tab: i18n.t("message.student.profile.notification")
        },
        {
          key: "project",
          tab: i18n.t("message.student.profile.log")
        }
      ],
      noTitleKey: "article"
    };
  },
  mounted() {
    // this.getTeams()
    let s = util.cookies.get("student");
    let user = "";
    if (s != undefined) {
      user = JSON.parse(s);
      this.user = user;
      console.log("usss", user);
    }
    let account = JSON.parse(util.cookies.get("user"));
    if (account.username == "admin") {
      this.$router.push({ path: "/admin" });
    }
    let domain = "http://localhost:888";
    this.account = account;
    if (this.user.avatar == null || this.user.avatar == "") {
      this.user.avatar = "https://preview.pro.loacg.com/avatar2.jpg";
    } else if (
      this.user.avatar == "https://preview.pro.loacg.com/avatar2.jpg"
    ) {
    } else {
      this.user.avatar = domain + this.user.avatar;
    }
  },
  methods: {
    getTeams() {
      this.$http.get("/workplace/teams").then(res => {
        this.teams = res.result;
        this.teamSpinning = false;
      });
    },

    handleTabChange(key, type) {
      this[type] = key;
    },

    handleTagClose(removeTag) {
      const tags = this.tags.filter(tag => tag !== removeTag);
      this.tags = tags;
    },

    showTagInput() {
      this.tagInputVisible = true;
      this.$nextTick(() => {
        this.$refs.tagInput.focus();
      });
    },

    handleInputChange(e) {
      this.tagInputValue = e.target.value;
    },

    handleTagInputConfirm() {
      const inputValue = this.tagInputValue;
      let tags = this.tags;
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue];
      }

      Object.assign(this, {
        tags,
        tagInputVisible: false,
        tagInputValue: ""
      });
    }
  }
};
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>

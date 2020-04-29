<template>
  <div class="account-settings-info-view" style="max-width:1300px;margin:0 auto">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <div style="margin-bottom: 16px">
            <a-row :gutter="24">
              <a-col span="12">
                <a-input v-model="lastName" addonBefore="姓氏" defaultValue="Zhang" />
              </a-col>
              <a-col span="12">
                <a-form-item>
                  <a-input v-model="firstName" addonBefore="名字" defaultValue="San" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <a-row :gutter="24">
            <a-col span="8">
              <a-form-item label="性别">
                <a-select
                  v-model="infoForm.gender"
                  :disabled="profile.saved==='y'"
                  defaultValue="男"
                  style="width: 120px"
                >
                  <a-select-option value="男">男</a-select-option>
                  <a-select-option value="女">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="16">
              <a-form-item label="出生日期">
                <el-date-picker
                  @change="onDateChange"
                  format="yyyy-MM-dd"
                  v-model="infoForm.birthday"
                  :disabled="profile.saved==='y'"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="国籍" :required="false">
            <el-select
              placeholder="请选择国籍"
              :disabled="profile.saved==='y'"
              filterable
              style="width: 77.9%"
              v-model="infoForm.nationality"
            >
              <el-option-group v-for="group in country" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </a-form-item>
          <a-form-item label="手机号码" :required="false">
            <a-input v-model="infoForm.phone" placeholder />
          </a-form-item>
          <a-form-item label="居住地址" :required="false">
            <a-input v-model="infoForm.address" placeholder />
          </a-form-item>

          <a-form-item>
            <a-button @click="submitForm" type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon" />
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img" />
        </div>
      </a-col>
    </a-row>
    <avatar-modal ref="modal" @ok="setavatar" />
  </div>
</template>

<script>
import AvatarModal from "./AvatarModal";
import request from "@/utils/request";
import moment from "moment";
import util from "@/libs/util.js";
import country from "./country";
export default {
  name: "Base",
  components: {
    AvatarModal
  },
  data() {
    return {
      // cropper
      preview: {},
      country: [],
      profile: {},
      lastName: "",
      domain: "http://localhost:888",
      firstName: "",
      option: {
        img: "https://preview.pro.loacg.com/avatar2.jpg",
        info: true,
        size: 1,
        outputType: "jpeg",
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      infoForm: {
        gender: "",
        name: "",
        avatar: "",
        nationality: "",
        address: "",
        phone: ""
      }
    };
  },
  mounted() {
    this.country = country;
    let c = util.cookies.get("student");
    if (c != undefined) {
      let student = JSON.parse(c);
      this.profile = student;
      this.lastName = student.name.split(" ")[0];
      this.firstName = student.name.split(" ")[1];
      this.infoForm.gender = student.gender;
      this.infoForm.nationality = student.nationality;
      this.infoForm.birthday = student.birthday;
      this.infoForm.phone = student.phone;
      this.infoForm.address = student.address;
      this.infoForm = student;
    }
    if (this.infoForm.avatar != "" && this.infoForm.avatar != null) {
      console.log("@", this.infoForm.avatar);
      this.option.img = this.domain + this.infoForm.avatar;
    }
  },
  methods: {
    onDateChange(e) {
      this.infoForm.birthday = this.dateToString(e);

      console.log(this.infoForm.birthday )
    },
    setavatar(url) {
      let domain = "http://localhost:888";
      this.option.img = domain + url;
      this.infoForm.avatar = url;
    },
    dateToString(date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    onChange() {},
    submitForm() {
      let _this = this;
      let name = _this.lastName + " " + _this.firstName;
      _this.infoForm.name = name;
      let url = "/api/member/new";
      console.log("u", this.infoForm);
      request({
        url,
        method: "put",
        data: this.infoForm,
        headers: {
          token: util.cookies.get("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          util.cookies.set("student", res.content);
          console.log("res:", res.content);
        })
        .catch(e => {
          this.$message.error(e);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>

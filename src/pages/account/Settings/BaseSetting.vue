<template>
  <div class="account-settings-info-view" style="max-width:1300px;margin:0 auto">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <el-form :model="infoForm" ref="infoForm">
          <div style="margin-bottom: 16px">
            <a-row :gutter="24">
              <a-col span="12">
                <a-input :disabled="profile.saved==='y'" v-model="lastName" :addonBefore="$t('message.student.settings.lastname')" />
              </a-col>
              <a-col span="12">
                <a-form-item>
                  <a-input v-model="firstName" :disabled="profile.saved==='y'" :addonBefore="$t('message.student.settings.firstname')" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <a-row :gutter="24">
            <a-col span="8">
              <el-form-item
                :label="$t('message.student.settings.gender')"
                prop="gender"
                :rules="[
      { required: true, message: $t('message.student.settings.hint')},
    ]"
              >
                <a-select
                  v-model="infoForm.gender"
                  :disabled="profile.saved==='y'"
                  :defaultValue="$t('message.student.settings.male')"
                  style="width: 120px"
                >
                  <a-select-option value="m">{{$t('message.student.settings.male')}}</a-select-option>
                  <a-select-option value="f">{{$t('message.student.settings.female')}}</a-select-option>
                </a-select>
              </el-form-item>
            </a-col>
            <a-col span="16">
              <el-form-item
                :label="$t('message.student.settings.birthday')"
                prop="birthday"
                :rules="[
      { required: true, message: $t('message.student.settings.hint')},
    ]"
              >
                <el-date-picker
                  @change="onDateChange"
                  format="yyyy-MM-dd"
                  v-model="infoForm.birthday"
                  :disabled="profile.saved==='y'"
                  type="date"
                  :placeholder="$t('message.student.settings.date_hint')"
                ></el-date-picker>
              </el-form-item>
            </a-col>
          </a-row>

          <el-form-item
            :label="$t('message.student.settings.nationality')"
            prop="birthday"
            :rules="[
      { required: true, message: $t('message.student.settings.hint')},
    ]"
          >
            <el-select
              :placeholder="$t('message.student.settings.nationality_hint')"
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
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <a-form-item :label="$t('message.student.settings.phone')" :required="false">
            <a-input v-model="infoForm.phone" placeholder />
          </a-form-item>
          <a-form-item :label="$t('message.student.settings.address')" :required="false">
            <a-input v-model="infoForm.address" placeholder />
          </a-form-item>

          <a-form-item>
            <a-button @click="submitForm('infoForm')" type="primary">{{$t('message.student.settings.submit')}}</a-button>
          </a-form-item>
        </el-form>
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
import i18n from '@/i18n'
import AvatarModal from './AvatarModal'
import request from '@/utils/request'
import moment from 'moment'
import util from '@/libs/util.js'
import country from './country'
export default {
  name: 'Base',
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      country: [],
      profile: {},
      lastName: '',
      domain: 'http://localhost:888',
      firstName: '',
      option: {
        img: 'https://preview.pro.loacg.com/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
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
        gender: '',
        name: '',
        avatar: '',
        nationality: '',
        address: '',
        phone: ''
      }
    }
  },
  mounted () {
    this.country = country
    this.init()
  },
  methods: {
    init () {
      let c = util.cookies.get('student')
      if (c != undefined) {
        let student = JSON.parse(c)
        this.profile = student
        this.lastName = student.name.split(' ')[0]
        this.firstName = student.name.split(' ')[1]
        this.infoForm = student
      }
      if (this.infoForm.avatar !== '' && this.infoForm.avatar != null) {
        if (this.infoForm.avatar.indexOf('http') === -1) {
          this.option.img = this.domain + this.infoForm.avatar
        }
      }
    },
    onDateChange (e) {
      this.infoForm.birthday = this.dateToString(e)
      console.log(this.infoForm.birthday)
    },
    setavatar (url) {
      let domain = 'http://localhost:888'
      this.option.img = domain + url
      this.infoForm.avatar = url
    },
    dateToString (date) {
      var year = date.getFullYear()
      var month = (date.getMonth() + 1).toString()
      var day = date.getDate().toString()
      if (month.length == 1) {
        month = '0' + month
      }
      if (day.length == 1) {
        day = '0' + day
      }
      var dateTime = year + '-' + month + '-' + day
      return dateTime
    },
    onChange () {},
    changee (e) {
      console.log(e)
    },
    submitForm (e) {
      let _this = this
      if (_this.lastName == '' || _this.lastName == null) {
        this.$message.error('Please fill in lastname')
        return false
      }
      if (_this.firstName == '' || _this.firstName == null) {
        this.$message.error('Please fill in firstName')
        return false
      }
      this.$refs[e].validate(valid => {
        if (valid) {
          let name = _this.lastName + ' ' + _this.firstName
          _this.infoForm.name = name
          let url = '/api/member/new'
          request({
            url,
            method: 'put',
            data: _this.infoForm,
            headers: {
              token: util.cookies.get('token'),
              'Content-Type': 'application/json'
            }
          })
            .then(res => {
              console.log('cookie', res)
              this.$message({
                message: i18n.t('message.common.success'),
                type: 'success'
              })
              util.cookies.set('student', res.content)
              _this.init()
            })
            .catch(e => {
              this.$message.error(e)
            })
        } else {
          return false
        }
      })
    }
  }
}
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

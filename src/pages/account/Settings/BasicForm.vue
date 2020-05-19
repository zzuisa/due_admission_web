<template>
  <div class="account-settings-info-view" style="max-width:1300px;margin:0 auto">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <div style="margin-bottom: 16px" v-if="profile.nationality=='China'">
            <a-row :gutter="24">
              <a-col span="12">
                <a-input v-model="infoForm.cet4" addonBefore="CRT-4" />
              </a-col>
              <a-col span="12">
                <a-form-item>
                  <a-input v-model="infoForm.cet6" addonBefore="CRT-6" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <a-form-item :label="$t('message.student.settings.ger_exam')">
            <a-select v-model="infoForm.gerExam" defaultValue="B1" style="width: 120px">
              <a-select-option value="A1">A1</a-select-option>
              <a-select-option value="A2">A2</a-select-option>
              <a-select-option value="B1">B1</a-select-option>
              <a-select-option value="B2">B2</a-select-option>
              <a-select-option value="C1">C1</a-select-option>
              <a-select-option value="C2">C2</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="profile.nationality=='China'" :required="false">
            <a-input v-model="infoForm.apsid" :addonBefore="$t('message.student.settings.apsid')" />
          </a-form-item>
          <a-form-item
            v-if="profile.nationality=='China'"
            :label="$t('message.student.settings.aps_passed')"
          >
            <a-select v-model="infoForm.apsPassed" defaultValue="Ongoing" style="width: 120px">
              <a-select-option value="Ongoing">{{$t('message.student.settings.status1')}}</a-select-option>
              <a-select-option value="passed">{{$t('message.student.settings.status2')}}</a-select-option>
              <a-select-option value="failed">{{$t('message.student.settings.status3')}}</a-select-option>
            </a-select>
          </a-form-item>
          <el-divider content-position="right">{{$t('message.student.settings.file_upload')}}</el-divider>

          <a-descriptions title="User Info" layout="horizontal" :column="1" bordered>
            <a-descriptions-item
              v-if="profile.nationality=='China'"
              :label="$t('message.student.settings.aps_auth_file')"
            >
              <div class="clearfix">
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
                <!-- <a-button
                  type="primary"
                  @click="handleUpload"
                  :disabled="file.length === 0"
                  :loading="uploading"
                  style="margin-top: 16px"
                >{{ uploading ? 'Uploading' : 'Start Upload' }}</a-button>-->
              </div>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('message.student.settings.exam_auth_file')">
              <div class="clearfix">
                <a-upload
                  name="file"
                  listType="picture-card"
                  :multiple="false"
                  :fileList="gerFile"
                  :remove="handleRemove2"
                  @change="handleChange2"
                  :beforeUpload="beforeUpload2"
                >
                  <a-icon type="upload" />
                  <a-button style="width:100%">Select File</a-button>
                </a-upload>
                <!-- <a-button
                  type="primary"
                  @click="handleUpload"
                  :disabled="file.length === 0"
                  :loading="uploading"
                  style="margin-top: 16px"
                >{{ uploading ? 'Uploading' : 'Start Upload' }}</a-button>-->
              </div>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('message.student.settings.passport')">
              <div class="clearfix">
                <a-upload
                  name="file3"
                  listType="picture-card"
                  :multiple="false"
                  :fileList="passportFile"
                  :remove="handleRemove3"
                  @change="handleChange3"
                  :beforeUpload="beforeUpload3"
                >
                  <a-icon type="upload" />
                  <a-button style="width:100%">Select File</a-button>
                </a-upload>
                <!-- <a-button
                  type="primary"
                  @click="handleUpload"
                  :disabled="file.length === 0"
                  :loading="uploading"
                  style="margin-top: 16px"
                >{{ uploading ? 'Uploading' : 'Start Upload' }}</a-button>-->
              </div>
            </a-descriptions-item>
          </a-descriptions>
          <el-divider content-position="right"></el-divider>

          <a-form-item>
            <a-button @click="submitForm" type="primary">{{$t('message.student.settings.submit')}}</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import util from '@/libs/util.js'
import request from '@/utils/request'
import i18n from '@/i18n'
import setting from '@/setting'
export default {
  name: 'BaseForm',
  data () {
    return {
      // cropper
      domain: setting.domain,
      preview: {},
      country: [],
      headers: {
        token: util.cookies.get('token')
      },
      profile: {},
      file: [],
      passportFile: [],
      gerFile: [],
      uploading: false,
      infoForm: {
        apsid: null,
        apsPassed: null,
        gerExam: null,
        cet6: null,
        cet4: null,
        examAuthFile: null,
        apsAuthFile: null,
        passport: null
      }
    }
  },
  mounted () {
    this.init()
  },

  methods: {
    init () {
      console.log('base init')
      let thumb =
        'https://www.pngitem.com/pimgs/m/499-4997293_pdf-file-icon-png-transparent-png.png'
      let c = util.cookies.get('student')
      if (c != undefined) {
        let student = JSON.parse(c)
        this.profile = student
        console.log('student:', student)
        this.lastName = student.name.split(' ')[0]
        this.firstName = student.name.split(' ')[1]
        this.infoForm = student
        let _f = [
          {
            uid: '-1',
            name: 'aps',
            status: 'done',
            url: this.domain + student.apsAuthFile,
            thumbUrl: thumb
          }
        ]
        if (student.apsAuthFile != null && student.apsAuthFile != '') {
          this.file = _f
        }
        let _f2 = [
          {
            uid: '-1',
            name: 'ger',
            status: 'done',
            url: this.domain + student.examAuthFile,
            thumbUrl: thumb
          }
        ]
        if (student.examAuthFile != null && student.examAuthFile != '') {
          this.gerFile = _f2
        }
        let _f3 = [
          {
            uid: '-1',
            name: 'passport',
            status: 'done',
            url: this.domain + student.passport,
            thumbUrl: thumb
          }
        ]
        if (student.passport != null && student.passport != '') {
          this.passportFile = _f3
        }
      }
    },
    handleChange (info) {
      this.handleUpload()
    },
    handleChange2 (info) {
      this.handleUpload2()
    },
    handleChange3 (info) {
      this.handleUpload3()
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
          this.infoForm.apsAuthFile = res.content
          console.log('res!!', res)
          return 1
        })
        .catch(res => {
          this.uploading = false
          this.$message.error('upload failed.')
        })
    },

    handleRemove2 (file) {
      const index = this.gerFile.indexOf(file)
      const newFileList = this.gerFile.slice()
      newFileList.splice(index, 1)
      this.gerFile = newFileList
    },
    beforeUpload2 (file) {
      this.gerFile = [...this.gerFile, file]
      if (this.gerFile.length > 0) {
        this.gerFile = []
      }
      this.gerFile.push(file)
      return false
    },
    handleUpload2 () {
      const { gerFile } = this
      const formData = new FormData()
      gerFile.forEach(f => {
        formData.append('file', f)
      })
      this.uploading2 = true

      // You can use any AJAX library you like
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
          this.uploading2 = false
          // this.$message.success("upload successfully.");
          this.infoForm.examAuthFile = res.content
          return 1

          console.log('res!!', res)
        })
        .catch(res => {
          this.uploading2 = false
          this.$message.error('upload failed.')
        })
    },
    handleRemove3 (file) {
      const index = this.passportFile.indexOf(file)
      const newFileList = this.passportFile.slice()
      newFileList.splice(index, 1)
      this.passportFile = newFileList
    },
    beforeUpload3 (file) {
      this.passportFile = [...this.passportFile, file]
      if (this.passportFile.length > 0) {
        this.passportFile = []
      }
      this.passportFile.push(file)
      return false
    },
    handleUpload3 () {
      const { passportFile } = this
      const formData = new FormData()
      passportFile.forEach(f => {
        formData.append('file', f)
      })
      this.uploading3 = true

      // You can use any AJAX library you like
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
          this.uploading3 = false
          // this.$message.success("upload successfully.");
          this.infoForm.passport = res.content
          return 1
        })
        .catch(res => {
          this.uploading3 = false
          this.$message.error('upload failed.')
        })
    },
    setavatar (url) {
      this.option.img = url
    },
    onChange () {},
    submitForm () {
      let _this = this
      let name = _this.lastName + ' ' + _this.firstName
      _this.infoForm.name = name
      let url = '/api/member/new'
      console.log('u', this.infoForm)
      request({
        url,
        method: 'put',
        data: this.infoForm,
        headers: {
          token: util.cookies.get('token')
        }
      })
        .then(res => {
          this.$message({
            message: i18n.t('message.common.success'),
            type: 'success'
          })
          util.cookies.set('student', res.content)
          console.log('res:', res.content)
        })
        .catch(e => {
          this.$message.error(e)
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
.el-upload__input {
  display: none;
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

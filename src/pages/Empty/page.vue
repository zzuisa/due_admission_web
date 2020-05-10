<template>
  <div class="page">
   <a-empty
    image="https://www.pngkey.com/png/full/152-1526212_under-construction-png-under-construction-icon-png.png"
    :image-style="{
      height: '200px',
    }"
  >
    <span slot="description"></span>
     <a-alert
     style="text-align:left"
      :message="$t('message.common.warning')"
      :description="$t('message.common.under_construction')"
      type="warning"
      show-icon
    />
  </a-empty>
  </div>
</template>
<script>
export default {
  name: 'Empty'
}
</script>
<style lang="scss" scoped>
.page {
  background-blend-mode: multiply,multiply;
  padding: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .page_title {
    font-size: 20px;
    color: #FFF;
  }
}
</style>

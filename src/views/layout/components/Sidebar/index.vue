<template>
  <div>
    <div class="logo-box" v-show="!isCollapse">
      <el-image class="img" :src="logo"></el-image>
    </div>
   <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#20324D"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
        
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
     </scroll-bar>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import logo from '@/assets/images/logo.png'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar',
      'routers'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data(){
    return{
      logo:logo
    }
  }
}
</script>
<style  scoped>
  .logo-box{
    width: 180px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    letter-spacing:2px;
    background: #233A5C;
    border-bottom: 1px solid #233A5C;
    color: #409EFF;
  }
  .img{
    width: 140px;
    height: 85px;
    padding: 0;
    margin: 0;
    vertical-align: center;
    overflow: hidden;
  }
</style>

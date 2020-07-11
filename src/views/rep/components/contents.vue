<template> 
<div class="form-pdf contents">
    <div class="content-box">
        <div v-for="(item,index) in data" :key="index">
          <div  class="flex-wrap" v-if="!item.hidden">
              <div class="round"></div>
              <div >{{item.pageName}}</div>
              <div class="content">------------------------------------------------------------------------------------</div>
              <div>{{item.pageNum}}</div>
          </div>
        </div> 
    </div>
</div>
</template>
<script>
  export default {
    name: 'contents',
    props:{
      data:{
        type:Array,
      }
    }
  }
</script>
<style scoped>
   .form-pdf.contents{
      padding: 70px;
      background:url("../img/contents.png")no-repeat;
      page-break-after:always;
      background-size: 100% 100%;
   }
   .box-label{
     margin: 55px 20px;
     width: 697px;
     height: 108px;
     line-height: 108px;
     text-align: left;
     background:#2B8FB8;
     color:#fff;
   }
  .box-label .lable-text{
    font-size: 10px; 
    text-align: left;
    margin-left: 110px;
    width: 10px;
    line-height: 10px;
    transform: scale(0.8);
    writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/  
    writing-mode: tb-lr;
  }
  .box-label .title{
    font-size: 60px;
  }
  .content-box{
    margin-top:130px;
    font-size: 26px;
    color: #2B8FB8;
  }
  .content-box .round{
    width: 10px;
    height: 10px;
    margin: 0 10px;
    background: #2B8FB8;
    border-radius: 10px;
  }
  .content-box .content{
      flex:1;
      margin: 25px 10px;
      white-space: nowrap;
      overflow: hidden;
  }
</style>



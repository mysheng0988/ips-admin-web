<template> 
  <div class="item-box">
      <div class="content">
          <div class="content-title" v-if="data.questionnaireName">{{data.questionnaireName}}</div>
          <div v-if="data.score">得分：{{data.score}}分</div>
          <div v-if="data.conclusion">{{data.conclusion}}</div>
          <div v-for="(item,index) in data.explanation" :key="index" >{{item}}</div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'scaleText',
    props: {
      data: {
          type: Object,
          default:{}
        },
    },
    data(){
   
      return {
        
      }
    }
  }
</script>
<style  scoped>
   .item-box{
    padding: 10px 0;
    width: 626px;
  }
  .content{
    flex:1;
    color: #666;
     margin: 5px 0;
     font-size: 15px;
     text-align: justify;
    line-height: 30px;                                                                                                                         
  }
  .content .content-title{
     font-size: 20px;
     color: #48A3DA;
  }
   .chart{
     width: 240px;
     height: 180px;
     margin-right: 20px;
   }
</style>



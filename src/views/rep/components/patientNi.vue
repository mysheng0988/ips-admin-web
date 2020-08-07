<template> 
  <div class="form-pdf">
    <div class="pdf-bar"></div>
    <div class="content-box">
      <div class="label-title">
        <p>附录. 患者教育</p>
        <p>P<span>ATIENT EDUCATION</span></p>
      </div>
      <template v-for="(item,index) in data">
        <div :class="item.type==0?'content-title':'content'"  :key="'t'+index" ><span v-if='item.type==10' class="span">&#9633;</span>{{item.content}}</div>
      </template>
    </div>
    <div class="pageNum">-{{pageNum}}-</div>   
  </div>
</template>
<script>
  export default {
    name: 'rep-analysis',
    props:{
      data:{
        type:Array
      },
      pageNum:{
        type:Number
      }

    },
    data(){
      return {
      };
    },
    mounted(){
    
    }
  }
</script>
<style scoped>
   .pdf-bar{
     width: 649px;
     height: 10px;
     position:absolute;
     right: 0;
     top:12px;
     background:url("../img/pdf-bar.png") no-repeat;
     background-size: 100% 100%;
   }
   .pdf-bar-left{
     width: 649px;
     height: 10px;
     margin-top: 12px;
     background:url("../img/pdf-bar2.png") no-repeat;
     background-size: 100% 100%;
   }
   .content-box{
     margin-top:70px;
     padding: 0 70px;
   }
   .label-title{
    width: 705px;
    height: 72px;
    text-align: left;
    font-size: 30px;
     color: #48A3DA;
  }
  .label-title span{
    font-size: 14px;
    font-weight: bold;
  }
  .content-box .span{
    font-size: 30px;
    font-weight: bold;
    color: #000;
    margin: 5px;
  }

 .content-box .content-title{
    font-size: 26px;
    color: #222;
    line-height: 45px;
  }
 .content-box .content{
    font-size: 20px;
    color: #666;
     font-size: 15px;
     text-align: justify;
    line-height: 30px;
  }
  .content.indent{
    text-indent: 2em
  }
</style>



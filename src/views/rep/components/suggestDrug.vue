<template> 
  <div class="form-pdf">
    <div class="pdf-bar"></div>
    <div class="content-box">
      <div class="label-title">
        <p>治疗方案参考</p>
        <p>T<span>REATMENT PLAN REFERENCE</span></p>
      </div>
       <div v-for="(item,index) in data"  :key="'d'+index" >
        <div v-if="item.type==0" class="item.type==0?'content-title':'content'" >{{item.content}}</div>
          <div class="sign-box" v-else-if="item.type==100">
          <div class="sign-name">测评师(签字):</div>
          <div class="sign-content flex-wrap" >
            <div>此报告仅供参考,不作为临床诊断。</div>
            <div>测评师:{{item.name}}</div>
            <div>测评时间:{{item.createTime}}</div>
          </div>
        </div>
        <div v-else class="content" >{{item.content}}</div>
      </div>
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
  }
 .content-box .content-title{
    font-size: 26px;
    color: #222;
    line-height: 45px;
    margin: 10px 0;
  }
 .content-box .content{
    font-size: 20px;
    color: #666;
     margin: 5px 0;
     font-size: 15px;
    line-height: 30px;
  }
  .sign-box{
  padding: 0 70px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
}
.sign-box .sign-name{
   text-align: right;
   line-height: 60px;
   margin-right: 150px;
   font-size:24px;
}
.sign-box .sign-content{
  border-top:1px solid #ddd;
  line-height: 30px;
  font-size:14px;
  color:#999;
}
</style>



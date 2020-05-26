<template> 
  <div class="form-pdf">
    <div class="pdf-bar"></div>
    <div class="content-box">
      <div class="label-title">
        <p>附录. 自主神经检查</p>
        <p>A<span>UTONOMIC NERVE EXAMNATION</span></p>
      </div>
      <div class="content-title">1.自主神经症状：</div>
      <div class="content indent"> 
          {{data.symptom==""?"暂无自主神经症状":data.symptom}}
      </div>
      <div class="content-title">2.HRV检测结果：</div>
      <el-image class="img" :src="base64"></el-image>
      <!-- <img class="img" :src="data.resultImageUrl" crossorigin="anonymous"> -->
    </div>
    <div class="pageNum">-{{pageNum}}-</div>   
  </div>
</template>
<script>
import hrv from '@/assets/images/hrv-icon.png'
import {getHRV} from "@/api/HRV"
  export default {
    name: 'nerveExamine',
    props:{
       pageNum:{
         type:Number
       },
       medicalRecordId:{
         type:String,
       }
    },
    data(){
      return {
        base64:"",
        data:[]
      };
    },
    mounted(){
     getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.data=res.dataList[0];
              this.base64="data:image/png;base64,"+this.data.resultImageUrl;
          }
        })
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
     text-align: justify;
    line-height: 30px;
  }
  .content.indent{
    text-indent: 2em
  }
  .content-box .img{
     width: 100%;
     height: 700px;
  }
</style>



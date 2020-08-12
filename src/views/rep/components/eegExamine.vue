<template> 
  <div class="form-pdf">
    <div class="pdf-bar"></div>
    <div class="content-box">
      <div class="label-title">
        <p>附录. EEG检测</p>
        <p>E<span>EG DETECTION</span></p>
      </div>
      <el-image class="img" :src="eegPath" ></el-image>
      <!-- <img class="img" :src="eegPath" crossorigin="anonymous"> -->
    </div>
    <div class="pageNum">-{{pageNum}}-</div>   
  </div>
</template>
<script>
import eeg from '@/assets/images/eeg-icon.png'
import{getEEG} from "@/api/HRV"
  export default {
    name: 'eegExamine',
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
        eegPath:"",
        }
    },
    mounted(){
      getEEG(this.medicalRecordId).then(res=>{
          if(res.code==200){
            this.eegPath=res.dataList[0].resultImageUrl;
          }else{
            this.$message.warning("没有查到数据")
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
     margin-top: 10px;
     width: 100%;
     height: 800px;
  }
</style>



<template> 
  <div class="form-pdf end">
    <div class="pdf-container">
      <div class="title">Medical manual</div>
      <div class="msg-content flex-wrap">
         <div class="conent" v-if="hospitalData">
            <!-- <div>{{info.hospitalName}}</div> -->
            <div>医院名称：{{hospitalData.name}}</div>
            <div>联系电话：{{hospitalData.contactNumber}} </div>
            <div>医院地址：{{hospitalData.address}} </div>
         </div>
         <div class="img-box">
            <el-image class="img" :src="qrcode"></el-image>
            <p>扫码了解更多</p>
         </div>
      </div>
    </div>
    <div class="bg-color"></div>
  </div>
</template>
<script>
  import qrcode from '@/assets/images/logo-qrcode.png'
  import {getHospitalData} from '@/api/manage'
   import {mapGetters} from 'vuex'
  export default {
    name: 'rep-analysis',
    props:{
      data:{
        
      },

    },
    data(){
      return {
        qrcode: qrcode,
        hospitalData:"",
      };
    },
     computed:{
      ...mapGetters([             //步骤二，对象扩展运算符方式
        "info"
      ])
    },
    mounted(){
      getHospitalData(this.info.hospitalId).then(res=>{
        if(res.code==200){
         
          this.hospitalData=res.dataList[0]
        }
      })
    }
  }
</script>
<style scoped>
    .form-pdf.end{
      height: 1085px;
    }
   .pdf-container{
       padding: 70px;
   }
   .title{
     width: 220px;
     padding :20px 0;
     color: #E1E1E1;
     font-size: 30px;
     border-bottom: 4px solid #B6CDDF;
   }
   .msg-content{
     line-height: 35px;
     width: 620px;
     position:absolute;
     font-size: 16px;
     bottom: 150px;
   }
   .conent{
     flex:1;
   }
   .conent-title{
     color: #E1E1E1;
     font-size: 30px;
   }
   .img-box{
     width: 100px;
   }
   .img-box .img{
     width: 100px;
     height: 100px;
     overflow: hidden;
     vertical-align: middle;
   }
   .bg-color{
     background:#298FBA;
     position:absolute;
     bottom: 50px;
     width: 768px;
     height: 80px;
   }
</style>



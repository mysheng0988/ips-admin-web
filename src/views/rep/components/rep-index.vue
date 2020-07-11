<template> 
   <div class="index-pdf">
     <div class="title">IPS系统心身{{patientData.examinationTypeCode=="20001"?"筛查":"综合"}}报告</div>
     <div class="dept">来源科室：{{patientData.fromDeptName}}</div>
     <div class="user-msg" >{{patientVo.realName}} 
        <span>{{patientVo.gender?"男":"女"}}</span> 
         {{patientVo.birthday|formatAge}} </div>
     <div class="case-num">病例号:{{patientData.beHospitalizedNumber}}</div>
   </div>
</template>
<script>
  
  export default {
    name: 'rep-index',
    props:{
      patientData:{
        type:Object,
      },
      patientVo:{
        type:Object,
      }
    },
    filters:{
     formatAge(birthday){
        if(birthday&&birthday!=""){
          let age=birthday.substring(0,4);
          let year=new Date().getFullYear();
          return year-age-1;
        }
         return "";
      },
    },
    mounted(){
    }
   
  }
</script>
<style  scoped>
  .index-pdf{
     position: relative;
     width: 768px;
     height: 1091px;
     page-break-after:always;
     text-align: left;
     border: 1px solid #eee;
     background:url("../img/rep-index.png") no-repeat;
     background-size: 100% 100%;
   }
   .title{
     color: #2E8DBA;
     font-size: 50px;
     position: absolute;
     left: 82px;
     top:155px;
   }
   .dept{
     width: 234px;
     height: 54px;
     line-height: 54px;
     border: 2px solid #2E8DBA;
     text-align: center;
     position:absolute;
     font-size: 20px;
     left: 81px;
     top: 373px;
   }
   .user-msg{
      width: 320px;
      height: 35px;
      line-height: 35px;
      font-size: 36px;
      text-align: left;
      color: #fff;
      position: absolute;
      left: 80px;
      top:480px;
   }
   .user-msg span{margin: 0 10px}
   .case-num{
     width: 297px;
     height: 30px;
     line-height: 35px;
     font-size: 24px;
      text-align: left;
      color: #fff;
      position: absolute;
      left: 80px;
      top:568px;
   }
</style>



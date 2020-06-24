<template>
  <div class="form-pdf experience">
    <div class="content-box">
      <el-timeline class="time-box">
            <template  v-for="(item,index) in experienceData" >
              <el-timeline-item :timestamp="index" :key="index" placement="top" type="primary" size="large">
               
             </el-timeline-item>
              <el-timeline-item  v-for="(item1,index1) in item" :key="index+'-'+index1" :timestamp="item1.month" placement="top" color="#1B9BC0">
                <p v-if="item1.symptom!=''">自述症状为：{{item1.symptom}}</p>
                <p>就诊过的医院为：{{item1.hospitalName}}</p>
                <p v-if="item1.checkup!=''">做过的检查有:{{item1.checkup}}</p>
                <p>诊断的结果为:{{item1.diagnosis}}</p>
                <p>治疗方案为：{{item1.programs}}</p>
                <p v-if="item1.cureItem!=''"> 治疗的效果为：{{item1.cureItem}}</p>
              </el-timeline-item>
            </template>
           
          
      </el-timeline>
    </div>
    <div class="pageNum">-{{pageNum}}-</div>   
  </div>
</template>

<script>
    export default {
        name: "experience",
        props:{
          pageNum:{
            type:Number
          },
          experienceData:{
            type:Object,
          },
      },
      data(){
        return{

        }
      },
      mounted(){
          // let experienceYear=[];
          // let 
          // for(let item of this.experienceData){

          // }
      },
    }
</script>

<style scoped>
    .form-pdf.experience{
      padding: 70px;
      background:url("../img/experience.png");
      background-size: 768px 1100px;
   }
   .content-box{
     margin-top: 100px;
     text-align: left;
   }
  .time-box{
    width:600px;
    margin: auto;
    line-height: 35px;
  }
</style>

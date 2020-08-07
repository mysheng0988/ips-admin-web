<template>
  <div class="form-pdf patient-msg">
    <div class="symptom-box">
      <div class="symptom-title">心身综合结果</div>
      <div class="symptom-content ">
        <div class="content"  v-for="(item,index) in patientData" :key="index">
          <div class="title" v-if="item.type==1">{{item.content}}</div>
          <div class="lable" v-else >{{item.content}}</div>
        </div>
      </div>
     
    </div>
     <div class="pageNum">-{{pageNum}}-</div>   
  </div>
</template>
<script>

export default {
  name: "result",
  props: {
    patientData: {
      type: Array
    },
    pageNum:{
      type:Number
    },
    medicalRecordId: {
      type: String
    }
  },
  data() {
    return {
      
    };
  },
  filters: {
  
  },
  computed: {},
  mounted() {

  },
  methods: {}
};
</script>
<style  scoped>
.form-pdf.patient-msg {
  padding: 70px;
  background: url("../img/patient-msg.png") no-repeat;
  background-size: 100% 100%;
}
.msg-box {
  margin-top: 30px;
  text-align: left;
}
.msg-box .title {
  font-size: 30px;
  color: #2b8fb8;
}
.msg {
  margin: 20px 0;
  padding: 0 20px;
  border-left: 4px solid #2b8fb8;
}
.msg-box .flex-item {
  flex: 1;
  margin-bottom: 5px;
}
.flex-width {
  flex: 2;
}
.symptom-title {
  padding-left: 20px;
  width: 255px;
  height: 53px;
  line-height: 53px;
  font-size: 28px;
  background: url("../img/pdf-label.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.symptom-content {
  margin: 5px 0;
}
.symptom-content .img {
  margin: 0 10px;
  width: 77px;
  height: 77px;
}
.symptom-content .content {
  margin: 0 20px;
  text-align: left;
  flex: 1;
  line-height: 35px;
}
.symptom-content .content .title {
  font-size: 16px;
   color: #1C99C7;
  font-weight: 700;
}
.symptom-content .content .lable {
  font-size: 14px;
}
.conclusion{
  color: #000;
  font-size: 14px;
}
.max-width {
  max-width: 300px;
}
.footer-img {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.form-pdf .pageNum {
  color: #000;
}
.item-box {
  margin-top: 20px;
  padding: 10px 0;
  width: 626px;
}
.item-box .content {
  flex: 1;
  color: #666;
  margin: 5px 0;
  font-size: 15px;
  text-align: justify;
  line-height: 30px;
}
.item-box .content span {
  margin: 0 10px;
}
.item-box .chart {
  width: 240px;
  height: 180px;
  margin-right: 20px;
}
.content-box .content {
  font-size: 20px;
  color: #666;
  margin: 5px 0;
  font-size: 15px;
  text-align: justify;
  line-height: 30px;
}
.content.indent {
  text-indent: 2em;
}
</style>



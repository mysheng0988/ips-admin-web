<template> 
  <div class="form-pdf">
    <div class="pdf-bar"></div>
    <div class="content-box">
      <div class="label-title">
        <p>附录.量表评估</p>
        <p>S<span>CALE ASSESSMENT</span></p>
      </div>
      <div v-for="(item,index) in data" :key="index">
        <chart-gauge :data="item"  v-if="item.type=='dial'"></chart-gauge>
        <scale-text :data="item"  v-else-if="item.type=='text'"></scale-text>
        <scale-table :data="item" v-else-if="item.type=='table'"></scale-table>
        <chart-radar :data="item" v-else-if="item.type=='Radar'"></chart-radar>
        <chart-histogram :data="item" v-else-if="item.type=='Histogram'"></chart-histogram>
      </div>
     
     <!-- <chart-gauge :data="data2" ></chart-gauge>
     <chart-gauge :data="data3" ></chart-gauge> -->
     <!-- <chart-histogram ></chart-histogram>
     <chart-line></chart-line>
     <chart-radar></chart-radar> -->
      <div class="pageNum">-{{pageNum}}-</div>   
    </div>
  </div>
</template>
<script>
 import{scaleResult} from "@/api/report"
 import chartGauge from './chart/chartGauge'
 import chartHistogram from './chart/chartHistogram'
 import chartLine from './chart/chart-line'
 import chartRadar from './chart/chart-radar'
 import scaleText from './chart/scaleText'
 import scaleTable from './chart/scaleTable'
  export default {
    name: 'scaleAssess',
    components:{
      chartGauge,
      chartHistogram,
      chartLine,
      scaleText,
      scaleTable,
      chartRadar
    },
    props:{
      pageNum:{
        type:Number
      },
      title:{
        type:String,
      },
      data:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
       
      };
    },
    mounted(){
      console.log(this.title)
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
   .content-box{
     margin-top:70px;
     padding: 0 70px;
   }
   .content-box .content{
    flex:1;
    font-size: 20px;
    color: #666;
     margin: 10px 0;
     font-size: 15px;
     text-align: justify;
    line-height: 30px;
  }
 
   
</style>



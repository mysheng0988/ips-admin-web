<template> 
  <div class="item-box flex-center">
      <div class="chart"> <ve-gauge :data="chartData" width="100%" height="100%" :settings="chartSettings" ></ve-gauge></div>
      <div class="content">
          <div class="content-title">{{data.questionnaireName}}</div>
          <div>得分：{{data.score}}分</div>
          <div>{{data.conclusion}}</div>
          <div v-for="(item,index) in data.explanation" :key="index">{{item}}</div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'chart-gauge',
    props: {
      data: {
          type: Object,
          default:{}
        },
    },
    data(){
      return {
         extend2: {
             toolbox: {
              show: true,
              feature: {
              restore: {},
              saveAsImage: {}
          }
         },
         },
        chartSettings:{
          labelMap: {
          'score': '得分'
          },
          // dataName: {
          // 'score': '分'
          // },
           seriesMap: {
            'score': {
              min:-40,
              max:22,
              startAngle: 200 ,
              endAngle: -20 ,
              splitNumber:2,
              radius: '90%',
              axisLine:{
                  lineStyle:{
                    width:10
                  }
              },
              title:{
                fontSize:10,
              },
              splitLine:{
                length:15,
                offsetCenter:[10,0]
              },
              detail:{
                fontSize:12,
                formatter: function (value) {
                    return "得分:"+value+"分";
                }
              }
            }
          }
        },
        chartData: {
          columns: ['type','value'],
          rows: [
            { type: 'score', value: 14 },
          ]
        }
      }
    },
     mounted(){
      this.chartData.rows[0].value=this.data.score;
      let data =this.data.chartData;
      this.chartSettings.seriesMap.score.max=data[0].max;
      this.chartSettings.seriesMap.score.min=data[0].min;
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
     width: 250px;
     height: 180px;
     margin-right: 20px;
   }
</style>



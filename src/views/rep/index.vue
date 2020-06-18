<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" size="small">
        <el-form-item >
          <el-input  placeholder="患者编号" v-model="listQuery.condition.patientId" clearable></el-input>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="患者姓名" v-model="listQuery.condition.patientName" clearable></el-input>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="身份证号" v-model="listQuery.condition.cardNo" clearable></el-input>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="createDate"
            type="daterange"
            range-separator="至"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            clearable
            @change="handleTimeChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报告类型:">
          <el-select placeholder="请选择" v-model="listQuery.condition.typeId" clearable>
            <el-option value="" label="全部" ></el-option>
            <el-option value="3" label="筛查报告"></el-option>
            <el-option value="4" label="综合报告"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button  class="search-btn" @click="clearData"><svg-icon icon-class="reset-icon" class-name="search-icon"></svg-icon>重置</el-button>
          <el-button icon="el-icon-search" type="success"  class="search-btn" @click="queryData()">查询</el-button>
        </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="患者姓名" align="center">
          <template slot-scope="scope">{{scope.row.patientName }}</template>
        </el-table-column>
        <!-- <el-table-column label="出生日期"  align="center">
          <template slot-scope="scope">{{scope.row.birthday }}</template>
        </el-table-column>
        <el-table-column label="年龄"  align="center">
          <template slot-scope="scope">
            {{scope.row.birthday|formatAge}}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="性别" align="center">
          <template slot-scope="scope">{{scope.row.gender |formatGender}}</template>
        </el-table-column> -->
        <el-table-column label="身份证号"  align="center">
          <template slot-scope="scope">{{scope.row.cardNo }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="报告类型"  align="center">
          <template slot-scope="scope">{{scope.row.typeId|formatType }}</template>
        </el-table-column>

        <el-table-column   label="操作" align="center" width="200">
          <template slot-scope="scope" >
               <el-button
                size="mini"
                class="active"
                @click="readReport(scope.row)">
                <svg-icon icon-class="see-icon" class-name="search-icon"></svg-icon>查看报告
              </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getReportListData} from '@/api/report'
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: "list",
    data() {
      return {
       
        list: [],
        listLoading: false,
        total:0,
        createDate:[],
        listQuery: {
           condition : {
            cardNo: "",
            endTime: "",
            patientId: "",
            patientName: "",
            startTime: "",
            typeId: ""
          },
          pageNum: 1,
          pageSize: 10
        },
        rules:{
          cardID: [
            {required: true, message: '请输入身份证号码', trigger: 'blur'},
            { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确',trigger: 'blur' }
          ]
        }

      }
    },
    created() {
      this.getList()
    },
    filters:{
      formatType(val){
        return val=="3"?"筛查报告":"综合报告";
      },
      formatGender(gender){
        return gender?"女":"男"
      },
      formatAge(birthday){
        let age=birthday.substring(0,4);
        let year=new Date().getFullYear();
        return year-age-1;
      }
    },
    methods: {
      clearData(){
        this.listQuery.condition.cardNo="";
        this.listQuery.condition.endTime="";
        this.listQuery.condition.patientId="";
        this.listQuery.condition.patientName="";
        this.listQuery.condition.startTime="";
        this.listQuery.condition.typeId="";
        this.listQuery.pageNum=1;
        this.listQuery.pageSize=10;
      },
      readReport(data){
        let path=data.typeId==4?"pdf":"siftPdf";
        this.$router.push({
          path: '/rep/'+path,
          query: {
            id: data.medicalRecordId,
            name:data.patientName,
            createTime:data.createTime
          }
        })
      },
      handleRecord(data){
        this.$router.push({
          path: '/pat/assessRecord',
          query: {
            id: data.pid
          }
        })
      },
      queryData(){
        this.listQuery.pageNum = 1;
        this.getList();
      },
       handleTimeChange(val){
        this.listQuery.condition.startTime=this.createDate[0]+" 00:00:00";
        this.listQuery.condition.endTime=this.createDate[1]+ " 23:59:59";
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList(){
        this.listLoading=true;
        getReportListData(this.listQuery).then(res=>{
          this.listLoading=false;
          if(res.code==200){
            this.list=res.dataList;
            this.total=res.pageInfo.total;
          }
        }).catch(error => {
         this.listLoading=false;
        })
      }
    },

  }
</script>

<style scoped>
  .cardContent{
    width: 100%;
    text-align: center;
  }
  .cardContent .img{
    width: 160px;
    height: 120px;
    margin: 10px auto;
  }
  .cardContent p{
    line-height: 35px;
  }
  .flag{
    font-size: 16px;
    font-weight: bold;
    color: #222;
  }
  .flag-type{
    font-size: 14px;
    font-weight: bold;
    color: #222;
  }
  .flag-type .text{
    padding: 0 10px;
    color: #A6CE39;
  }
  .flag-type .num{
    padding: 0 10px;
    color:#1197D6;
  }
  .cardContent .card-input{
    text-align: center;
  }
  .search-btn{
    width: 100px;
  }
  .active{
    border:1px solid #1197D6;
    color: #1197D6;
  }
  .active-btn{
    background: #1197D6!important;
    color: #fff!important;
  }
</style>

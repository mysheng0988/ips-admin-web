<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" size="small" >
    
        <el-form-item label="测评状态:" >
          <el-radio-group v-model="listQuery.examinationStatus" @change="queryData">
            <el-radio label="102" >全部</el-radio>
            <el-radio label="0" >待测评</el-radio>
            <el-radio label="101" >测评中</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="success" round class="search-btn" @click="queryData()">查询</el-button>
        </el-form-item> -->
    </el-form>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <!-- <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column> -->
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.patientId}}</template>
        </el-table-column>
        <el-table-column label="患者姓名" align="center">
          <template slot-scope="scope">{{scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="出生日期"  align="center">
          <template slot-scope="scope">{{scope.row.birthday }}</template>
        </el-table-column>
        
        <el-table-column label="年龄"  align="center">
          <template slot-scope="scope">
            {{scope.row.age}}
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">{{scope.row.gender |formatGender}}</template>
        </el-table-column>
         <el-table-column label="手机号码"  align="center">
          <template slot-scope="scope">{{scope.row.mobileNumber }}</template>
        </el-table-column>
         <el-table-column label="测评项目"  align="center">
          <template slot-scope="scope">{{scope.row.examinationTypeCode |formatExamination}}</template>
        </el-table-column>
        <el-table-column label="来源科室"  align="center">
          <template slot-scope="scope">{{scope.row.fromDeptName }}</template>
        </el-table-column>
        <el-table-column label="来源医生" align="center">
          <template slot-scope="scope">{{scope.row.fromRealName }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="测评状态"  align="center">
          <template slot-scope="scope">{{scope.row.examinationStatus |formatExaminationStatus}}</template>
        </el-table-column>
        <el-table-column   label="操作" align="center">
          <template slot-scope="scope" >
               <el-button
                size="mini"
                round
                class="active"
                @click="addPursue(scope.row)">
                {{scope.row.examinationStatus===0?"开始测评":"继续测评"}}
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
    <el-dialog
      title="刷卡验证"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="cardContent">
        <el-image class="img" :src="require('@/views/pat/imgs/cardID.png')"></el-image>
        <p class="flag">请将磁卡置于机器上方</p>
        <p class="flag-type">卡分类:<span class="text">200</span>/<span class="num">0</span></p>
        <p>刷卡成功后进行后续操作</p>
        <el-form ref="cardForm"
                 :model="cardForm"
                 :rules="rules">
          <el-form-item   prop="cardID" >
             <el-input v-model="cardForm.cardID" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPatient('cardForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {medicalRecordList} from '@/api/medicalRecord'
  import {getScaleJson} from '@/api/getJson'
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: "list",
    data() {
      return {
        contentState:null,
        createDate:[],
        list: null,
        examinationList:[],
        cardForm:{
          cardID:""
        },
        listLoading: false,
        dialogVisible:false,
        total:0,
        active:0,
        listQuery: {
          examinationStatus: "102",
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
      formatGender(gender){
          return gender?"男":"女"
      },
      formatAge(birthday){
        if(birthday){
          let age=birthday.substring(0,4);
          let year=new Date().getFullYear();
          return year-age;
        }
       return ""
      },
      formatExaminationStatus(value){
        switch (value) {
          case 0:
            return "待测评"
            break;
          case 100:
            return "已完成"
            break;
           default:
            return "测评中"
            break;
        }

      },
      formatExamination(val){
        switch (val) {
          case 20001:
            return "筛查测评"
            break;
          case 20002:
            return "专科测评"
            break;
          case 20003:
            return "综合测评"
            break;
        }
      }
    },
    methods: {
       handleTimeChange(val){
        this.listQuery.createTimeStart=this.createDate[0];
        this.listQuery.createTimeEnd=this.createDate[1];
      },
      addPursue(data){
        let path="IPS-C";
        if(data.examinationTypeCode=="20001"){
          path="IPS-A"
        }else if(data.examinationTypeCode=="20002"){
          path="IPS-B"
        }
        this.$router.push({
          path: '/ips/'+path,
          query: {
            id: data.patientId,
            medicalRecordId:data.id,
            name:data.realName,
          }
        })
      },
      addPatient(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.dialogVisible=false;
            this.$router.push({
              path: '/pat/patAdd',
              query: {
                id: this.cardForm.cardID
              }
            })
          }
        })

      },
      queryData(){
        this.listQuery.pageNum = 1;
        this.getList();
      },
      getExaminationBtn(){
        queryExamination(this.info.deptId).then(res=>{
          if(res.code==200){
            this.examinationList=res.dataList;
          }
        })
      },
      changeBtn(val){
        this.active=val;
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
        medicalRecordList(this.listQuery).then(res=>{
          this.listLoading=false;
          if(res.code==200){
            this.list=res.dataList;
            this.total=res.pageInfo.total;
          }else{
            this.list=[];
            this.total=0;
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

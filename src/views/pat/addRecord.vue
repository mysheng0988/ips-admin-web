<template>
  <el-card class="form-container" shadow="never">
    <div class="title">
      <i class="el-icon-tickets"></i>
      <span>来源（病例）信息</span>
    </div>
    <el-form :model="customClass"
             :rules="rules"
             ref="customClassFrom"
             label-width="120px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="患者来源：" prop="shopId" >
            <el-select  placeholder="请选择" clearable class="input-width">
              <el-option >门诊</el-option>
              <el-option >住院</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="住院号："   >
            <el-input v-model="customClass.className" maxlength="15" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="科室："  >
            <el-select  placeholder="请选择" clearable class="input-width">
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="床 号："  prop="shopId" >
            <el-input v-model="customClass.className"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医 生："  prop="shopId" >
            <el-select  placeholder="请选择" clearable class="input-width">
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项 目："  prop="shopId" >
            <el-select  placeholder="请选择" clearable class="input-width">
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="治疗项目："  prop="shopId" >
            <el-input v-model="customClass.className"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('customClassFrom')">保存</el-button>
        <el-button v-if="!isEdit" @click="resetForm('customClassFrom')">保存并完成</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {saveCustomClass,getCustomClassById} from '@/api/classify';
  import { Message, MessageBox } from 'element-ui'
  const defaultCustomClass = {
    id:null,
    shopId:null,
    className: '',
    goodsAmount:0,
    navState: 0,
    goodsUnit: '',
    classSort: 0,
    createDate:null,
    updateDate:null,
    comments: null,
  };
  export default {
    name: "ProductCateDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        customClass: Object.assign({}, defaultCustomClass),
        selectProductCateList: [],
        shopList:[],
        radio:1,
        classId:null,
        select: { province: '广东省', city: '广州市', area: '海珠区' },
        rules: {
          className: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          shopId: [
            {required: true, message: '请选择店铺', trigger: 'blur'}
          ]
        },
        filterAttrs: [],
        filterProductAttrList: [{
          value: []
        }]
      }
    },
    created() {

    },
    methods: {

      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              saveCustomClass(this.customClass).then(res=>{
                if(res.code==0){
                  this.$router.back();
                }else {
                  Message.error(res.message)
                }
              })
            })
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.customClass = Object.assign({}, defaultCustomClass);
      }
    }
  }
</script>

<style scoped>
  .input2{
    width: 45%;
  }
  .input-width{
    width: 100%;
  }
  .form-container{
    margin: 0 auto;
  }
  .title{
    font-size: 16px;
    color: #666;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .distpicker-address-wrapper  select option{
    min-width: 200px!important;
  }
</style>

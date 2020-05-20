<template>
<div class="app-container">
  <el-card class="form-container" shadow="never">
    <el-form :model="patObj"
             :rules="rules"
             ref="patObjFrom"
             label-width="140px">
      <div class="title">
        <i class="el-icon-tickets"></i>
        <span>基本信息</span>
      </div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="姓名："  prop="realName"  maxlength="10" show-word-limit >
              <el-input v-model="patObj.realName" placeholder="请输入姓名" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别："   >
              <el-radio-group v-model="patObj.gender" @change="genderChange">
                <el-radio :label="true">男</el-radio>
                <el-radio :label="false">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="民族："   prop="nation" >
              <!-- <el-input v-model="patObj.nation" placeholder="请输入民族,如:汉族"></el-input> -->
              <el-select v-model="patObj.nation" placeholder="请选择" class="input-width">
                  <el-option v-for="(item,index) in nation" :key="index"
                  :value="item"
                  :label="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号："  prop="cardNo" >
              <el-input v-model="patObj.cardNo" placeholder="请输入身份证号" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期："  prop="birthday" >
              <el-date-picker
                v-model="patObj.birthday"
                class="input-width"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年 龄："   >
              <el-input v-model="age" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宗教/信仰："  prop="faith"  >
              <el-input v-model="patObj.faith" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文化程度："  prop="education" >
              <el-select  placeholder="请选择" v-model="patObj.education" clearable class="input-width">
                <el-option label="小学及以下" value="小学及以下" ></el-option>
                <el-option label="初中" value="初中"></el-option>
                <el-option label="高中" value="高中"></el-option>
                <el-option label="中专" value="中专"></el-option>
                <el-option label="大专" value="大专"></el-option>
                <el-option label="学士" value="学士"></el-option>
                <el-option label="硕士" value="硕士"></el-option>
                <el-option label="博士及以上" value="博士及以上"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职  业："  prop="profession" >
              <el-input v-model="patObj.profession" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式："  prop="contactDetails" >
              <el-input v-model="patObj.contactDetails" placeholder="请输入内容" clearable maxlength="11" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身  高："  prop="height" >
              <el-input v-model.number="patObj.height">
                <template slot="append" placeholder="请输入内容">cm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体  重："  prop="weight" >
              <el-input v-model.number="patObj.weight" placeholder="请输入内容">
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="左右利手："  prop="dominantHand" >
              <el-select  placeholder="请选择" v-model="patObj.dominantHand" clearable class="input-width">
                <el-option  label="左手" :value="true"></el-option>
                <el-option  label="右手" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">
          <i class="el-icon-tickets"></i>
          <span>家庭状况</span>
        </div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="婚姻状况："  prop="maritaStatus" >
              <el-select  placeholder="请选择" v-model="patObj.maritaStatus"  clearable class="input-width">
                <el-option label="未婚" value="未婚"></el-option>
                <el-option label="已婚" value="已婚"></el-option>
                <el-option label="离婚" value="离婚"></el-option>
                <el-option label="再婚" value="再婚"></el-option>
                <el-option label="丧偶" value="丧偶"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排行/兄妹人数：" prop="siblingsNumber" >
              <el-input v-model="patObj.familyRanking" class="input2"></el-input>/
              <el-input v-model="patObj.siblingsNumber" class="input2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人群分类："  prop="crowdRole"  >
              <el-select  placeholder="请选择" v-model="patObj.crowdRole" multiple clearable class="input-width" >
                <el-option v-for="(item,index) in optionRow" :key="index"
                     :label="item"
                     :value="item"
                   ></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子女人数："   >
              <el-input v-model="patObj.childrenNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主要抚养人："   >
              <!-- <el-input v-model="patObj.caregiver" placeholder="请输入内容"></el-input> -->
               <el-select
                  v-model="patObj.caregiver"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择主要抚养人"
                  clearable class="input-width" >
                  <el-option
                    v-for="(item,index) in options"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子女情况："   >
              <el-input v-model="patObj.childrenSituation"
                  type="textarea"
                  placeholder="请输入内容"
                  :autosize="{minRows: 2, maxRows: 4}"
                  maxlength="50"
                  show-word-limit ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父母情况："  >
              <el-input v-model="patObj.parentSituation"
                  type="textarea"
                  placeholder="请输入内容"
                  :autosize="{minRows: 2, maxRows: 4}"
                  maxlength="50"
                  show-word-limit ></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">
          <i class="el-icon-location-information"></i>
          <span>地址信息</span>
        </div>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="选择地址："   >
              <v-distpicker class="address" @selected="onSelected" :province="select.province" :city="select.city" :area="select.area"></v-distpicker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="详细地址：">
              <el-input
                class="textarea"
                placeholder="请输入内容"
                type="textarea"
                v-model="address"
                :autosize="true"
                maxlength="100"
                show-word-limit
                clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('patObjFrom')">确认修改</el-button>
        <!-- <el-button @click="resetForm('patObjFrom')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>

<script>
  import {validateNum} from '@/utils/validate';
  import {getInfoCard,updatePatient} from '@/api/patient';
  import { Message, MessageBox } from 'element-ui'
  const defaultPatient = {
    pid:null,
    birthday: "",
    contactDetails: "",
    cardNo: "",
    caregiver: "",
    childrenNumber: 0,
    childrenSituation: "",
    crowdRole: ["无"],
    address: "",
    dominantHand: false,
    education: "",
    faith: "",
    familyRanking: 1,
    gender: true,
    height: "",
    maritaStatus: "",
    nation: '汉族',
    parentSituation: "",
    password: "",
    profession: "",
    realName: "",
    siblingsNumber: 1,
    username: "",
    weight: ""
  };
  export default {
    name: "patAdd",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
        const validateNumberSort= (rule, value, callback) => {
        if (!validateNum(value)) {
            callback(new Error('必须为数字'))
        } else {
          if(value>10){
             callback(new Error('必须小于10的数字'))
          }else if(this.patObj.familyRanking-value>0){
             callback(new Error('排行数不能大于兄妹总数'))
          }else{
               callback()
          }
        }
      };
       const validateNumberTen = (rule, value, callback) => {
        if (!validateNum(value)) {
            callback(new Error('必须小于10的数字'))
        } else {
         if(value>10){
            callback(new Error('必须小于10的数字'))
          }else{
              callback()
          }
        }
      };
       const validateNumber = (rule, value, callback) => {
        if (value!=""&&!validateNum(value)) {
          callback(new Error('必须是数字'))
        } else {
          callback()
        }
      };
      return {
        patObj: Object.assign({}, defaultPatient),
        select: { province: '北京市', city: '北京城区', area: '海淀区' },
         options:["父母","父亲","母亲","祖父母","外祖父母"],
        optionRow:["无","驾驶员","机器操纵者","高空作业者","从事危险工作者","精细工作者"],
        address:"",
        doctorList:[],
        examinationList:[],
        deptList:[],
        cureList:[],
        showBase:true,
         nation:["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族",
        "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族", "土族", 
        "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族", 
        "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"],
        rules: {
          realName: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
           nation: [
            {required: true, message: '必填字段', trigger: 'change'}
          ],
           faith: [
            {required: true, message: '必填字段', trigger: 'blur'}
          ],
          birthday: [
            {required: true, message: '必填字段', trigger: 'blur'}
          ],
          profession: [
            {required: true, message: '必填字段', trigger: 'blur'}
          ],
          contactDetails: [
            {required: true, message: '必填字段', trigger: 'blur'},
            {pattern :/^(\d{10}|\d{11})$/,message:'输入有效联系方式',trigger: 'blur'}
          ],
          education: [
            {required: true, message: '必填字段', trigger: 'change'}
          ],
          maritaStatus: [
            {required: true, message: '必填字段', trigger: 'change'}
          ],
          height: [
            {required: true, message: '必填字段', trigger: 'blur'},
             { type:'number', message: '必须为数字',trigger: 'blur'}
          ],
          weight: [
            {required: true, message: '必填字段', trigger: 'blur'},
             { type:'number', message: '必须为数字',trigger: 'blur'}
          ],
          maritaStatus: [
            {required: true, message: '必填字段', trigger: 'change'}
          ],
          caregiver: [
            {required: true, message: '必填字段', trigger: 'blur'}
          ],
          crowdRole: [
             {required: true, message: '必填字段', trigger: 'change'}
          ],
          siblingsNumber:[
             {required: true, trigger: 'blur', validator: validateNumberSort}
          ],
          childrenNumber:[
            {required: false, trigger: 'blur', validator: validateNumberTen}
          ],
          cardNo: [
            {required: true, message: '请输入身份证号码', trigger: 'blur'},
            { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证格式不正确',trigger: 'blur' }
          ]
        },
      }
    },
    computed:{
      info () {
        return this.$store.state.user.info
      },
     age:function () {
        if(this.patObj.cardNo!=""){
          let age=this.patObj.cardNo.substring(6,10);
          let year=new Date().getFullYear()
          return year-age-1;
        }
        return "";
      }
    },

    created() {
      //this.select.province+","+this.select.city+","+this.select.area;
      let cardNo=this.$route.query.id;
      this.patObj.cardNo=cardNo;
      this.patObj.birthday=cardNo.substring(6,10)+"-"+cardNo.substring(10,12)+"-"+cardNo.substring(12,14);
      this.getInfoCardNum();
    },


    methods: {
      genderChange(){
        if(this.patObj.gender){
          this.optionRow=["无","驾驶员","机器操纵者","高空作业者","从事危险工作者","精细工作者"];
        }else{
         this.optionRow= ["无","哺乳","妊娠期妇女","育龄期妇女","产妇","孕妇","妊娠期妇女（前三个月）","驾驶员","机器操纵者","高空作业者","从事危险工作者","精细工作者"]
        }
        this.patObj.crowdRole=["无"]
      },
      onSelected(val){
        this.select.province=val.province.value;
        this.select.city=val.city.value;
        this.select.area=val.area.value;
      },
      getInfoCardNum(){
        getInfoCard(this.$route.query.id).then(res=>{
          if(res.code==200){
            this.showBase=false;
            this.patObj=res.dataList[0];
            let arrStr=this.patObj.address.split(",");
            if(arrStr.length>2){
              this.address=arrStr[3]
              this.select.province=arrStr[0]
              this.select.city=arrStr[1]
              this.select.area=arrStr[2]
            }else{
              this.address=arrStr[0]
              this.showBase=true;
            }

          }
          return this.patObj.pid;
        })
      },
      onSubmit(formName) {

        this.patObj.address=this.select.province+","+this.select.city+","+this.select.area+","+this.address;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                updatePatient(this.patObj).then(res=>{
                 if(res.code==200){
                  this.$store.commit('delete_tabs', this.$route.path)
                  this.$router.push("/pat/list")
                   Message.success("修改成功")
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
        this.patObj = Object.assign({}, defaultPatient);
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
  .active{
    color: #409EFF;
    cursor: pointer;
  }
</style>

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  {path: '/pdf2', component: () => import('@/views/rep/pdf2'), hidden: true, meta: {title: '报告分析', icon: 'home',roleId:[1,13,18]}},
  {path: '/siftPdf2', component: () => import('@/views/rep/siftPdf2'), hidden: true, meta: {title: '报告分析', icon: 'home',roleId:[1,13,18]}},
  {path: '/login', component: () => import('@/views/login/index'), hidden: true,roleId:[1,13,18]},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    meta: {title: '首页', icon: 'home',roleId:[1,13,18]},
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home',roleId:[1,13,18]}
    }]
  },
  {
    path: '/pat',
    component: Layout,
    redirect: '/pat/list',
    name: 'pat',
    meta: {title: '患者管理', icon: 'patient',roleId:[18,13]},
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/pat/index'),
        meta: {title: '患者管理', icon: 'patient',roleId:[13,18]},
      },
      {
        path: 'patAdd',
        name: 'patAdd',
        component: () => import('@/views/pat/add'),
        meta: {title: '新增患者', icon: 'product-add',roleId:[13,18]},
        hidden:true,
      },
      {
        path: 'patUpdate',
        name: 'patUpdate',
        component: () => import('@/views/pat/update'),
        meta: {title: '修改患者', icon: 'product-update',roleId:[13,18]},
        hidden:true,
      },
      {
        path: 'addRecord',
        name: 'addRecord',
        component: () => import('@/views/pat/addRecord'),
        meta: {title: '新增病历', icon: 'product-add',roleId:[13,18]},
        hidden:true,
      },
      {
        path: 'assessRecord',
        name: 'assessRecord',
        component: () => import('@/views/pat/assessRecord'),
        meta: {title: '历史记录', icon: 'history-icon',roleId:[13,18]},
        hidden:true
      },
      {
        path: 'cureRecord',
        name: 'cureRecord',
        component: () => import('@/views/pat/cureRecord'),
        meta: {title: '治疗记录', icon: 'treatment',roleId:[13,18]},
        hidden:true,
      },
      {
        path: 'readRecord',
        name: 'readRecord',
        component: () => import('@/views/pat/readRecord'),
        meta: {title: '查看记录', icon: 'product-list',roleId:[13,18]},
        hidden:true,
      }
    ]
  },
  {
    path: '/ips',
    component: Layout,
    redirect: '/ips/index',
    name: 'ips',
    meta: {title: '心身检查', icon: 'checkup',roleId:[13,18]},
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/ips/index'),
        meta: {title: '心身检查', icon: 'checkup',roleId:[13,18]},
      },
      {
        path: 'IPS-A',
        name: 'IPS-A',
        component: () => import('@/views/ips/IPS-A'),
        meta: {title: '筛查测评', icon: 'product-list',roleId:[13,18]},
        hidden:true,
      },{
        path: 'IPS-B',
        name: 'IPS-B',
        component: () => import('@/views/ips/IPS-B'),
        meta: {title: '专科测评', icon: 'product-list',roleId:[13,18]},
        hidden:true,
      },{
        path: 'IPS-C',
        name: 'IPS-C',
        component: () => import('@/views/ips/IPS-C'),
        meta: {title: '综合测评', icon: 'product-list',roleId:[13,18]},
        hidden:true,
      },
      {
        path: 'resultHRV',
        name: 'resultHRV',
        component: () => import('@/views/ips/resultHRV'),
        meta: {title: '记录结果-HRV', icon: 'product-list',roleId:[13,18]},
        hidden:true,
      },
      {
        path: 're-scale',
        name: 're-scale',
        component: () => import('@/views/ips/resultScale'),
        meta: {title: '记录结果-量表', icon: 'product-list',roleId:[13,18]},
        hidden:true,
      },{
        path: 'questionResult',
        name: 'questionResult',
        component: () => import('@/views/ips/questionResult'),
        meta: {title: '答题结果', icon: 'product-list',roleId:[13,18]},
        hidden:true,
      }
    ]
  },
  {
    path: '/rep',
    name: 'rep',
    component: Layout,
    redirect: '/rep/list',
    meta: {title: '报告列表', icon: 'report-icon',roleId:[13,18]},
    children: [
      {
        path: 'list',
        name: 'repList',
        component: () => import('@/views/rep/index'),
        meta: {title: '报告列表', icon: 'report-icon',roleId:[13,18]},
      },{
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/rep/edit'),
        meta: {title: '编辑报告', icon: 'product-attr',roleId:[13,18]},
        hidden:true,
      },{
        path: 'pdf',
        name: 'pdf',
        component: () => import('@/views/rep/pdf'),
        meta: {title: '综合报告', icon: 'product-attr', roleId:[13,18]},
        hidden:true,
      },{
        path: 'siftPdf',
        name: 'siftPdf',
        component: () => import('@/views/rep/siftPdf'),
        meta: {title: '筛查报告', icon: 'product-attr', roleId:[13,18]},
        hidden:true,
      }
    ],
  },
  {
    path:'/sms',
    component: Layout,
    redirect: '/sms/coupon',
    name: 'sms',
    meta: {title: '心身治疗', icon: 'sms',roleId:[1]},
    hidden:true,
  },
  {
    path:'/param',
    component: Layout,
    redirect: '/param/cureItem',
    name: 'param',
    meta: {title: '参数配置', icon: 'param',roleId:[1]},
    hidden:true,
    children: [
      {
        path: 'cureItem',
        name: 'cureItem',
        component: () => import('@/views/param/cureItem'),
        meta: {title: '治疗项目', icon: 'sms-ad',roleId:[1]}
      },
      {
        path: 'assess',
        name: 'assess',
        component: () => import('@/views/param/assessItem'),
        meta: {title: '测评项目', icon: 'sms-flash',roleId:[1]}
      },
      {
        path: 'scale',
        name: 'scale',
        component: () => import('@/views/param/scaleManage'),
        meta: {title: '量表管理',icon:'sms-new',roleId:[1]},
      },

    ]
  },
  {
    path:'/que',
    component: Layout,
    redirect: '/que/index',
    name: 'que',
    meta: {title: '题库管理', icon: 'param',roleId:[1,18,13]},
    hidden:true,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/que/index'),
        meta: {title: '题库列表', icon: 'sms-ad',roleId:[1,18,13]}
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/que/add'),
        meta: {title: '增加问题',icon:'sms-new',roleId:[1,18,13]},
      },
      {
        path: 'temp',
        name: 'temp',
        component: () => import('@/views/que/template'),
        meta: {title: '增加模板',icon:'sms-new',roleId:[1,18,13]},
      },
      {
        path: 'tIndex',
        name: 'tIndex',
        component: () => import('@/views/que/tempIndex'),
        meta: {title: '模板列表',icon:'sms-new',roleId:[1,18,13]},
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/que/tempDetail'),
        meta: {title: '模板详情',icon:'sms-new',roleId:[1,18,13]},
        hidden:true,
      },
    ]
  },
  {
    path:'/user',
    component: Layout,
    redirect: '/user/account',
    name: 'user',
    meta: {title: '系统管理', icon: 'sys-setting',roleId:[13]},
    children: [
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/user/accountManagement'),
        meta: {title: '账户管理', icon: 'admin-icon',roleId:[13]}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/user/roleManagement'),
        meta: {title: '角色权限',icon:"sms-subject",roleId:[1]},
        hidden:true,
      },
      {
        path: 'hos',
        name: 'hos',
        component: () => import('@/views/user/hosManagement'),
        meta: {title: '医院管理',icon:"icon-hos",roleId:[18,13]},
      },
      {
        path: 'dep',
        name: 'dep',
        component: () => import('@/views/user/depManagement'),
        meta: {title: '科室管理', icon: 'icon-dep',roleId:[13]},
      },
      {
        path: 'gls',
        name: 'gls',
        component: () => import('@/views/gls/gls'),
        meta: {title: '郭老师测试', icon: 'icon-dep',roleId:[13]},
        hidden:true
      },
    ]
  },
  {path: '',
    component: Layout,
    redirect: '/404',
    hidden: true,
    children: [{
      path:'404',
      name:"404",
      component: () => import('@/views/404'),
      meta: {title: '404', icon: 'sms-flash',roleId:[1,13,18]},
      hidden: true
    }]
  },
  {path: '*', redirect: '/404', hidden: true,roleId:[1,13,18]}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})


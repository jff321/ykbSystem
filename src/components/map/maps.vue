<template>
  <div class="map-wrapper-box">
    <!--<div class="map-input" v-if="isShowBusiness">-->
      <!--<el-input placeholder="请输入商圈半径"  type="number"  min="0" v-model="mapInput">-->
        <!--<template slot="append">米</template>-->
      <!--</el-input>-->
    <!--</div>-->
    <!--<el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" v-if="showSBox"></el-amap-search-box>-->
    <!--<el-amap :vid="'amap' + index" :zoom="zoom" :center="mapcenter" class="amap-demo" :plugin="plugin" :events="events" >-->
    <el-amap :zoom="zoom" :center="mapcenter" class="amap-demo" :plugin="plugin" :events="events" >
      <!--<el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" v-if="isSelect"></el-amap-marker>-->
      <!--<el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index" v-if="!isSelect"></el-amap-marker>-->
      <!--<el-amap-circle v-for="(circle, index) in circles"  :key="index"  :center="circle.center" :radius="circle.radius" :fill-opacity="circle.fillOpacity" :events="circle.events"  v-if="isShowBusiness"></el-amap-circle>-->
    </el-amap>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AMap from 'vue-amap';
  Vue.use(AMap);
  AMap.initAMapApiLoader({
    key: '756977d097dc23f8523cf188121d7892',
    plugin: [
      'Autocomplete',
      'AMap.PlaceSearch',
      'Scale',
      'OverView',
      'ToolBar',
      'MapType',
      'PolyEditor',
      'AMap.CircleEditor',
      'AMap.Geocoder',
      'AMap.Geolocation'
    ]
  });
  export default {
    name: "maps",
    // props:{
    //   showBusiness: {
    //     type:Boolean,
    //     default:true
    //   },
    //   number:{
    //     type:Number
    //   },
    //   makers:{
    //     type:Array
    //   },
    //   model:{    // 默认为选择模式
    //     type:Boolean,
    //     default:true
    //   },
    //   lnglat:{   // 传递的经纬度  点击时传递的经纬度
    //     type:Array,
    //     default:function () {
    //       return [104.090933, 30.621318]
    //     }
    //   },
    //   showSearchBox:{   //默认显示搜索框
    //     type:Boolean,
    //     default:true
    //   }
    // },
    data(){
      let self = this;
      return{
        // isShowBusiness: false, // 是否显示商圈
        // mapInput: null,
        // index:this.number,
        // isSelect:true,  // 默认为选择模式
        // showSBox:true,  // 默认显示搜索框
        zoom: 15,
        // mapcenter: this.lnglat,
        mapcenter: [114.085947,22.547],
        lng: 0,
        lat: 0,
        // address: '',
        // searchOption: {
        //   city: '全国',
        //   citylimit: false
        // },
        // marker: {
        //   // position: this.lnglat,
        //   position: [104.090933, 30.621318],
        //   visible: true,
        //   draggable: false
        // },
        // markers: [
        //   {
        //     // position: [121.5273285, 31.21515044]  // 参数结构实例
        //     position: [self.lng, self.lat]  // 参数结构实例
        //   }
        // ],

        events: {
          // click(e) {
          //     let {lng, lat} = e.lnglat;
          //     self.lng = lng;
          //     self.lat = lat;
          //     self.marker.position = [self.lng, self.lat];   // 点击改变marker标记的位置
          //     self.circles[0].center = [self.lng, self.lat];
          //     self.$emit('changeData',self.marker.position);
          // }
        },
        // plugin: [],
        plugin: [   // 一些工具插件
          {
            pName: 'Geolocation',   // 定位
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  console.log('RESULT:', result);
                  // if (result.status === 0) {
                  //   Dialog.alert({
                  //     title: "提示",
                  //     message: result.message
                  //   });
                  // }
                  if (result && result.position) {
                    self.lng = result.position.lng;             // 设置经度
                    self.lat = result.position.lat;             // 设置维度
                    self.center = [self.lng, self.lat];         // 设置坐标
                    self.loaded = true;                         // load
                    self.$nextTick();                           // 页面渲染好后
                  }
                });
              }
            }
          }
        ],
        // circles: [    // 覆盖圆
        //   {
        //     center: [104.090933, 30.621318],
        //     radius: 200,
        //     fillOpacity: 0.5
        //   }
        // ]
      }
    },
    watch:{
      // makers:function (newValue,oldValue) {
      //   console.info('oldValue',oldValue);
      //   if(newValue){
      //     this.mapcenter = newValue[0].position;
      //     this.markers = newValue;
      //   }
      // },
      // mapInput:function (newValue,oldValue) {
      //   console.info('oldValue',oldValue);
      //   if(newValue){
      //     this.circles[0].radius = newValue;
      //   }
      // }
    },
    mounted(){
      // this.index = this.number;
      // this.isShowBusiness = this.showBusiness;
      // this.showSBox = this.showSearchBox;
      // this.isSelect = this.model;
    },
    methods: {
      // onSearchResult(pois) {
      //   console.info('搜索', pois);
      //   let latSum = 0;
      //   let lngSum = 0;
      //   if (pois.length > 0) {
      //     pois.forEach(poi => {
      //       let {lng, lat} = poi;
      //       lngSum += lng;
      //       latSum += lat;
      //       // console.info('搜索1',[poi.lng, poi.lat]);
      //       this.$emit('changeData',[poi.lng, poi.lat]);
      //       // this.value = [poi.lng, poi.lat];
      //       this.circles[0].center = [poi.lng, poi.lat];
      //       this.marker.position = [poi.lng, poi.lat];
      //       this.mapcenter = [poi.lng, poi.lat];
      //     })
      //   }
      // },
    }
  }
</script>
<style>
  .map-wrapper-box .el-input__inner{
    height: 45px !important;
    border: none !important;
  }
  .map-wrapper-box .el-input-group__append,
  .map-wrapper-box .el-input-group__prepend{
    border: none !important;
  }
  .map-wrapper-box .el-vue-search-box-container{
    box-shadow: none !important;
  }
</style>
<style scoped>
  .map-wrapper-box{
    width:100% ;
    height:100%;
    position: relative;
  }
  .amap-demo{
    width:100%;
    height: 300px;
  }
  .map-wrapper-box .amap-demo {
    height: 300px;
  }
  .map-wrapper-box .search-box {
    position: absolute;
    top: 25px;
    left: 25px;
  }
  .map-wrapper-box .amap-page-container{
    position: relative;
  }
  .map-wrapper-box .amap-demo{
    height: 100%;
  }
  .map-wrapper-box .amap-toolbar{
    top: 70px !important;

  }
  .map-input{
    position: absolute;
    top: 25px;
    right: 0px;
    z-index: 100;
  }
  .map-input input{
    width: 100%;
    padding-left: 10px;
    border-radius: 5px;
    border: 1px solid #eee;
    outline: none;
  }
</style>
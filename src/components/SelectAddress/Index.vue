<template>
  <div class="address_container">
    <el-form-item label="" class="ctjt_form_item_class" prop="provinceId">
      <el-select class="w_200" v-model="dataConfig.provinceName" placeholder="请选择省份" @change="provChange" :disabled="disabled">
        <el-option
          v-for="item in provData"
          :key="item.adcode"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="" class="ctjt_form_item_class" prop="cityId">
    <el-select class="w_200" v-model="dataConfig.cityName" placeholder="请选择城市" style="margin-left: 8px" @change="cityChange" @visible-change="cityVisible" :disabled="disabled">
      <el-option
        v-for="item in cityData"
        :key="item.adcode"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="" class="ctjt_form_item_class" prop="areaId">
    <el-select class="w_200" v-model="dataConfig.areaName" placeholder="请选择区域" style="margin-left: 8px" @change="areaChange" @visible-change="areaVisible" :disabled="disabled">
      <el-option
        v-for="item in areaData"
        :key="item.adcode"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
    </el-form-item>
  </div>
</template>
<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Watch
} from 'vue-property-decorator';

type ProvCityType = {
  adcode: number,
  name: string,
  subs: [],
}

type ProvType = {
  adcode: number,
  name: string,
}

type DataConfigType = {
  provinceId?: number,
  provinceName?: string,
  cityId?: number,
  cityName?: string,
  areaId?: number,
  areaName?: string
}

@Component
export default class CtjtSelectAddress extends Vue {
  @Prop() dataConfig!: DataConfigType;

  @Prop() disabled?: boolean;

  @Prop() isEdit?: boolean;

  // 拉取省市区json
  private provCity = require('@/assets/json/prov.json');

  // 省数组
  private provData: ProvType[] = [];

  // 市数组
  private cityData: ProvType[] = [];

  // 区数组
  private areaData: ProvType[] = [];

  private addressData = {
    provinceSubs: [],
    citySubs: [],
  }

  @Watch('dataConfig.provinceId')
  change() {
    if (this.dataConfig.provinceId && this.isEdit) {
      this.provCity.forEach((item: ProvCityType) => {
        const { name, subs } = item;
        if (name === this.dataConfig.provinceName) {
          this.addressData.provinceSubs = subs;
          this.cityData = subs;
          if (this.dataConfig.cityId) {
            subs.forEach((val: ProvCityType) => {
              if (val.name === this.dataConfig.cityName) {
                this.addressData.citySubs = val.subs;
                this.areaData = val.subs;
              }
            });
          }
        }
      });
    }
  }

  // 设置省
  setProvFunc() {
    this.provData = [];
    this.provCity.forEach((item: ProvCityType) => {
      const { adcode, name } = item;
      const _obj: ProvType = { adcode, name };
      this.provData.push(_obj);
    });
  }

  // 设置城市
  setCityFunc() {
    const { provinceSubs } = this.addressData;
    provinceSubs.forEach((item: ProvCityType) => {
      const { adcode, name } = item;
      const _obj:ProvType = { adcode, name };
      this.cityData.push(_obj);
    });
  }

  // 设置区域
  setAreaFunc() {
    const { citySubs } = this.addressData;
    citySubs.forEach((item: ProvCityType) => {
      const { adcode, name } = item;
      const _obj:ProvType = { adcode, name };
      this.areaData.push(_obj);
    });
  }

  // 省份切换选择
  provChange(event: string) {
    // 省份切换，清空城市，区域数组
    this.cityData = [];
    this.areaData = [];
    this.addressData.provinceSubs = [];
    this.addressData.citySubs = [];

    this.provCity.forEach((item: ProvCityType) => {
      const { adcode, name, subs } = item;
      if (name === event) {
        this.addressData.provinceSubs = subs;
        // 通知父组件
        this.$emit('success-call', { type: 'prov', id: Number(adcode), value: name });
      }
    });
    this.setCityFunc();
  }

  // 城市展开
  cityVisible(bool: boolean) {
    // 判断省份是否选中
    if (bool) {
      const { provinceName } = this.$props.dataConfig;
      if (!provinceName) {
        this.$message({
          type: 'warning',
          message: '请先选中省份!'
        });
      }
    }
  }

  // 城市切换选择
  cityChange(event: string) {
    // 城市切换，区域数组
    this.areaData = [];
    this.addressData.citySubs = [];

    const { provinceSubs } = this.addressData;
    provinceSubs.forEach((item: ProvCityType) => {
      const { adcode, name, subs } = item;
      if (name === event) {
        this.addressData.citySubs = subs;
        // 通知父组件
        this.$emit('success-call', { type: 'city', id: Number(adcode), value: name });
      }
    });
    this.setAreaFunc();
  }

  // 区域展开
  areaVisible(bool: boolean) {
    // 判断省份是否选中
    if (bool) {
      const { cityName } = this.$props.dataConfig;
      if (!cityName) {
        this.$message({
          type: 'warning',
          message: '请先选中城市!'
        });
      }
    }
  }

  // 区域切换选择
  areaChange(event: string) {
    const { citySubs } = this.addressData;
    citySubs.forEach((item: ProvCityType) => {
      const { adcode, name } = item;
      if (name === event) {
        // 通知父组件
        this.$emit('success-call', { type: 'area', id: Number(adcode), value: name });
      }
    });
  }

  mounted() {
    this.setProvFunc();
  }
}
</script>
<style lang="scss" scoped>
.address_container {
  margin-bottom: 20px;
}
</style>

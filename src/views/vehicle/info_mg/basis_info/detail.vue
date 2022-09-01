<template>
  <el-form
    ref="carForm"
    :model="formData"
    :rules="formRules"
    label-width="130px"
    class="bgc_fff car_form"
  >
    <div class="info_container" v-if="isDetail">
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="车牌号：" class="ctjt_form_item_class">
            <span>{{ formData.licensePlate }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车型：" class="ctjt_form_item_class">
            <span>{{ formData.carStyle }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="是否备案：" class="ctjt_form_item_class">
            <span>{{ formData.bastate }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用部门：" class="ctjt_form_item_class">
            <span>{{ formData.organName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="训练场：" class="ctjt_form_item_class">
            <span>{{ formData.zdxlc }}</span>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="教学组长：" class="ctjt_form_item_class">
            <span>{{ formData.teachingGroupManagerName }}</span>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="使用人：" class="ctjt_form_item_class">
            <span>{{ formData.useperson }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="使用性质：" class="ctjt_form_item_class">
            <span>{{ formData.useKindName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="油卡卡号：" class="ctjt_form_item_class">
            <span>{{ formData.oildcard }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="8"> -->
        <!-- <el-col :span="12">
          <el-form-item label="带教类型：" class="ctjt_form_item_class">
            <span>{{ formData.teachingType }}</span>
          </el-form-item>
        </el-col> -->

        <!--到此位置-->
        <!-- <el-col :span="6">
          <el-form-item label="是否智能教练" class="ctjt_form_item_class"></el-form-item>
        </el-col> -->
      <!-- </el-row> -->
    </div>
    <CtjtCard :prop-data="{ title: '基本信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="车牌颜色"
              class="ctjt_form_item_class"
              prop="clhpzl"
            >
              <el-select
                v-model="formData.clhpzl"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in carLicenceColorList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="车牌号"
              class="ctjt_form_item_class"
              prop="licensePlate"
            >
              <el-input
                v-model="formData.licensePlate"
                placeholder="请输入车牌号"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="原车牌号"
              class="ctjt_form_item_class"
              prop="newOldlicenseplate"
            >
              <el-input
                v-model="formData.newOldlicenseplate"
                placeholder="请输入原车牌"
                :disabled="isDetail"
                maxlength="45"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" class="ctjt_form_item_class" prop="cllb">
              <el-select
                v-model="formData.cllb"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in carModelList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="所属权"
              class="ctjt_form_item_class"
              prop="fixorganid"
            >
              <el-select
                v-model="formData.fixorganid"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in authOrgList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否备案"
              class="ctjt_form_item_class"
              prop="bastate"
            >
              <el-select
                v-model="formData.bastate"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in carBastateList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="车辆类型"
              class="ctjt_form_item_class"
              prop="carkind"
            >
              <el-select
                v-model="formData.carkind"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in carTypeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="使用状态"
              class="ctjt_form_item_class"
              prop="state"
            >
              <el-cascader
                :show-all-levels="false"
                v-model="formData.state"
                :options="useCarStatusList"
                :props="optionProps"
                :disabled="isDetail"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="使用部门"
              class="ctjt_form_item_class"
              prop="organid"
            >
              <el-cascader
                :show-all-levels="false"
                v-model="formData.organid"
                :options="useDepartmentList"
                :props="optionProps"
                @change="organChange"
                :disabled="isDetail || isEdit"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="训练场" class="ctjt_form_item_class">
              <el-select
                v-model="formData.zdxlc"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option-group
                  v-for="group in placeList"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="指定加油站"
              class="ctjt_form_item_class"
              prop="zdjyz"
            >
              <el-select
                v-model="formData.zdjyz"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in petrolDtationList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车点" class="ctjt_form_item_class">
              <el-select
                v-model="formData.tcdd"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option-group
                  v-for="group in stopCarList"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.address"
                    :label="item.address"
                    :value="item.address"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '使用信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="车辆燃料种类" class="ctjt_form_item_class">
              <el-cascader
                :show-all-levels="false"
                v-model="formData.oiltype"
                :options="fuelTypeList"
                :props="optionProps"
                :disabled="isDetail"
                ref="oilCasder"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="油卡卡号"
              class="ctjt_form_item_class"
              prop="oildcard"
            >
              <el-input
                v-model="formData.oildcard"
                type="text"
                placeholder="请输入油卡卡号"
                :disabled="isDetail"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="使用人" class="ctjt_form_item_class">
              <el-input
                v-if="isDetail || isEdit"
                v-model="formData.useperson"
                type="text"
                placeholder="使用人"
                :disabled="isDetail || isEdit"
              />
              <el-select
                v-else
                v-model="formData.getRecordEmpId"
                ref="selectUsePerson"
                filterable
                remote
                :remote-method="queryuserPerson"
                placeholder="请选择使用人，输入姓名查询"
                @change="usePersonChange"
                :loading="userPersonOption.loading"
                :multiple-limit="1"
                :disabled="isDetail || isEdit"
              >
                <el-option
                  v-for="item in userPersonOption.options"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id + ',' + item.label"
                >
                  <span>{{ item.label }} </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用性质" class="ctjt_form_item_class">
              <template v-if="isDetail">
                {{ formData.useKindName }}
              </template>
              <el-cascader
                v-else
                :show-all-levels="false"
                v-model="formData.usePropertiesList"
                :options="usePropertiesList"
                :props="usePropertyOptionProps"
                :disabled="isDetail"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="品牌"
              class="ctjt_form_item_class"
              prop="newClpp"
            >
              <el-select
                v-model="formData.newClpp"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in carBrandList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="车身颜色"
              class="ctjt_form_item_class"
              prop="newTxtcarcolor"
            >
              <el-input
                v-model="formData.newTxtcarcolor"
                type="text"
                placeholder="请输入车身颜色"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="固定资产编号"
              class="ctjt_form_item_class"
              prop="remark"
            >
              <el-input
                v-model="formData.remark"
                type="text"
                placeholder="请输入固定资产编号"
                :disabled="isDetail"
                maxlength="455"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="车辆型号"
              class="ctjt_form_item_class"
              prop="cartype"
            >
              <el-input
                v-model="formData.cartype"
                type="text"
                placeholder="请输入"
                :disabled="isDetail"
                maxlength="95"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="核载人数"
              class="ctjt_form_item_class"
              prop="seattype"
            >
              <el-select
                v-model="formData.seattype"
                placeholder="请选择核载人数"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in seatNumList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂日期" class="ctjt_form_item_class">
              <el-date-picker
                v-model="formData.ccrq"
                align="right"
                type="date"
                placeholder="选择日期"
                :disabled="isDetail"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="购买价格/万元"
              class="ctjt_form_item_class"
              prop="buyprice"
            >
              <el-input
                type="number"
                v-model="formData.buyprice"
                placeholder="请输入购买价格"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机动车档案编号" class="ctjt_form_item_class">
              <el-input
                v-model="formData.newTxtcardjbh"
                type="text"
                placeholder="请输入机动车档案编号"
                :disabled="isDetail"
                maxlength="95"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '登记信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="登记机关"
              class="ctjt_form_item_class"
              prop="newTxtdjjg"
            >
              <el-select
                v-model="formData.newTxtdjjg"
                placeholder="请输入登记机关"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in registerOfficeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="登记日期"
              class="ctjt_form_item_class"
              prop="registerdate"
            >
              <el-date-picker
                v-model="formData.registerdate"
                align="right"
                type="date"
                placeholder="选择日期"
                :disabled="isDetail"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="登记证书发放日期"
              class="ctjt_form_item_class"
              prop="issuedate"
            >
              <el-date-picker
                v-model="formData.issuedate"
                align="right"
                type="date"
                placeholder="选择日期"
                :disabled="isDetail"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="机动车登记证编号"
              class="ctjt_form_item_class"
              prop="issuenumber"
            >
              <el-input
                v-model="formData.issuenumber"
                type="text"
                placeholder="请输入机动车登记编号"
                :disabled="isDetail"
                maxlength="49"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="强制报废日期"
              class="ctjt_form_item_class"
              prop="qzbfdate"
            >
              <el-date-picker
                v-model="formData.qzbfdate"
                align="right"
                type="date"
                placeholder="选择日期"
                :disabled="isDetail || isEdit"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="发动机号"
              class="ctjt_form_item_class"
              prop="enginecode"
            >
              <el-input
                v-model="formData.enginecode"
                type="text"
                placeholder="请输入发动机号"
                :disabled="isDetail"
                maxlength="49"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="发动机型号" class="ctjt_form_item_class">
              <el-input
                v-model="formData.newTxtfdjxh"
                type="text"
                placeholder="请输入发动机型号"
                :disabled="isDetail"
                maxlength="95"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="行驶证|车主名称"
              class="ctjt_form_item_class"
              prop="coid"
            >
              <el-select
                v-model="formData.coid"
                placeholder="请输入驾驶证|车主名称"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in ownersList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="车架号" class="ctjt_form_item_class">
              <el-input
                v-model="formData.framecode"
                type="text"
                placeholder="请输入车架号"
                :disabled="isDetail"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="display: none"></el-form-item>
            <el-form-item
              label="排量"
              class="ctjt_form_item_class"
              prop="newTxtpl1"
            >
              <el-input
                v-model.number="formData.newTxtpl1"
                placeholder="请输入排量"
                :disabled="isDetail"
              >
                <template slot="append">ML</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item style="display: none"></el-form-item>
            <el-form-item
              label="功率"
              class="ctjt_form_item_class"
              prop="newTxtpl2"
            >
              <el-input
                v-model.number="formData.newTxtpl2"
                placeholder="请输入功率"
                :disabled="isDetail"
              >
                <template slot="append">KW</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="display: none"></el-form-item>
            <el-form-item
              label="前轮距"
              class="ctjt_form_item_class"
              prop="newTxtrj1"
            >
              <el-input
                v-model.number="formData.newTxtrj1"
                placeholder="请输入前轮距"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="后轮距"
              class="ctjt_form_item_class"
              prop="newTxtrj2"
            >
              <el-input
                v-model.number="formData.newTxtrj2"
                placeholder="请输入后轮距"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="轮胎数"
              class="ctjt_form_item_class"
              prop="newTxtrtsl"
            >
              <el-input
                v-model.number="formData.newTxtrtsl"
                placeholder="请输入轮胎数"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="规格" class="ctjt_form_item_class">
              <el-input
                v-model="formData.newTxtrtgg"
                type="text"
                placeholder="请输入规格"
                :disabled="isDetail"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="轴距"
              class="ctjt_form_item_class"
              prop="newTxtcj"
            >
              <el-input
                v-model.number="formData.newTxtcj"
                placeholder="请输入轴距"
                :disabled="isDetail"
              >
                <template slot="append">MM</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="外轮廓长"
              class="ctjt_form_item_class"
              prop="newTxtcd"
            >
              <el-input
                v-model.number="formData.newTxtcd"
                placeholder="请输入外轮廓长"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="外轮廓宽"
              class="ctjt_form_item_class"
              prop="newTxtkd"
            >
              <el-input
                v-model.number="formData.newTxtkd"
                placeholder="请输入外轮廓宽"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="外轮廓高"
              class="ctjt_form_item_class"
              prop="newTxtgd"
            >
              <el-input
                v-model.number="formData.newTxtgd"
                placeholder="请输入外轮廓高"
                :disabled="isDetail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否出售" class="ctjt_form_item_class">
              <el-select
                v-model="formData.issale"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in carIsSaleList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="是否报废" class="ctjt_form_item_class">
              <el-select
                v-model="formData.newRecordstate"
                placeholder="请选择"
                :disabled="isDetail"
              >
                <el-option
                  v-for="item in carIsRejectList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <el-row type="flex" justify="center" style="padding-bottom: 30px">
      <el-button
        type="info"
        style="
          color: #909399;
          background-color: transparent;
          border: 1px solid #dcdfe6;
        "
        @click="cancelSubmit"
        >取消</el-button
      >
      <el-button
        type="primary"
        style="margin-left: 32px"
        @click="submit"
        :disabled="isDetail"
        :loading="submitLoading"
        v-if="perm['btn_save']"
        >保存</el-button
      >
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { CtjtCard } from '@/components';
import {
  ParamsType,
  VueComponentParent,
  CasderType,
  SelectOptionDataType,
} from '@/type';

import {
  dataExchange,
  mapDataExChange,
  REG_PRICE,
  REG_FOUR_INTEGER,
  REG_TWO_INTEGER,
  REG_LICENSEPLATE,
  REG_TEN_CHINESE,
} from '@/assets/js/common';

import { CAR_BASTATE, CAR_ISSALE, CAR_INFOISREJECT } from '@/enums';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtCard,
  },
})
export default class VehicleInfoMgBasisInfoDetail extends mixins(
  clearCacheMixins
) {
  @Action('car/queryBaseInformation') private queryBaseInformation!: () => any;

  @Action('car/queryUseRegisterInformation')
  private queryUseRegisterInformation!: () => any;

  @Action('car/getCarBaseInfoDetail') private getCarBaseInfoDetail!: (
    data: any
  ) => any;

  @Action('car/findUserInfo') private findUserInfo!: (data: any) => any;

  @Action('car/saveOrUpdateOneCar') private saveOrUpdateOneCar!: (
    data: any
  ) => any;

  private formData: ParamsType = {
    cbiid: null, // 车辆id
    newOldlicenseplate: '', // 原车牌号00
    licensePlate: '', // 车牌号00
    carStyle: '', // 车型00
    bastate: '', // 车辆状态 是否备案 // 已备案/未备案00
    organName: '', // 片区00
    zdxlc: null, //  训练场//00
    teachingGroupManagerName: '', // 教学组长//00
    useperson: '', // 使用人00
    useKindName: '', // 使用性质名称00
    teachingType: '', // 带教类型//
    oildcard: '', // 油卡卡号00
    // ------分割线 下面是基础信息-------

    clhpzl: null, // 车牌颜色
    //  // 车牌号00
    //  // 原车牌号//00
    cllb: null, // 车型ID 00
    fixorganid: null, // 所属权ID
    fixOrgName: '', // 所属权ID
    // bastate 是否备案 ：已备案/未备案00
    carkindName: '', // 车辆类型00
    carkind: null, // 车辆类型Id
    state: null, // 使用状态
    organid: null, // 使用部门00
    // zdxlc  训练场00
    zdjyz: null, // 加油站00
    tcdd: null, // 停车点00
    // ----- 分割线 下面是使用信息------
    oiltype: null, // 燃油车种类00
    // oildcard: '', // 油卡卡号00
    getRecordEmpId: null, // 使用人ID00 //todo
    usekind: null, // 使用性质00
    usekindlist: null, // 使用性质详细00
    usePropertiesList: null, // 使用性质数组
    newClpp: null, // 品牌00
    newTxtcarcolor: '', // 车身颜色00
    remark: '', // 固定资产编号00
    cartype: '', // 车辆型号00
    seattype: null, // 核载人数//11
    ccrq: '', // 出厂日期00 11
    buyprice: null, // 购买价格00
    newTxtcardjbh: '', // 机动车档案编号00
    // -----分割线 下面是登记信息
    newTxtdjjg: null, // 登记机关
    registerdate: '', // 登记日期00
    issuedate: '', // 证书发放日期00
    issuenumber: '', // 机动车登记编号00
    qzbfdate: '', // 强制报废日期00
    enginecode: '', // 发动机号00
    newTxtfdjxh: '', // 发动机型号00
    coid: null, // 行驶证|车主名称00
    framecode: '', // 车架号00
    newTxtpl1: null, // 排量00
    newTxtpl2: null, // 功率00
    newTxtrj1: null, // 车轮前00
    newTxtrj2: null, // 车轮后00
    newTxtrtsl: null, // 轮胎数00
    newTxtrtgg: '', // 轮胎规格00
    newTxtcj: null, // 轴距00
    newTxtcd: null, // 外轮廓长00
    newTxtkd: null, // 外轮廓宽00
    newTxtgd: null, // 外轮廓高00
    issale: null, // 是否出售0：否 ，1：'是'00
    recordstate: null, // 是否报废 原本数据 todo
    newRecordstate: null, // 是否报废
  };

  private isDetail = true;

  private isEdit = false;

  private submitLoading = false; // 提交loading

  optionProps = {
    checkStrictly: true,
    emitPath: false,
    value: 'id',
    label: 'label',
    children: 'children',
  };

  usePropertyOptionProps = {
    checkStrictly: true,
    emitPath: true,
    value: 'id',
    label: 'label',
    children: 'children',
  };

  /** 使用人搜索下拉配置项 */
  private userPersonOption = {
    options: [],
    loading: false,
  };

  /* 设置下拉框的数据 */
  // 车牌颜色
  // private carLicenceColorList = CAR_LICENSE_COLOR;

  carLicenceColorList: SelectOptionDataType[] = [];

  // 车型
  carModelList: SelectOptionDataType[] = [];

  // 所属权
  authOrgList: SelectOptionDataType[] = [];

  // 是否备案
  private carBastateList = CAR_BASTATE;

  // 车辆类型
  carTypeList: SelectOptionDataType[] = [];

  // 车辆使用状态
  useCarStatusList: CasderType[] = [];

  // 使用部门
  useDepartmentList: CasderType[] = [];

  // 训练场
  placeList: [] = [];

  // 加油站
  petrolDtationList: SelectOptionDataType[] = [];

  // 停车点
  stopCarList: [] = [];

  // 是否出售
  private carIsSaleList = CAR_ISSALE;

  // 是否报废
  private carIsRejectList = CAR_INFOISREJECT;

  /**  使用信息 */
  // 车辆燃油种类
  fuelTypeList: CasderType[] = [];

  // 使用性质
  usePropertiesList: CasderType[] = [];

  // 车辆品牌
  carBrandList: SelectOptionDataType[] = [];

  // 核载人数
  seatNumList: SelectOptionDataType[] = [];

  // 车身颜色
  /** 登记信息 */
  // 登记机关
  registerOfficeList: SelectOptionDataType[] = [];

  // 行驶证|车主名称
  ownersList: SelectOptionDataType[] = [];

  private formRules = {
    // 基础信息
    clhpzl: [{ required: true, message: '请选择车牌颜色', trigger: 'change' }],
    licensePlate: [
      { required: true, message: '请输入车牌号', trigger: 'blur' },
      { pattern: REG_LICENSEPLATE, message: '请输入10位长度以内合法车牌号' },
    ],
    newOldlicenseplate: [
      { pattern: REG_LICENSEPLATE, message: '请输入10位长度以内合法车牌号' },
    ],
    cllb: [{ required: true, message: '请选择车型', trigger: 'change' }],
    fixorganid: [
      { required: true, message: '请选择所属权', trigger: 'change' },
    ],
    bastate: [{ required: true, message: '请选择是否备案', trigger: 'change' }],
    carkind: [{ required: true, message: '请选择车辆类型', trigger: 'change' }],
    state: [{ required: true, message: '请选择使用状态', trigger: 'change' }],
    organid: [{ required: true, message: '请选择使用部门', trigger: 'change' }],
    // 下面是使用信息验证
    newClpp: [{ required: true, message: '请选择品牌', trigger: 'change' }],
    newTxtcarcolor: [
      { required: true, message: '请输入车身颜色', trigger: 'blur' },
      { pattern: REG_TEN_CHINESE, message: '请输入10位长度以内合法中文字符' },
    ],
    remark: [
      { required: true, message: '请输入固定资产编号', trigger: 'blur' },
    ],
    cartype: [
      { required: true, message: '请输入车辆型号', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9]+$/,
        message: '请输入车辆型号',
        trigger: ['change', 'blur'],
      },
    ],
    seattype: [
      { required: true, message: '请选择核载人数', trigger: 'change' },
    ],
    buyprice: [
      {
        pattern: REG_PRICE,
        message: '范围1-999999,可保留两位小数',
      },
    ],
    // 下面是登记信息
    newTxtdjjg: [
      { required: true, message: '请选择登记机关', trigger: 'change' },
    ],
    registerdate: [
      { required: true, message: '请选择登记日期', trigger: 'change' },
    ],
    issuedate: [
      { required: true, message: '请选择登记证书发放日期', trigger: 'change' },
    ],
    issuenumber: [
      { required: true, message: '请输入机动车登记证书编号', trigger: 'blur' },
    ],
    qzbfdate: [
      { required: true, message: '请选择强制报废日期', trigger: 'change' },
    ],
    enginecode: [
      { required: true, message: '请输入发动机号', trigger: 'blur' },
    ],
    coid: [
      { required: true, message: '请选择驾驶证|车主名称', trigger: 'change' },
    ],
    newTxtpl1: [
      // 排量
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    newTxtpl2: [
      // 功率
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    newTxtrj1: [
      // 轮胎（前）
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    newTxtrj2: [
      // 轮胎（后）
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    newTxtrtsl: [
      // 轮胎数
      { pattern: REG_TWO_INTEGER, message: '轮胎数不能大于99' },
    ],
    newTxtcj: [
      // 轴距
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    newTxtcd: [
      // 外轮廓长
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    newTxtkd: [
      // 外轮廓宽
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    newTxtgd: [
      // 外轮廓高
      { pattern: REG_FOUR_INTEGER, message: '输入四位正整数' },
    ],
    oildcard: [
      // 油卡卡号
      {
        pattern: /^[a-zA-Z0-9]+$/,
        message: '格式:英文+数字',
        trigger: 'change',
      },
    ],
  };

  /* 根据车辆id 获取详情信息 */
  async queryDetail() {
    const { id, types } = this.$route.query;
    if (types) {
      if (types === 'add') {
        this.formData.licensePlate = '粤B';
      } else {
        // 编辑的时候特定字段不能更改
        this.isEdit = true;
      }
      this.isDetail = false;
    } else {
      this.isDetail = true;
    }
    if (id) {
      const data = await this.getCarBaseInfoDetail({ carId: id });
      // 根据返回的数据绑定表单
      this._setFormDataFunc(data);
    }
  }

  organChange() {
    this.formData.getRecordEmpId = null;
  }

  // 提交表单前特殊字段处理
  _specialHandleFormData(): ParamsType {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const {
      fixorganid,
      getRecordEmpId,
      useperson,
      usePropertiesList,
      oiltype,
      recordstate,
      newRecordstate,
      zdxlc,
      tcdd,
      ccrq,
      registerdate,
      issuedate,
      qzbfdate,
    } = sendData;
    // 处理所属权 根据id找到对应的key，存进数据库
    const _fixOrgName = this.authOrgList.filter(
      (item) => item.id === fixorganid
    );
    sendData.fixOrgName = _fixOrgName ? _fixOrgName[0].label : null;
    // 处理使用人
    if (this.isEdit) {
      // 编辑的时候
      sendData.usePersonId = getRecordEmpId || null;
    } else {
      const _personArr = getRecordEmpId ? getRecordEmpId.split(',') : null;
      sendData.usePersonId = _personArr ? _personArr[0] : null;
      sendData.getRecordEmpId = _personArr ? _personArr[0] : null;
      sendData.useperson = _personArr ? _personArr[1] : useperson;
    }

    if (typeof usePropertiesList === 'number') {
      const _usePropertiesList = [];
      _usePropertiesList.push(usePropertiesList);
      sendData.usePropertiesList = _usePropertiesList;
    }
    // 处理燃油类型 处理成json
    if (oiltype) {
      let _oiltypeStr = null;
      const result = { isBreak: false, label: '' };
      const _fuelList = JSON.parse(JSON.stringify(this.fuelTypeList));
      this.obtainValueById(_fuelList, oiltype, result);
      const oilObj = { id: oiltype, value: result.label };
      _oiltypeStr = JSON.stringify(oilObj);
      sendData.fueltypeList = _oiltypeStr;
    }
    // 处理车辆是否报废，如果没有更改状态则保留原本的状态值
    if (
      newRecordstate !== 1
      || (newRecordstate === 1 && newRecordstate !== recordstate)
      || (!sendData.recordstate && newRecordstate)
    ) {
      sendData.recordstate = newRecordstate;
    }
    // 处理训练场和停车点
    if (zdxlc === '请选择') {
      sendData.zdxlc = null;
    }
    if (tcdd === '请选择') {
      sendData.tcdd = null;
    }
    // 处理日期
    sendData.ccrq = ccrq ? this.$dayjs(ccrq).format('YYYY-MM-DD') : ''; // 出厂日期
    sendData.registerdate = registerdate
      ? this.$dayjs(registerdate).format('YYYY-MM-DD')
      : ''; // 登记日期
    sendData.issuedate = issuedate
      ? this.$dayjs(issuedate).format('YYYY-MM-DD')
      : ''; // 登记证书发放日期
    sendData.qzbfdate = qzbfdate
      ? this.$dayjs(qzbfdate).format('YYYY-MM-DD')
      : ''; // 强制报废日期
    return sendData;
  }

  obtainValueById(data: [], value: number, obj: any) {
    if (obj.isBreak) return;
    data.forEach((item: any) => {
      const _item = item;
      const _obj = obj;
      if (_item.id === value) {
        _obj.label = _item.label;
      }
      if (item.children) {
        this.obtainValueById(item.children, value, obj);
      }
    });
  }

  /* 提交表单 */
  async submit() {
    (this.$refs.carForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = this._specialHandleFormData();
        this.submitLoading = true;
        const { cbiid } = sendData;
        if (cbiid <= 0) delete sendData.cbiid;
        this.saveOrUpdateOneCar(sendData)
          .then(() => {
            this.$message.success(`${cbiid > 0 ? '修改' : '新增'}成功`);
            this.cancelSubmit();
          })
          .finally(() => {
            this.submitLoading = false;
          });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /**
   * 取消提交
   * 返回上一页
   */
  cancelSubmit() {
    this.clearCache();
    this.$router.push({ path: '/vehicle/info_mg/basis_info' });
  }

  /* 根据拿到的详情数据绑定表单 */
  private _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(param));
    Object.keys(this.formData).forEach((key) => {
      if (key === 'usePropertiesList') {
        // 使用性质
        if (_data[key] && _data[key].length === 1) {
          this.formData[key] = _data.usekind;
        } else {
          this.formData[key] = _data.usekindlist;
        }
      } else if (key === 'zdjyz') {
        // 指定加油站
        this.formData[key] = _data[key] > 0 ? _data[key] : null;
      } else if (key === 'newTxtdjjg') {
        if (_data[key]) {
          this.formData[key] = Number(_data[key]);
        }
      } else {
        this.formData[key] = _data[key];
      }
    });
    if (this.formData.recordstate === 2) {
      this.$set(this.formData, 'newRecordstate', 2);
    } else {
      this.$set(this.formData, 'newRecordstate', 1);
    }
  }

  /** 拿取 carSelectList 数据 */
  async selectDataList() {
    const data = await this.queryBaseInformation();
    this.carLicenceColorList = data.carColor; // 车牌颜色
    this.carModelList = data.carModel;
    this.authOrgList = dataExchange(data.authOrgList, 'organid', 'oragnname');
    this.carTypeList = data.carType;
    this.useCarStatusList = dataExchange(data.useCarStatus, 'id', 'statename');

    this.useDepartmentList = dataExchange(
      data.useDepartment,
      'organid',
      'oragnname'
    );
    this.placeList = mapDataExChange(data.placeList);
    this.petrolDtationList = data.petrolDtation;
    this.stopCarList = mapDataExChange(data.stopCarList);
  }

  /** 拿取carSelect 使用信息和登记信息的数据 */
  async selectUsageAndRegisterList() {
    const data = await this.queryUseRegisterInformation();
    this.fuelTypeList = data.fuelTypeList;
    this.usePropertiesList = dataExchange(data.usePropertiesList, 'id', 'name');
    this.carBrandList = dataExchange(data.carBrandList, 'id', 'name');
    this.seatNumList = data.seatNumList;
    this.registerOfficeList = data.registerOfficeList;
    this.ownersList = data.ownersList;
  }

  usePersonChange() {
    // 当change后输入的下拉框自动清空
    this.userPersonOption.options = [];
    // this.$emit('usePersonChange', $event);
  }

  async queryuserPerson(query: any) {
    let { organid } = this.formData;
    if (!organid) {
      organid = 0;
    }
    if (query) {
      this.userPersonOption.loading = true;
      await this.findUserInfo({
        name: query,
        organId: organid,
      })
        .then((res: any) => {
          this.userPersonOption.options = res;
        })
        .catch((err: any) => {
          this.$message.error(String(err));
        });
      this.userPersonOption.loading = false;
    } else {
      this.userPersonOption.options = [];
    }
  }

  perm = {};

  async activated() {
    this.queryDetail();
    this.selectDataList();
    this.selectUsageAndRegisterList();
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
</script>

<style lang="scss" scoped>
.car_form {
  .el-input {
    width: 223px;
  }
  .info_container {
    margin-bottom: 15px;
    padding: 20px 0 0;
    background-color: #fff;
  }
}
</style>

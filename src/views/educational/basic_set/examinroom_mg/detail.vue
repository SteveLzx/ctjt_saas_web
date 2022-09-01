<template>
  <div class="page">
    <el-row type="flex" justify="space-between" align="center">
      <span style="font-size: 20px">{{$route.query.id ? '编辑' : '新增'}}考场</span>
      <span>
        <el-button v-if="perm['btn_submit']" type="primary" :disabled="isEdit" @click="submit">保存</el-button>
        <el-button type="info" @click="goback()">返回</el-button>
      </span>
    </el-row>
    <el-divider content-position="left"></el-divider>
    <CtjtCard :prop-data="{ title: '基础信息' }">
      <template slot="content">
        <el-form ref="baseFormRef" :model="baseFormData" :rules="baseFormRule" label-width="130px">
          <el-form-item label="考场名称" prop="examPlaceName">
            <el-input class="w_400" v-model="baseFormData.examPlaceName" :disabled="isEdit" maxlength="25" show-word-limit placeholder="请输入考场名称"></el-input>
          </el-form-item>
          <el-form-item label="考场别名" prop="">
            <el-input class="w_400" v-model="baseFormData.examPlaceAlias" :disabled="isEdit" maxlength="25" show-word-limit placeholder="请输入考场别名"></el-input>
          </el-form-item>
          <el-form-item label="考场地址" prop="address">
            <CtjtSelectAddress
              :dataConfig="baseFormData"
              :disabled="isEdit"
              @success-call="addressSuccessFunc"
            ></CtjtSelectAddress>
            <el-input class="w_400" v-model="baseFormData.address" :disabled="isEdit"  maxlength="50" show-word-limit placeholder="请输入考场详情地址"></el-input>
          </el-form-item>
          <el-row type="flex">
            <el-form-item label="是否常用考场" prop="isOftenExamPlace">
              <el-select class="w_300" v-model="baseFormData.isOftenExamPlace" :disabled="isEdit" placeholder="请选择">
                <el-option
                  v-for="item in isOftenExamPlaceOpt"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考场类型" prop="examPlaceType">
              <el-select class="w_300" v-model="baseFormData.examPlaceType" :disabled="isEdit" placeholder="请选择">
                <el-option
                  v-for="item in examPlaceTypeOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="考试科目" prop="examSubjects">
              <el-select class="w_300" v-model="baseFormData.examSubjects" :disabled="isEdit" multiple placeholder="请选择">
                <el-option
                  v-for="item in examSubjectsOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="showCarItem" label="考试车型" prop="examCarType">
              <el-select class="w_300" v-model="baseFormData.examCarType" :disabled="isEdit" multiple placeholder="请选择">
                <el-option
                  v-for="item in examCarTypeOpt"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="全市备案车辆数" prop="cityReferenceCarNum">
              <el-input class="w_300" placeholder="请输入数量" v-model.number="baseFormData.cityReferenceCarNum" :disabled="isEdit">
                <template slot="append">辆</template>
              </el-input>
            </el-form-item>
            <el-form-item label="驾校备案车辆数" prop="drivingSchoolReferenceCarNum">
              <el-input class="w_300" placeholder="请输入数量" v-model.number="baseFormData.drivingSchoolReferenceCarNum" :disabled="isEdit">
                <template slot="append">辆</template>
              </el-input>
            </el-form-item>
          </el-row>
          <el-form-item label="驾校备案车辆占比" prop="">
            <el-input class="w_300" v-model="baseFormData.drivingSchoolReferenceCarPercent" disabled>
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
    </CtjtCard>
    <CtjtCard v-if="baseFormData.examSubjects.includes(1)" :prop-data="{ title: '科目一考试信息' }">
      <template #content>
        <el-collapse v-model="activeNamesOne">
          <el-collapse-item title="展开/收起" name="1">
            <el-form ref="subOneFormRef" :model="subOneFormData" :rules="subOneFormRules" label-width="130px">
              <el-form-item label="日考量" prop="dayNum">
                <el-input class="w_300" v-model.number="subOneFormData.dayNum" :disabled="isEdit">
                  <template slot="append">人</template>
                </el-input>
              </el-form-item>
              <el-form-item label="初考考试费用" prop="examCost">
                <el-input class="w_300" v-model="subOneFormData.examCost" :disabled="isEdit">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="考试方式" prop="examMode">
                <el-select class="w_300" v-model="subOneFormData.examMode" placeholder="请选择" :disabled="isEdit">
                  <el-option
                    v-for="item in examModeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考试时间" prop="examDay">
                <el-checkbox-group v-model="subOneFormData.examDay" :disabled="isEdit">
                  <el-checkbox
                    v-for="(item, index) in examDayOpt"
                    :key="index"
                    :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </template>
    </CtjtCard>
    <CtjtCard v-if="baseFormData.examSubjects.includes(2)" :prop-data="{ title: '科目二考试信息' }">
      <template #content>
        <el-collapse v-model="activeNamesTwo">
          <el-collapse-item title="展开/收起" name="2">
            <el-form ref="subTwoFormRef" :model="subTwoFormData" :rules="subTwoFormRules" label-width="130px">
              <el-form-item label="车型相关信息" prop="carTypeMsg">
                <el-table
                  :data="subTwoFormData.carTypeMsg"
                  border
                  style="width: 100%">
                  <el-table-column prop="carType" label="考试车型"></el-table-column>
                  <el-table-column prop="examRoadNum" label="考道数量(条)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.examRoadNum`"
                            :rules="subTwoFormRules.examRoadNum">
                            <el-input v-model.number="scope.row.examRoadNum" :disabled="isEdit" placeholder="请输入数量"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="examPlaceCarNum" label="考场车辆数(辆)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.examPlaceCarNum`"
                            :rules="subTwoFormRules.examPlaceCarNum">
                            <el-input v-model.number="scope.row.examPlaceCarNum" :disabled="isEdit" placeholder="请输入数量"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="dayNum" label="日考量(人)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.dayNum`"
                            :rules="subTwoFormRules.dayNum">
                            <el-input v-model.number="scope.row.dayNum" :disabled="isEdit" placeholder="请输入数量"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="teachingHours" label="大纲教学学时(小时)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.teachingHours`"
                            :rules="subTwoFormRules.teachingHours">
                            <el-input v-model="scope.row.teachingHours" :disabled="isEdit" placeholder="请输入数量"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="carBrand" label="考试车品牌">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                          :prop="`carTypeMsg.${scope.$index}.carBrand`"
                          :rules="subTwoFormRules.carBrand">
                          {{scope.row.carBrand}}
                        </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                      <el-button :disabled="isEdit" @click="changeCarBrand(scope.$index, scope.row, 2)">请选择车辆品牌</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="初考考试费用" prop="examCost">
                <el-input class="w_300" v-model="subTwoFormData.examCost" :disabled="isEdit">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="考试方式" prop="examMode">
                <el-select class="w_300" v-model="subTwoFormData.examMode" placeholder="请选择" :disabled="isEdit">
                  <el-option
                    v-for="item in examModeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考试时间" prop="examDay">
                <el-checkbox-group v-model="subTwoFormData.examDay" :disabled="isEdit">
                  <el-checkbox
                    v-for="(item, index) in examDayOpt"
                    :key="index"
                    :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </template>
    </CtjtCard>
    <CtjtCard v-if="baseFormData.examSubjects.includes(3)" :prop-data="{ title: '科目三考试信息' }">
      <template #content>
        <el-collapse v-model="activeNamesThree">
          <el-collapse-item title="展开/收起" name="3">
            <el-form ref="subThreeFormRef" :model="subThreeFormData" :rules="subTwoFormRules" label-width="130px">
              <el-form-item label="车型相关信息" prop="carTypeMsg">
                <el-table
                  :data="subThreeFormData.carTypeMsg"
                  border
                  style="width: 100%">
                  <el-table-column prop="carType" label="考试车型"></el-table-column>
                  <el-table-column prop="examRoadNum" label="考道数量(条)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.examRoadNum`"
                            :rules="subTwoFormRules.examRoadNum">
                            <el-input v-model.number="scope.row.examRoadNum" placeholder="请输入数量" :disabled="isEdit"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="examPlaceCarNum" label="考场车辆数(辆)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.examPlaceCarNum`"
                            :rules="subTwoFormRules.examPlaceCarNum">
                            <el-input v-model.number="scope.row.examPlaceCarNum" placeholder="请输入数量" :disabled="isEdit"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="dayNum" label="日考量(人)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.dayNum`"
                            :rules="subTwoFormRules.dayNum">
                            <el-input v-model.number="scope.row.dayNum" placeholder="请输入数量" :disabled="isEdit"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="teachingHours" label="大纲教学学时(小时)">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                            :prop="`carTypeMsg.${scope.$index}.teachingHours`"
                            :rules="subTwoFormRules.teachingHours">
                            <el-input v-model="scope.row.teachingHours" placeholder="请输入数量" :disabled="isEdit"></el-input>
                          </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="carBrand" label="考试车品牌">
                    <template slot-scope="scope">
                      <div class="err_pad_class">
                        <el-form-item
                          :prop="`carTypeMsg.${scope.$index}.carBrand`"
                          :rules="subTwoFormRules.carBrand">
                          {{scope.row.carBrand}}
                        </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                      <el-button :disabled="isEdit" @click="changeCarBrand(scope.$index, scope.row, 2)">请选择车辆品牌</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="初考考试费用" prop="examCost">
                <el-input class="w_300" v-model="subThreeFormData.examCost" :disabled="isEdit">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="考试方式" prop="examMode">
                <el-select class="w_300" v-model="subThreeFormData.examMode" placeholder="请选择" :disabled="isEdit">
                  <el-option
                    v-for="item in examModeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考试时间" prop="examDay">
                <el-checkbox-group v-model="subThreeFormData.examDay" :disabled="isEdit">
                  <el-checkbox
                    v-for="(item, index) in examDayOpt"
                    :key="index"
                    :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </template>
    </CtjtCard>
    <CtjtCard v-if="baseFormData.examSubjects.includes(4)" :prop-data="{ title: '科目三文明考试信息' }">
      <template #content>
        <el-collapse v-model="activeNamesFour">
          <el-collapse-item title="展开/收起" name="4">
            <el-form ref="subFourFormRef" :model="subFourData" :rules="subOneFormRules" label-width="130px">
              <el-form-item label="日考量" prop="dayNum">
                <el-input class="w_300" v-model.number="subFourData.dayNum" :disabled="isEdit">
                  <template slot="append">人</template>
                </el-input>
              </el-form-item>
              <el-form-item label="初考考试费用" prop="examCost">
                <el-input class="w_300" v-model="subFourData.examCost" :disabled="isEdit">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="考试方式" prop="examMode">
                <el-select class="w_300" v-model="subFourData.examMode" placeholder="请选择" :disabled="isEdit">
                  <el-option
                    v-for="item in examModeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考试时间" prop="examDay">
                <el-checkbox-group v-model="subFourData.examDay" :disabled="isEdit">
                  <el-checkbox
                    v-for="(item, index) in examDayOpt"
                    :key="index"
                    :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </template>
    </CtjtCard>
    <!-- 选择车辆品牌 -->
    <el-drawer
      title="选择车辆品牌"
      :visible.sync="drawerName"
      :size="'50%'"
      :direction="'rtl'"
      :before-close="handleClose">
      <div>
        <el-row type="flex" justify="center" style="padding: 10px 0;">
          <el-input class="mr-20" v-model="keywords" placeholder="请输入品牌名称搜索"></el-input><el-button type="primary" @click="searchCarBrand">查询</el-button>
        </el-row>
        <CtjtTable
          ref="tableDataRef"
          :tableData="tableData"
          @select-click="tableSelectionClick"
          @select-all-click="tableSelectionChange"
          @option-call="tableOptionCallback"
        ></CtjtTable>
        <CtjtPagination
          :prop-data="paginationData"
          @on-size-change="tableSizeChange"
          @on-current-change='tableCurrentChange'
        ></CtjtPagination>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class EducationalBasicSetExaminroomMgDetail extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
.err_pad_class {
  padding: 16px 0;
}
</style>

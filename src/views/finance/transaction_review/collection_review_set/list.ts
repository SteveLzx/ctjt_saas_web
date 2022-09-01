import { Vue, Component } from 'vue-property-decorator';
import Collection from './_components/collection.vue';
import StoreCollection from './_components/store_collection.vue';
import PayChanel from './_components/pay_chanel.vue';
import GoodsSale from './_components/goods_sale.vue';

@Component({
  components: {
    Collection,
    StoreCollection,
    PayChanel,
    GoodsSale
  }
})
export default class FinanceCollectionReviewSet extends Vue {
  private componentName = 'Collection';
}

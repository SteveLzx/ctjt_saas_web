import { formatPrice } from '@/assets/js/common';
/* eslint-disable */
export default {
  functional: true,
  name: 'CtjtTableColumn',
  props: ['render', 'align', 'prop', 'label', 'minWidth', 'width', 'fixed', 'sortable', 'columns', 'showOverflowTooltip', 'isPrice' ],
  render(h: any, ctx: any) {
    return h("el-table-column",
      {
        props: {
          prop: ctx.props.prop,
          label: ctx.props.label,
          align: ctx.props.align,
          width: ctx.props.width,
          fixed: ctx.props.fixed,
          sortable: ctx.props.sortable,
          'min-width': ctx.props.minWidth,
          // 'show-overflow-tooltip': ctx.props.showOverflowTooltip
          'show-overflow-tooltip': true
        },
        scopedSlots: {
          default: (scope: any) => {
            if (ctx.props.render) {
              return ctx.props.render(h, scope);
            }
            if (ctx.props.isPrice) {
              return h('p', formatPrice(scope.row[ctx.props.prop]));
            }
            return h("p", scope.row[ctx.props.prop]);
          },
        },
      },
    );
  },
};
/* eslint-enable */

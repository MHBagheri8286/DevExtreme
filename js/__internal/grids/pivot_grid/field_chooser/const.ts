export const ATTRIBUTES = {
  treeViewItem: 'tree-view-item',
  allowScrolling: 'allow-scrolling',
  itemGroup: 'item-group',
} as const;

export const CLASSES = {
  area: {
    self: 'dx-area',
    box: 'dx-area-box',
    caption: 'dx-area-caption',
    icon: 'dx-area-icon',
    field: 'dx-area-field',
    fieldContainer: 'dx-area-field-container',
    fieldContent: 'dx-area-field-content',
    fieldList: 'dx-area-fields',
    fieldListHeader: 'dx-area-fields-header',
  },
  pivotGrid: {
    dragAction: 'dx-pivotgrid-drag-action',
    fieldsContainer: 'dx-pivotgrid-fields-container',
  },
  fieldChooser: {
    self: 'dx-pivotgridfieldchooser',
    container: 'dx-pivotgridfieldchooser-container',
    contextMenu: 'dx-pivotgridfieldchooser-context-menu',
  },
  layout: {
    zero: 'dx-layout-0',
    second: 'dx-layout-2',
  },
  treeView: {
    self: 'dx-treeview',
    borderVisible: 'dx-treeview-border-visible',
  },
  scrollable: {
    self: 'dx-scrollable',
  },
  allFields: 'dx-all-fields',
  col: 'dx-col',
  headerFilter: 'dx-header-filter',
  row: 'dx-row',
  widget: 'dx-widget',
} as const;

export const ICONS = {
  measure: 'measure',
  hierarchy: 'hierarchy',
  dimension: 'dimension',
} as const;

export const SORTABLE_CONST = {
  targets: {
    drag: 'drag',
  },
} as const;

export const SORT_ORDER = {
  descending: 'desc',
  ascending: 'asc',
} as const;
export type SortOrderType = typeof SORT_ORDER[keyof typeof SORT_ORDER];

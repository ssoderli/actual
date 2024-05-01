import React, { type ComponentProps, memo, useState } from 'react';

import { SvgDotsHorizontalTriple } from '../../icons/v1';
import { theme, styles } from '../../style';
import { Button } from '../common/Button';
import { Menu } from '../common/Menu';
import { View } from '../common/View';
import { Tooltip } from '../tooltips';

import { RenderMonths } from './RenderMonths';
import { getScrollbarWidth } from './util';

type BudgetTotalsProps = {
  MonthComponent: ComponentProps<typeof RenderMonths>['component'];
  toggleHiddenCategories: () => void;
  expandAllCategories: () => void;
  collapseAllCategories: () => void;
};

export const BudgetTotals = memo(function BudgetTotals({
  MonthComponent,
  toggleHiddenCategories,
  expandAllCategories,
  collapseAllCategories,
}: BudgetTotalsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  console.log('budget totals')
  console.log(MonthComponent)

  return (
    <View
      data-testid="budget-totals"
      style={{
        backgroundColor: theme.tableBackground,
        flexDirection: 'row',
        flexShrink: 0,
        boxShadow: styles.cardShadow,
        marginLeft: 5,
        marginRight: 5 + getScrollbarWidth(),
        borderRadius: '4px 4px 0 0',
        borderBottom: '1px solid ' + theme.tableBorder,
      }}
    >
      <View
        style={{
          width: 200,
          color: theme.pageTextLight,
          justifyContent: 'center',
          paddingLeft: 15,
          paddingRight: 5,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <View style={{ flexGrow: '1' }}>Category</View>

      </View>
      <RenderMonths component={MonthComponent} />
    </View>
  );
});

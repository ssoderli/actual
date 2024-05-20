// @ts-strict-ignore
import React, { memo, useState } from 'react';

import { rolloverBudget } from 'loot-core/src/client/queries';
import { evalArithmetic } from 'loot-core/src/shared/arithmetic';
import { integerToCurrency, amountToInteger } from 'loot-core/src/shared/util';

import { useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { SvgCheveronDown } from '../../../icons/v1';
import { styles, theme, type CSSProperties } from '../../../style';
import { Button } from '../../common/Button';
import { Menu } from '../../common/Menu';
import { Text } from '../../common/Text';
import { View } from '../../common/View';
import { CellValue } from '../../spreadsheet/CellValue';
import { useFormat } from '../../spreadsheet/useFormat';
import { Row, Field, SheetCell } from '../../table';
import { Tooltip, useTooltip } from '../../tooltips';
import { BalanceWithCarryover } from '../BalanceWithCarryover';
import { makeAmountGrey } from '../util';

import { BalanceTooltip } from './BalanceTooltip';

import { processCategories } from './budgetsummary/Util'


import { useCategories } from '../../../hooks/useCategories';
import { useSheetValue } from '../../spreadsheet/useSheetValue';

const headerLabelStyle: CSSProperties = {
  flex: 1,
  padding: '0 5px',
  textAlign: 'right',
};

export const BudgetTotalsMonth = memo(function BudgetTotalsMonth() {
  const format = useFormat();

   const { grouped: categoryGroups } = useCategories();
   let {incomeIgnore, expenseIgnore} = processCategories(categoryGroups)

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginRight: styles.monthRightPadding,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >

      <View style={headerLabelStyle}>
        <Text style={{ color: theme.tableHeaderText }}>Spent</Text>
        <CellValue
          binding={rolloverBudget.totalSpent}
          formatter={value => {
                                const withoutSavings = value - expenseIgnore
                                const v = format(withoutSavings, 'financial');
                                return withoutSavings > 0 ? '+' + v : withoutSavings === 0 ?  + v : v;
                              }}
          type="financial"
          style={{ color: theme.tableHeaderText, fontWeight: 600 }}
        />
      </View>

    </View>
  );
});

export function IncomeHeaderMonth() {
  return (
    <Row
      style={{
        color: theme.tableHeaderText,
        alignItems: 'center',
        paddingRight: 10,
      }}
    >
      <View style={{ flex: 1, textAlign: 'right' }}>Received</View>
    </Row>
  );
}

type ExpenseGroupMonthProps = {
  group: { id: string };
};
export const ExpenseGroupMonth = memo(function ExpenseGroupMonth({
  group,
}: ExpenseGroupMonthProps) {
  const { id } = group;

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <SheetCell
        name="spent"
        width="flex"
        textAlign="right"
        style={{ fontWeight: 600, ...styles.tnum }}
        valueProps={{
          binding: rolloverBudget.groupSumAmount(id),
          type: 'financial',
        }}
      />

    </View>
  );
});

type ExpenseCategoryMonthProps = {
  monthIndex: number;
  category: { id: string; name: string; is_income: boolean };
  editing: boolean;
  onEdit: (id: string | null, idx?: number) => void;
  onBudgetAction: (idx: number, action: string, arg?: unknown) => void;
  onShowActivity: (name: string, id: string, idx: number) => void;
};
export const ExpenseCategoryMonth = memo(function ExpenseCategoryMonth({
  monthIndex,
  category,
  editing,
  onEdit,
  onBudgetAction,
  onShowActivity,
}: ExpenseCategoryMonthProps) {
  const balanceTooltip = useTooltip();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        '& .hover-visible': {
          opacity: 0,
          transition: 'opacity .25s',
        },
        '&:hover .hover-visible': {
          opacity: 1,
        },
      }}
    >




      <Field name="spent" width="flex" style={{ textAlign: 'right' }}>
        <span
          data-testid="category-month-spent"
          onClick={() => onShowActivity(category.name, category.id, monthIndex)}
        >
          <CellValue
            binding={rolloverBudget.catSumAmount(category.id)}
            type="financial"
            getStyle={makeAmountGrey}
            style={{
              cursor: 'pointer',
              ':hover': { textDecoration: 'underline' },
            }}
          />
        </span>
      </Field>

    </View>
  );
});

export function IncomeGroupMonth() {
  return (
    <View style={{ flex: 1 }}>
      <SheetCell
        name="received"
        width="flex"
        textAlign="right"
        style={{
          fontWeight: 600,
          paddingRight: styles.monthRightPadding,
          ...styles.tnum,
        }}
        valueProps={{
          binding: rolloverBudget.groupIncomeReceived,
          type: 'financial',
          privacyFilter: {
            style: {
              paddingRight: styles.monthRightPadding,
            },
          },
        }}
      />
    </View>
  );
}

type IncomeCategoryMonthProps = {
  category: { id: string; name: string };
  isLast: boolean;
  monthIndex: number;
  onShowActivity: (name: string, id: string, idx: number) => void;
};
export function IncomeCategoryMonth({
  category,
  isLast,
  monthIndex,
  onShowActivity,
}: IncomeCategoryMonthProps) {
  return (
    <View style={{ flex: 1 }}>
      <Field
        name="received"
        width="flex"
        style={{
          paddingRight: styles.monthRightPadding,
          textAlign: 'right',
          ...(isLast && { borderBottomWidth: 0 }),
        }}
      >
        <span
          onClick={() => onShowActivity(category.name, category.id, monthIndex)}
        >
          <CellValue
            binding={rolloverBudget.catSumAmount(category.id)}
            type="financial"
            style={{
              cursor: 'pointer',
              ':hover': { textDecoration: 'underline' },
            }}
          />
        </span>
      </Field>
    </View>
  );
}

export { BudgetSummary } from './budgetsummary/BudgetSummary';

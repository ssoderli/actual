import React from 'react';

import { rolloverBudget } from 'loot-core/src/client/queries';

import { styles, type CSSProperties } from '../../../../style';
import { AlignedText } from '../../../common/AlignedText';
import { Block } from '../../../common/Block';
import { HoverTarget } from '../../../common/HoverTarget';
import { View } from '../../../common/View';
import { CellValue } from '../../../spreadsheet/CellValue';
import { useFormat } from '../../../spreadsheet/useFormat';
import { Tooltip } from '../../../tooltips';
import { useCategories } from '../../../../hooks/useCategories';
import { useSheetValue } from '../../../spreadsheet/useSheetValue';
import { processCategories } from './Util'

type TotalsListProps = {
  prevMonthName: string;
  style?: CSSProperties;
};
export function TotalsList({ prevMonthName, style }: TotalsListProps) {
  const format = useFormat();

  const { grouped: categoryGroups } = useCategories();
  let {incomeIgnore, expenseIgnore} = processCategories(categoryGroups)

  return (
    <View
      style={{
        flexDirection: 'row',
        lineHeight: 1.5,
        justifyContent: 'center',
        ...styles.smallText,
        ...style,
      }}
    >
      <View
        style={{
          textAlign: 'right',
          marginRight: 10,
          minWidth: 50,
        }}
      >

        <CellValue
               binding={rolloverBudget.totalIncome}
               type="financial"
               formatter={value => {
                 const n = (parseInt(value) || 0) - incomeIgnore;
                 const v = format(Math.abs(n), 'financial');
                 return n >= 0 ? v : '+' + v;
               }}
               style={{ fontWeight: 600, ...styles.tnum }}

          />

        <CellValue
          binding={rolloverBudget.totalSpent}
          type="financial"
          formatter={value => {
            const withoutSavings = value - expenseIgnore
            const v = format(withoutSavings, 'financial');
            return withoutSavings > 0 ? '+' + v : withoutSavings === 0 ?  + v : v;
          }}
          style={{ fontWeight: 600, ...styles.tnum }}
        />

      </View>

      <View>
        <Block>Income</Block>
        <Block>Spent</Block>
      </View>
    </View>
  );
}

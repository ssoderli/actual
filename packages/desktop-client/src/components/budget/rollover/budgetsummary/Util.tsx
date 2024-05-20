
import React, { useState, useMemo, type ComponentPropsWithoutRef } from 'react';
import { useLiveQuery } from 'loot-core/src/client/query-hooks';
import { q } from 'loot-core/src/shared/query';

import { useSheetValue } from '../../../spreadsheet/useSheetValue';
import { rolloverBudget } from 'loot-core/src/client/queries';

var cnt = 0
var cachedIgnored
function getIgnoredValues(categories) {
    let qq = () => q('notes').select(`*`)
    let notes = useLiveQuery(qq, []) ?? []
    cachedIgnored = notes?.filter((n) => n?.note?.includes(`(ignore)`))?.map((n) => n.id)
  return cachedIgnored
}


interface Category {
    id: string;
    name: string;
    is_income: number;
    cat_group: string;
    sort_order: number;
    tombstone: number;
    hidden: number;
    goal_def: any;
}

interface CategoryGroup {
    id: string;
    name: string;
    is_income: number;
    sort_order: number;
    tombstone: number;
    hidden: number;
    categories: Category[];
}

export function processCategories(categoryGroups: CategoryGroup[]) {
    let incomeSum = [];
    let expenseSum = [];

    let ignored =  getIgnoredValues(categoryGroups)


    categoryGroups.forEach(group => {

        if (ignored?.includes(group?.id)) {
            // Process all category IDs in the group
            group.categories.forEach(category => {
                if (group.is_income === 1) {
                    incomeSum.push(category.id);
                } else {
                    expenseSum.push(category.id);
                }
            });
        } else {
            // Process only ignored category IDs
            group.categories.forEach(category => {
                if (ignored?.includes(category?.id)) {
                    if (group.is_income === 1) {
                        incomeSum.push(category.id);
                    } else {
                        expenseSum.push(category?.id);
                    }
                }
            });
        }
    });

    let {inc, exp} = getIgnoreValues(categoryGroups, incomeSum, expenseSum)

    return { incomeIgnore: inc, expenseIgnore: exp };
}

function getIgnoreValues(categoryGroups, incomeIgnore, expenseIgnore ) {

  let incomeIgnoreSum = 0
  let expenseIgnoreSum = 0

  categoryGroups.forEach(group => {
    group.categories.forEach(category => {
       const value = useSheetValue({
               name: rolloverBudget.catSumAmount(category.id),
               value: 0,
       });

       if (expenseIgnore.includes(group.id) || expenseIgnore.includes(category.id)) {
        const valueParsed = parseInt(value);
        const valueNum = isNaN(valueParsed) ? 0 : valueParsed;
        expenseIgnoreSum += valueNum
       } else if (incomeIgnore.includes(group.id) || incomeIgnore.includes(category.id)) {
        const valueParsed = parseInt(value);
        const valueNum = isNaN(valueParsed) ? 0 : valueParsed;
        incomeIgnoreSum += valueNum
       }
    });
  });
  return  {inc: incomeIgnoreSum, exp: expenseIgnoreSum}
}

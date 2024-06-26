import React from 'react';

import { useReports } from 'loot-core/src/client/data-hooks/reports';

import { useAccounts } from '../../hooks/useAccounts';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { styles } from '../../style';
import { AnchorLink } from '../common/AnchorLink';
import { Button } from '../common/Button';
import { Text } from '../common/Text';
import { View } from '../common/View';

import { CashFlowCard } from './reports/CashFlowCard';
import { CustomReportListCards } from './reports/CustomReportListCards';
import { NetWorthCard } from './reports/NetWorthCard';
import { SankeyCard } from './reports/SankeyCard';

export function Overview() {
  const customReports = useReports();
  const sankeyFeatureFlag = useFeatureFlag('sankeyReport');

  // const customReportsFeatureFlag = useFeatureFlag('customReports');
  const customReportsFeatureFlag = true

  const accounts = useAccounts();
  return (
    <View
      style={{
        ...styles.page,
        ...{ paddingLeft: 40, paddingRight: 40, minWidth: 700 },
      }}
    >
      {customReportsFeatureFlag && (
        <View
          style={{
            flex: '0 0 auto',
            alignItems: 'flex-end',
            marginRight: 15,
            marginTop: 10,
          }}
        >
          <AnchorLink to="/reports/custom" style={{ textDecoration: 'none' }}>
            <Button type="primary">
              <Text>Create new custom report</Text>
            </Button>
          </AnchorLink>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          flex: '0 0 auto',
        }}
      >
        <NetWorthCard accounts={accounts} />
        <CashFlowCard />
      </View>
      <View
        style={{
          flex: '0 0 auto',
          flexDirection: 'row',
        }}
      >
        {sankeyFeatureFlag && <SankeyCard />}
      </View>
      {customReportsFeatureFlag && (
        <CustomReportListCards reports={customReports} />
      )}
    </View>
  );
}

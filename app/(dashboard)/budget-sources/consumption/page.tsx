'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Calendar, DollarSign, Filter, Search } from 'lucide-react';

// Mock data for consumption records
const mockConsumptionRecords = [
  {
    koxId: 'KOX001-001',
    kox: '李oxege',
    taskId: 'TASK-01234',
    taskPlatform: '微信',
    taskName: '分享产品海报任务',
    rewardEarned: '积分',
    rewardAmount: 100,
    rewardContent: '100积分',
    company: '北京科技有限公司',
    budgetSource: '公司预算',
    rewardDate: '2024-11-21 14:30:00'
  },
  {
    koxId: 'KOX001-002',
    kox: '李oxege',
    taskId: 'TASK-01235',
    taskPlatform: '抖音',
    taskName: '录制产品介绍视频',
    rewardEarned: '优惠券',
    rewardAmount: 50,
    rewardContent: '满减优惠券（满100减20）',
    company: '北京科技有限公司',
    budgetSource: '公司预算',
    rewardDate: '2024-11-21 16:15:00'
  },
  {
    koxId: 'KOX002-001',
    kox: '王oxauh',
    taskId: 'TASK-01236',
    taskPlatform: '微博',
    taskName: '发布产品体验文章',
    rewardEarned: '商品',
    rewardAmount: 200,
    rewardContent: '品牌纪念品套装',
    company: '上海创新公司',
    budgetSource: '项目专项资金',
    rewardDate: '2024-11-22 09:45:00'
  },
  {
    koxId: 'KOX003-001',
    kox: '赵oxnyj',
    taskId: 'TASK-01237',
    taskPlatform: '微信',
    taskName: '参与产品调研问卷',
    rewardEarned: '积分',
    rewardAmount: 50,
    rewardContent: '50积分',
    company: '广州科技有限公司',
    budgetSource: '部门经费',
    rewardDate: '2024-11-22 11:20:00'
  },
  {
    koxId: 'KOX001-003',
    kox: '李oxege',
    taskId: 'TASK-01238',
    taskPlatform: '抖音',
    taskName: '分享用户反馈内容',
    rewardEarned: '积分',
    rewardAmount: 75,
    rewardContent: '75积分',
    company: '北京科技有限公司',
    budgetSource: '公司预算',
    rewardDate: '2024-11-22 13:40:00'
  },
  {
    koxId: 'KOX004-001',
    kox: '孙oxmfk',
    taskId: 'TASK-01239',
    taskPlatform: '微博',
    taskName: '转发官方宣传内容',
    rewardEarned: '优惠券',
    rewardAmount: 25,
    rewardContent: '折扣优惠券（8折优惠）',
    company: '杭州软件公司',
    budgetSource: '合作伙伴赞助',
    rewardDate: '2024-11-23 15:10:00'
  },
  {
    koxId: 'KOX005-001',
    kox: '周oxwqc',
    taskId: 'TASK-01240',
    taskPlatform: '微信',
    taskName: '创建产品使用教程',
    rewardEarned: '积分',
    rewardAmount: 150,
    rewardContent: '150积分',
    company: '深圳数字科技有限公司',
    budgetSource: '活动营销预算',
    rewardDate: '2024-11-23 17:30:00'
  },
  {
    koxId: 'KOX003-002',
    kox: '赵oxnyj',
    taskId: 'TASK-01241',
    taskPlatform: '抖音',
    taskName: '参与限时挑战活动',
    rewardEarned: '商品',
    rewardAmount: 300,
    rewardContent: '限量版品牌手袋',
    company: '广州科技有限公司',
    budgetSource: '部门经费',
    rewardDate: '2024-11-24 10:05:00'
  },
  {
    koxId: 'KOX006-001',
    kox: '钱oxlvh',
    taskId: 'TASK-01242',
    taskPlatform: '微博',
    taskName: '分享品牌文化内容',
    rewardEarned: '积分',
    rewardAmount: 90,
    rewardContent: '90积分',
    company: '北京科技有限公司',
    budgetSource: '公司预算',
    rewardDate: '2024-11-24 12:25:00'
  },
  {
    koxId: 'KOX007-001',
    kox: '吴oxjzr',
    taskId: 'TASK-01243',
    taskPlatform: '微信',
    taskName: '邀请好友参与活动',
    rewardEarned: '优惠券',
    rewardAmount: 30,
    rewardContent: '免邮优惠券',
    company: '上海创新公司',
    budgetSource: '项目专项资金',
    rewardDate: '2024-11-24 14:50:00'
  }
];

export default function BudgetConsumptionPage(): React.ReactElement {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTaskPlatform, setFilterTaskPlatform] = useState('all');
  const [filterRewardEarned, setFilterRewardEarned] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterBudgetSource, setFilterBudgetSource] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filtered records
  const filteredRecords = mockConsumptionRecords.filter(record => {
    const matchesSearch = searchQuery === '' ||
      record.koxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.kox.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.taskName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = filterTaskPlatform === 'all' || record.taskPlatform === filterTaskPlatform;
    const matchesReward = filterRewardEarned === 'all' || record.rewardEarned === filterRewardEarned;
    const matchesCompany = filterCompany === 'all' || record.company === filterCompany;
    const matchesBudget = filterBudgetSource === 'all' || record.budgetSource === filterBudgetSource;

    // Date filtering
    let matchesDate = true;
    if (dateFrom && dateTo) {
      const recordDate = new Date(record.rewardDate);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      matchesDate = recordDate >= fromDate && recordDate <= toDate;
    } else if (dateFrom) {
      const recordDate = new Date(record.rewardDate);
      const fromDate = new Date(dateFrom);
      matchesDate = recordDate >= fromDate;
    } else if (dateTo) {
      const recordDate = new Date(record.rewardDate);
      const toDate = new Date(dateTo);
      matchesDate = recordDate <= toDate;
    }

    return matchesSearch && matchesPlatform && matchesReward && matchesCompany && matchesBudget && matchesDate;
  });

  // Calculate totals
  const totalRewardAmount = filteredRecords.reduce((sum, record) => sum + record.rewardAmount, 0);
  const totalRecords = filteredRecords.length;

  // Calculate reward type distribution
  const rewardTypeCounts = filteredRecords.reduce((acc, record) => {
    acc[record.rewardEarned] = (acc[record.rewardEarned] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">预算来源消耗明细</h1>
          <p className="text-muted-foreground">
            查看预算资源消耗详情和使用记录
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/budget-sources')}>
          返回预算来源
        </Button>
      </div>

      {/* Top Filter Bar */}
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Quick Search */}
            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="搜索KOX-ID、KOX、任务ID或名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 sm:w-64"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={filterTaskPlatform}
                onChange={(e) => setFilterTaskPlatform(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有平台</option>
                <option value="微信">微信</option>
                <option value="抖音">抖音</option>
                <option value="微博">微博</option>
              </select>

              <select
                value={filterRewardEarned}
                onChange={(e) => setFilterRewardEarned(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有奖励</option>
                <option value="积分">积分</option>
                <option value="优惠券">优惠券</option>
                <option value="商品">商品</option>
              </select>

              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有公司</option>
                <option value="北京科技有限公司">北京科技有限公司</option>
                <option value="上海创新公司">上海创新公司</option>
                <option value="广州科技有限公司">广州科技有限公司</option>
                <option value="深圳数字科技有限公司">深圳数字科技有限公司</option>
                <option value="杭州软件公司">杭州软件公司</option>
              </select>

              <select
                value={filterBudgetSource}
                onChange={(e) => setFilterBudgetSource(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有预算来源</option>
                <option value="公司预算">公司预算</option>
                <option value="项目专项资金">项目专项资金</option>
                <option value="活动营销预算">活动营销预算</option>
                <option value="部门经费">部门经费</option>
                <option value="合作伙伴赞助">合作伙伴赞助</option>
              </select>

              {/* Date Range Filters */}
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                日期范围:
              </div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-32 h-8 text-sm"
              />
              <span className="text-sm text-muted-foreground">至</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-32 h-8 text-sm"
              />

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterTaskPlatform('all');
                  setFilterRewardEarned('all');
                  setFilterCompany('all');
                  setFilterBudgetSource('all');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="px-3"
              >
                清空筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">消耗记录总数</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              当前筛选条件下的记录数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">积分发放总量</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredRecords.filter(r => r.rewardEarned === '积分').reduce((sum, r) => sum + r.rewardAmount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              当前筛选条件下的积分总数
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">优惠券发放数量</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardTypeCounts['优惠券'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              当前筛选条件下的优惠券数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">商品发放数量</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardTypeCounts['商品'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              当前筛选条件下的商品数量
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>KOX-ID</TableHead>
                  <TableHead>KOX</TableHead>
                  <TableHead>任务ID</TableHead>
                  <TableHead>任务平台</TableHead>
                  <TableHead>任务名称</TableHead>
                  <TableHead>获得奖励</TableHead>
                  <TableHead className="text-right">奖励内容</TableHead>
                  <TableHead>归属公司</TableHead>
                  <TableHead>预算来源</TableHead>
                  <TableHead>获得奖励日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record, index) => (
                  <TableRow key={`${record.koxId}-${index}`}>
                    <TableCell className="font-mono text-sm">{record.koxId}</TableCell>
                    <TableCell className="font-medium">{record.kox}</TableCell>
                    <TableCell className="font-mono text-sm text-blue-600">{record.taskId}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.taskPlatform === '微信' ? 'bg-green-100 text-green-800' :
                        record.taskPlatform === '抖音' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.taskPlatform}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={record.taskName}>
                        {record.taskName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.rewardEarned === '积分' ? 'bg-yellow-100 text-yellow-800' :
                        record.rewardEarned === '优惠券' ? 'bg-purple-100 text-purple-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {record.rewardEarned}
                      </span>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="truncate" title={record.rewardContent}>
                        {record.rewardContent}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={record.company}>
                        {record.company}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={record.budgetSource}>
                        {record.budgetSource}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {record.rewardDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">暂无数据</h3>
                <p className="text-sm text-muted-foreground">尝试调整筛选条件</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

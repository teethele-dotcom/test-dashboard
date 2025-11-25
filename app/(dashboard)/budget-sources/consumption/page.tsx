'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock budget consumption data
const mockConsumptionData = [
  {
    id: 1,
    koxId: 'KOX-00123',
    kox: '张三',
    taskId: 'TASK-001',
    taskPlatform: '微信',
    taskName: '新品发布会宣传任务',
    reward: 50,
    rewardType: '积分',
    company: 'ABC科技有限公司',
    budgetSource: '市场营销预算',
    rewardDate: '2024-01-15'
  },
  {
    id: 2,
    koxId: 'KOX-00456',
    kox: '李四',
    taskId: 'TASK-002',
    taskPlatform: '抖音',
    taskName: '产品体验反馈收集',
    reward: 100,
    rewardType: '优惠券',
    company: 'XYZ产品公司',
    budgetSource: '活动专项资金',
    rewardDate: '2024-01-14'
  },
  {
    id: 3,
    koxId: 'KOX-00987',
    kox: '王五',
    taskId: 'TASK-003',
    taskPlatform: '微博',
    taskName: '品牌口碑传播',
    reward: 75,
    rewardType: '商品',
    company: '品牌营销有限公司',
    budgetSource: '公司预算',
    rewardDate: '2024-01-13'
  },
  {
    id: 4,
    koxId: 'KOX-00234',
    kox: '赵六',
    taskId: 'TASK-004',
    taskPlatform: '微信',
    taskName: '用户调研问卷',
    reward: 30,
    rewardType: '积分',
    company: '数据分析公司',
    budgetSource: '部门经费',
    rewardDate: '2024-01-12'
  }
];

export default function BudgetConsumptionPage() {
  const router = useRouter();

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    rewardType: 'all',
    company: 'all',
    budgetSource: 'all',
    dateFrom: '',
    dateTo: '',
    koxId: ''
  });

  // Filtered data
  const filteredData = useMemo(() => {
    return mockConsumptionData.filter(item => {
      const searchMatch = !filters.search ||
        item.koxId.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.taskId.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.kox.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.taskName.toLowerCase().includes(filters.search.toLowerCase());

      const platformMatch = filters.platform === 'all' || item.taskPlatform === filters.platform;
      const rewardTypeMatch = filters.rewardType === 'all' || item.rewardType === filters.rewardType;
      const companyMatch = filters.company === 'all' || item.company === filters.company;
      const budgetSourceMatch = filters.budgetSource === 'all' || item.budgetSource === filters.budgetSource;
      const koxIdMatch = !filters.koxId || item.koxId.toLowerCase().includes(filters.koxId.toLowerCase());

      const dateMatch = (!filters.dateFrom || item.rewardDate >= filters.dateFrom) &&
                       (!filters.dateTo || item.rewardDate <= filters.dateTo);

      return searchMatch && platformMatch && rewardTypeMatch && companyMatch && budgetSourceMatch && koxIdMatch && dateMatch;
    });
  }, [filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRecords = filteredData.length;
    const uniqueTasks = new Set(filteredData.map(item => item.taskId)).size;
    const totalPoints = filteredData.filter(item => item.rewardType === '积分').reduce((sum, item) => sum + item.reward, 0);
    const totalCoupons = filteredData.filter(item => item.rewardType === '优惠券').reduce((sum, item) => sum + item.reward, 0);
    const totalProducts = filteredData.filter(item => item.rewardType === '商品').reduce((sum, item) => sum + item.reward, 0);

    return { totalRecords, uniqueTasks, totalPoints, totalCoupons, totalProducts };
  }, [filteredData]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/budget-sources')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回预算来源
        </Button>
        <div>
          <h1 className="text-2xl font-bold">预算消耗明细</h1>
          <p className="text-muted-foreground">查看预算在各个任务中的消耗详情</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">任务数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueTasks}</div>
            <p className="text-xs text-muted-foreground">参与任务数量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">积分发放</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">累计积分奖励</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">优惠券发放</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoupons}</div>
            <p className="text-xs text-muted-foreground">张数</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-7 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">综合搜索</label>
              <Input
                placeholder="搜索 KOX-ID、任务ID、KOX、任务名称"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">任务平台</label>
              <Select value={filters.platform} onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="选择平台" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="微信">微信</SelectItem>
                  <SelectItem value="抖音">抖音</SelectItem>
                  <SelectItem value="微博">微博</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">奖励类型</label>
              <Select value={filters.rewardType} onValueChange={(value) => setFilters(prev => ({ ...prev, rewardType: value }))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="选择奖励类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="积分">积分</SelectItem>
                  <SelectItem value="优惠券">优惠券</SelectItem>
                  <SelectItem value="商品">商品</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">预算来源</label>
              <Select value={filters.budgetSource} onValueChange={(value) => setFilters(prev => ({ ...prev, budgetSource: value }))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="选择预算来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="公司预算">公司预算</SelectItem>
                  <SelectItem value="市场营销预算">市场营销预算</SelectItem>
                  <SelectItem value="活动专项资金">活动专项资金</SelectItem>
                  <SelectItem value="部门经费">部门经费</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">日期范围</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="h-9"
                  placeholder="开始"
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="h-9"
                  placeholder="结束"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">KOX-ID</th>
                  <th className="text-left p-3 font-medium">KOX</th>
                  <th className="text-left p-3 font-medium">任务ID</th>
                  <th className="text-left p-3 font-medium">任务平台</th>
                  <th className="text-left p-3 font-medium">任务名称</th>
                  <th className="text-left p-3 font-medium">奖励类型</th>
                  <th className="text-left p-3 font-medium">奖励内容</th>
                  <th className="text-left p-3 font-medium">归属公司</th>
                  <th className="text-left p-3 font-medium">预算来源</th>
                  <th className="text-left p-3 font-medium">获得奖励日期</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 text-sm font-medium">{item.koxId}</td>
                    <td className="p-3 text-sm">{item.kox}</td>
                    <td className="p-3 text-sm font-mono">{item.taskId}</td>
                    <td className="p-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.taskPlatform === '微信' ? 'bg-green-100 text-green-800' :
                        item.taskPlatform === '抖音' ? 'bg-pink-100 text-pink-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.taskPlatform}
                      </span>
                    </td>
                    <td className="p-3 text-sm max-w-xs truncate" title={item.taskName}>
                      {item.taskName}
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.rewardType === '积分' ? 'bg-yellow-100 text-yellow-800' :
                        item.rewardType === '优惠券' ? 'bg-purple-100 text-purple-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.rewardType}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {item.rewardType === '积分' || item.rewardType === '商品'
                        ? `${item.reward}${item.rewardType === '积分' ? '积分' : '件'}`
                        : `满减${item.reward}元优惠券`}
                    </td>
                    <td className="p-3 text-sm">{item.company}</td>
                    <td className="p-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.budgetSource === '公司预算' ? 'bg-gray-100 text-gray-800' :
                        item.budgetSource === '市场营销预算' ? 'bg-orange-100 text-orange-800' :
                        item.budgetSource === '活动专项资金' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.budgetSource}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {item.rewardDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无匹配的消耗记录</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

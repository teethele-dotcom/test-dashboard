'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Ban, ArrowRight, DollarSign, Plus } from 'lucide-react';

// Mock data for budget sources
const mockBudgetSources = [
  {
    id: 'BUDGET001',
    source: '公司预算',
    company: '北京科技有限公司',
    remainingAmount: 150000.50,
    remainingCoupons: 500,
    remainingProducts: 100,
    status: 'active'
  },
  {
    id: 'BUDGET002',
    source: '项目专项资金',
    company: '上海创新公司',
    remainingAmount: 75000.00,
    remainingCoupons: 250,
    remainingProducts: 50,
    status: 'active'
  },
  {
    id: 'BUDGET003',
    source: '活动营销预算',
    company: '深圳数字科技有限公司',
    remainingAmount: 200000.00,
    remainingCoupons: 800,
    remainingProducts: 150,
    status: 'active'
  },
  {
    id: 'BUDGET004',
    source: '部门经费',
    company: '广州科技有限公司',
    remainingAmount: 50000.00,
    remainingCoupons: 100,
    remainingProducts: 25,
    status: 'inactive'
  },
  {
    id: 'BUDGET005',
    source: '合作伙伴赞助',
    company: '杭州软件公司',
    remainingAmount: 300000.00,
    remainingCoupons: 1000,
    remainingProducts: 200,
    status: 'active'
  }
];

export default function BudgetSourcesPage(): React.ReactElement {
  const [budgetSources, setBudgetSources] = useState(mockBudgetSources);

  const handleDisable = (id: string) => {
    setBudgetSources(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'inactive' } : item
    ));
  };

  const handleEnable = (id: string) => {
    setBudgetSources(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'active' } : item
    ));
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">预算来源管理</h1>
          <p className="text-muted-foreground">
            管理所有预算来源及其相关的优惠券和商品资源
          </p>
        </div>
        <Button>
          <DollarSign className="h-4 w-4 mr-2" />
          新增预算来源
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总预算来源</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetSources.length}</div>
            <p className="text-xs text-muted-foreground">
              个活跃预算来源
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总可用金额</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{budgetSources.reduce((sum, item) => sum + item.remainingAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              剩余可分配金额
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">优惠券总数</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetSources.reduce((sum, item) => sum + item.remainingCoupons, 0)}</div>
            <p className="text-xs text-muted-foreground">
              张可发放优惠券
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">商品总数</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetSources.reduce((sum, item) => sum + item.remainingProducts, 0)}</div>
            <p className="text-xs text-muted-foreground">
              件可发放商品
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>预算来源列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>预算来源ID</TableHead>
                  <TableHead>预算来源</TableHead>
                  <TableHead>归属公司</TableHead>
                  <TableHead className="text-right">剩余可用金额</TableHead>
                  <TableHead className="text-right">优惠券张数</TableHead>
                  <TableHead className="text-right">商品数量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetSources.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.source}</TableCell>
                    <TableCell>{item.company}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/budget-sources/${item.id}?tab=bills`}>
                        <Button
                          variant="link"
                          className="h-auto p-0 font-mono text-blue-600 hover:text-blue-800"
                        >
                          ¥{item.remainingAmount.toLocaleString()}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/budget-sources/${item.id}?tab=coupons`}>
                        <Button
                          variant="link"
                          className="h-auto p-0 font-mono text-blue-600 hover:text-blue-800"
                        >
                          {item.remainingCoupons}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/budget-sources/${item.id}?tab=products`}>
                        <Button
                          variant="link"
                          className="h-auto p-0 font-mono text-blue-600 hover:text-blue-800"
                        >
                          {item.remainingProducts}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status === 'active' ? '活跃' : '已禁用'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/budget-sources/${item.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            查看详情
                          </Button>
                        </Link>
                        {item.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisable(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            禁用
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEnable(item.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            启用
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

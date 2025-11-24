'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Eye, Plus, Ban, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for prepaid bills
const mockPrepaidBills = [
  {
    id: 'BILL001',
    budgetSourceId: 'BUDGET001',
    budgetSource: '公司预算',
    company: '北京科技有限公司',
    payerName: '张三',
    payerAccount: '6222****1234',
    payerBank: '中国银行北京分行',
    payeeName: '任务系统运营',
    payeeAccount: '1234****5678',
    payeeBank: '招商银行北京分行',
    amount: 150000.50,
    amountInWords: '壹拾伍万元伍角',
    purpose: '任务奖励基金',
    remarks: 'Q4季度任务激励预算',
    operator: '李四',
    operationTime: '2024-11-20 14:30:00',
    status: 'completed',
    receiptImage: '/placeholder.svg'
  },
  {
    id: 'BILL002',
    budgetSourceId: 'BUDGET001',
    budgetSource: '公司预算',
    company: '北京科技有限公司',
    payerName: '张三',
    payerAccount: '6222****1234',
    payerBank: '中国银行北京分行',
    payeeName: '任务系统运营',
    payeeAccount: '1234****5678',
    payeeBank: '招商银行北京分行',
    amount: 50000.00,
    amountInWords: '伍万元整',
    purpose: '额外激励资金',
    remarks: '临时增加的奖励预算',
    operator: '王五',
    operationTime: '2024-11-15 10:15:00',
    status: 'completed',
    receiptImage: '/placeholder.svg'
  }
];

// Mock data for coupons
const mockCoupons = [
  {
    id: 'COUPON001',
    name: '满减优惠券',
    distributionQuantity: 1000,
    cumulativeDistribution: 800,
    remainingQuantity: 200,
    status: 'active'
  },
  {
    id: 'COUPON002',
    name: '折扣优惠券',
    distributionQuantity: 500,
    cumulativeDistribution: 300,
    remainingQuantity: 200,
    status: 'active'
  },
  {
    id: 'COUPON003',
    name: '免邮优惠券',
    distributionQuantity: 200,
    cumulativeDistribution: 150,
    remainingQuantity: 50,
    status: 'inactive'
  }
];

// Mock data for products
const mockProducts = [
  {
    id: 'PRODUCT001',
    name: '礼物盒装',
    distributionQuantity: 100,
    cumulativeDistribution: 70,
    remainingQuantity: 30,
    status: 'active'
  },
  {
    id: 'PRODUCT002',
    name: '纪念品T恤',
    distributionQuantity: 200,
    cumulativeDistribution: 120,
    remainingQuantity: 80,
    status: 'active'
  },
  {
    id: 'PRODUCT003',
    name: '品牌手袋',
    distributionQuantity: 50,
    cumulativeDistribution: 30,
    remainingQuantity: 20,
    status: 'active'
  }
];

export default function BudgetSourceDetailPage(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('bills');
  const [prepaidBills] = useState(mockPrepaidBills);
  const [coupons, setCoupons] = useState(mockCoupons);
  const [products, setProducts] = useState(mockProducts);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // Read tab from URL search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['bills', 'coupons', 'products'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Dialog states for coupons
  const [isAddCouponDialogOpen, setIsAddCouponDialogOpen] = useState(false);
  const [isAddQuantityDialogOpen, setIsAddQuantityDialogOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [newCouponName, setNewCouponName] = useState('');
  const [newCouponQuantity, setNewCouponQuantity] = useState('');
  const [addQuantity, setAddQuantity] = useState('');

  // Mock budget source data based on ID
  const budgetSource = {
    id: params.id as string,
    source: '公司预算',
    company: '北京科技有限公司',
    totalAmount: 200000.00,
    remainingAmount: 150000.50,
    remainingCoupons: 450,
    remainingProducts: 130
  };

  const handleAddCouponQuantity = (couponId: string, quantity: number) => {
    setCoupons(prev => prev.map(coupon =>
      coupon.id === couponId
        ? {
            ...coupon,
            distributionQuantity: coupon.distributionQuantity + quantity,
            remainingQuantity: coupon.remainingQuantity + quantity
          }
        : coupon
    ));
  };

  const handleDisableCoupon = (couponId: string) => {
    setCoupons(prev => prev.map(coupon =>
      coupon.id === couponId
        ? { ...coupon, status: 'inactive' }
        : coupon
    ));
  };

  const handleEnableCoupon = (couponId: string) => {
    setCoupons(prev => prev.map(coupon =>
      coupon.id === couponId
        ? { ...coupon, status: 'active' }
        : coupon
    ));
  };

  const handleEnableProduct = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, status: 'active' }
        : product
    ));
  };

  const handleAddNewCoupon = () => {
    if (!newCouponName.trim() || !newCouponQuantity.trim()) return;

    const quantity = parseInt(newCouponQuantity);
    if (isNaN(quantity) || quantity <= 0) return;

    const newCouponId = `COUPON${String(coupons.length + 1).padStart(3, '0')}`;

    const newCoupon = {
      id: newCouponId,
      name: newCouponName.trim(),
      distributionQuantity: quantity,
      cumulativeDistribution: 0,
      remainingQuantity: quantity,
      status: 'active' as const
    };

    setCoupons(prev => [...prev, newCoupon]);

    // Reset form
    setNewCouponName('');
    setNewCouponQuantity('');
    setIsAddCouponDialogOpen(false);
  };

  const handleAddQuantityFromDialog = () => {
    if (!addQuantity.trim()) return;

    const quantity = parseInt(addQuantity);
    if (isNaN(quantity) || quantity <= 0) return;

    handleAddCouponQuantity(selectedCouponId, quantity);

    // Reset form
    setAddQuantity('');
    setSelectedCouponId('');
    setIsAddQuantityDialogOpen(false);
  };

  const handleAddProductQuantity = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? {
            ...product,
            distributionQuantity: product.distributionQuantity + quantity,
            remainingQuantity: product.remainingQuantity + quantity
          }
        : product
    ));
  };

  const handleDisableProduct = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, status: 'inactive' }
        : product
    ));
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/budget-sources')}
        >
          预算来源管理
        </Button>
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">预算来源详情</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{budgetSource.source}</h1>
          <p className="text-muted-foreground">
            预算来源ID: {budgetSource.id} | 归属公司: {budgetSource.company}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          返回列表
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总金额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{budgetSource.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">剩余金额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{budgetSource.remainingAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">优惠券余量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {budgetSource.remainingCoupons}张
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">商品余量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {budgetSource.remainingProducts}件
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bills">预付款单 ({prepaidBills.length})</TabsTrigger>
              <TabsTrigger value="coupons">优惠券 ({coupons.filter(c => c.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="products">商品 ({products.filter(p => p.status === 'active').length})</TabsTrigger>
            </TabsList>

            {/* Prepaid Bills Tab */}
            <TabsContent value="bills" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">预付款单记录</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加预付款单
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>渠道ID</TableHead>
                        <TableHead>预算来源</TableHead>
                        <TableHead>归属公司</TableHead>
                        <TableHead>付款人户名</TableHead>
                        <TableHead>付款人账号</TableHead>
                        <TableHead>付款人开户银行</TableHead>
                        <TableHead>收款人户名</TableHead>
                        <TableHead>收款人账号</TableHead>
                        <TableHead>收款人开户银行</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                        <TableHead>金额（大写）</TableHead>
                        <TableHead>用途</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead>操作人</TableHead>
                        <TableHead>操作时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-center">电子回单图</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prepaidBills.map((bill) => (
                        <TableRow key={bill.id} className="text-xs">
                          <TableCell className="font-medium">{bill.id}</TableCell>
                          <TableCell>{bill.budgetSource}</TableCell>
                          <TableCell>{bill.company}</TableCell>
                          <TableCell>{bill.payerName}</TableCell>
                          <TableCell className="font-mono">{bill.payerAccount}</TableCell>
                          <TableCell>{bill.payerBank}</TableCell>
                          <TableCell>{bill.payeeName}</TableCell>
                          <TableCell className="font-mono">{bill.payeeAccount}</TableCell>
                          <TableCell>{bill.payeeBank}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            ¥{bill.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>{bill.amountInWords}</TableCell>
                          <TableCell>{bill.purpose}</TableCell>
                          <TableCell>{bill.remarks}</TableCell>
                          <TableCell>{bill.operator}</TableCell>
                          <TableCell>{bill.operationTime}</TableCell>
                          <TableCell>
                            <Badge variant={bill.status === 'completed' ? 'default' : 'secondary'}>
                              {bill.status === 'completed' ? '已完成' : '进行中'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedReceiptUrl(bill.receiptImage)}
                                >
                                  <Image className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>电子回单图</DialogTitle>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  <img
                                    src={bill.receiptImage}
                                    alt="电子回单"
                                    className="max-w-full max-h-96 object-contain"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">优惠券管理</h3>
                  <Dialog open={isAddCouponDialogOpen} onOpenChange={setIsAddCouponDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsAddCouponDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        添加优惠券
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>添加新优惠券</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="couponName">优惠券名称</Label>
                          <Input
                            id="couponName"
                            value={newCouponName}
                            onChange={(e) => setNewCouponName(e.target.value)}
                            placeholder="请输入优惠券名称"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="couponQuantity">发放数量</Label>
                          <Input
                            id="couponQuantity"
                            type="number"
                            value={newCouponQuantity}
                            onChange={(e) => setNewCouponQuantity(e.target.value)}
                            placeholder="请输入发放数量"
                            min="1"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddCouponDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleAddNewCoupon}>
                          确定添加
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>优惠券ID</TableHead>
                        <TableHead>优惠券名称</TableHead>
                        <TableHead className="text-right">发放数量</TableHead>
                        <TableHead className="text-right">累计发放数量</TableHead>
                        <TableHead className="text-right">剩余数量</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-medium">{coupon.id}</TableCell>
                          <TableCell>{coupon.name}</TableCell>
                          <TableCell className="text-right font-mono">{coupon.distributionQuantity}</TableCell>
                          <TableCell className="text-right font-mono">{coupon.cumulativeDistribution}</TableCell>
                          <TableCell className="text-right font-mono font-semibold text-blue-600">
                            {coupon.remainingQuantity}
                          </TableCell>
                          <TableCell>
                            <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                              {coupon.status === 'active' ? '活跃' : '已禁用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {coupon.status === 'active' ? (
                                <>
                                  <Dialog open={isAddQuantityDialogOpen} onOpenChange={setIsAddQuantityDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedCouponId(coupon.id);
                                          setIsAddQuantityDialogOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        添加数量
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>添加优惠券数量</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="text-sm text-muted-foreground">
                                          为优惠券 "{coupon.name}" 添加发放数量
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="addQuantity">添加数量</Label>
                                          <Input
                                            id="addQuantity"
                                            type="number"
                                            value={addQuantity}
                                            onChange={(e) => setAddQuantity(e.target.value)}
                                            placeholder="请输入要添加的数量"
                                            min="1"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddQuantityDialogOpen(false)}>
                                          取消
                                        </Button>
                                        <Button onClick={handleAddQuantityFromDialog}>
                                          确定添加
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDisableCoupon(coupon.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    禁用
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEnableCoupon(coupon.id)}
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
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">商品管理</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加商品
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>商品ID</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead className="text-right">发放数量</TableHead>
                        <TableHead className="text-right">累计发放数量</TableHead>
                        <TableHead className="text-right">剩余数量</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="text-right font-mono">{product.distributionQuantity}</TableCell>
                          <TableCell className="text-right font-mono">{product.cumulativeDistribution}</TableCell>
                          <TableCell className="text-right font-mono font-semibold text-purple-600">
                            {product.remainingQuantity}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                              {product.status === 'active' ? '活跃' : '已禁用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {product.status === 'active' ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddProductQuantity(product.id, 20)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    添加数量
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDisableProduct(product.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    禁用
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEnableProduct(product.id)}
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

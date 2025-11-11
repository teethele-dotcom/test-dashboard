'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Repeat2, Flame, Zap, Plus, Trash2, Save, CheckCircle, AlertCircle, Eye, Settings, Play, Pause, Sparkles, Search, Calendar, Clock, Target, Check, X, ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import { AiFillTikTok } from 'react-icons/ai';
import { SiXiaohongshu } from 'react-icons/si';
import { Switch } from '@/components/ui/switch';

interface ExecutionHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  executedAt: string;
  platform: string;
  metric: string;
  currentMetricCount: number;
  expectedAction: string;
  triggeredTaskCreation: boolean;
  createdTaskCount: number;
  createdTaskIds: string[];
  status: 'success' | 'failed' | 'partial';
}

export default function TaskRulesExecutionHistoryPage() {
  const searchParams = useSearchParams();
  const ruleId = searchParams.get('ruleId');

  const [executions, setExecutions] = useState<ExecutionHistory[]>([
    {
      id: 'exec_001',
      ruleId: '82992331',
      ruleName: '热门内容自动评论规则',
      executedAt: '2025-11-11 14:30:25',
      platform: '抖音',
      metric: 'comments',
      currentMetricCount: 25,
      expectedAction: '创建1个一级评论',
      triggeredTaskCreation: true,
      createdTaskCount: 1,
      createdTaskIds: ['task_12345'],
      status: 'success'
    },
    {
      id: 'exec_002',
      ruleId: '82992331',
      ruleName: '热门内容自动评论规则',
      executedAt: '2025-11-11 13:15:10',
      platform: '抖音',
      metric: 'comments',
      currentMetricCount: 15,
      expectedAction: '创建1个一级评论',
      triggeredTaskCreation: true,
      createdTaskCount: 1,
      createdTaskIds: ['task_12344'],
      status: 'success'
    },
    {
      id: 'exec_003',
      ruleId: '82992332',
      ruleName: '评论监控自动回复规则',
      executedAt: '2025-11-11 12:45:33',
      platform: '小红书',
      metric: 'likes',
      currentMetricCount: 8,
      expectedAction: '创建1个楼中楼组',
      triggeredTaskCreation: false,
      createdTaskCount: 0,
      createdTaskIds: [],
      status: 'success'
    },
    {
      id: 'exec_004',
      ruleId: '82992331',
      ruleName: '热门内容自动评论规则',
      executedAt: '2025-11-11 11:20:15',
      platform: '抖音',
      metric: 'comments',
      currentMetricCount: 35,
      expectedAction: '创建1个一级评论',
      triggeredTaskCreation: true,
      createdTaskCount: 1,
      createdTaskIds: ['task_12343'],
      status: 'success'
    },
    {
      id: 'exec_005',
      ruleId: '82992332',
      ruleName: '评论监控自动回复规则',
      executedAt: '2025-11-11 10:10:45',
      platform: '小红书',
      metric: 'likes',
      currentMetricCount: 12,
      expectedAction: '创建1个楼中楼组',
      triggeredTaskCreation: true,
      createdTaskCount: 1,
      createdTaskIds: ['task_12342'],
      status: 'success'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [taskIdFilter, setTaskIdFilter] = useState('');
  const [triggeredOnly, setTriggeredOnly] = useState(false);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  // 根据ruleId过滤执行历史
  const ruleFilteredExecutions = ruleId
    ? executions.filter(execution => execution.ruleId === ruleId)
    : executions;

  // 进一步过滤执行历史
  const filteredExecutions = ruleFilteredExecutions.filter(execution => {
    const matchesSearch = execution.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         execution.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         execution.ruleId.includes(searchQuery);

    const matchesDate = !dateFilter || execution.executedAt.includes(dateFilter);
    const matchesTaskId = !taskIdFilter || execution.createdTaskIds.some(id => id.includes(taskIdFilter));
    const matchesTriggered = !triggeredOnly || execution.triggeredTaskCreation;

    return matchesSearch && matchesDate && matchesTaskId && matchesTriggered;
  });

  // 获取当前规则信息
  const currentRule = ruleId ? executions.find(execution => execution.ruleId === ruleId) : null;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case '抖音':
        return <AiFillTikTok className="w-4 h-4 text-black inline mr-1" />;
      case '小红书':
        return <SiXiaohongshu className="w-4 h-4 text-red-500 inline mr-1" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, triggered: boolean) => {
    if (status === 'success') {
      return triggered ? (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Check className="h-3 w-3 mr-1" />
          执行成功
        </Badge>
      ) : (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          未触发
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <X className="h-3 w-3 mr-1" />
        执行失败
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">

        {/* 页面标题和导航 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/tasks/rules">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回规则列表
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {ruleId ? `${currentRule?.ruleName} - 执行历史` : '任务规则执行历史'}
              </h1>
              <p className="text-gray-600 mt-1">
                {ruleId
                  ? `查看规则 ${currentRule?.ruleId} 的执行记录和任务创建情况`
                  : '查看和管理规则的执行记录和任务创建情况'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总执行次数</p>
                <p className="text-3xl font-bold text-blue-600">{ruleFilteredExecutions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">成功触发</p>
                <p className="text-3xl font-bold text-green-600">{ruleFilteredExecutions.filter(e => e.triggeredTaskCreation).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">创建任务总数</p>
                <p className="text-3xl font-bold text-purple-600">{ruleFilteredExecutions.reduce((sum, e) => sum + e.createdTaskCount, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今日执行</p>
                <p className="text-3xl font-bold text-orange-600">{ruleFilteredExecutions.filter(e => e.executedAt.startsWith('2025-11-11')).length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和过滤栏 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 搜索框 */}
              <div>
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                  搜索规则名称或ID
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="输入规则名称或ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 日期过滤 */}
              <div>
                <Label htmlFor="dateFilter" className="text-sm font-medium text-gray-700 mb-2 block">
                  执行日期
                </Label>
                <Input
                  id="dateFilter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-10 border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* 任务ID过滤 */}
              <div>
                <Label htmlFor="taskIdFilter" className="text-sm font-medium text-gray-700 mb-2 block">
                  创建任务ID
                </Label>
                <Input
                  id="taskIdFilter"
                  placeholder="输入任务ID..."
                  value={taskIdFilter}
                  onChange={(e) => setTaskIdFilter(e.target.value)}
                  className="h-10 border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* 仅显示触发创建任务 */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  过滤选项
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={triggeredOnly}
                    onCheckedChange={setTriggeredOnly}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                  />
                  <span className="text-sm text-gray-600">仅看触发创建任务</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 执行历史表格 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredExecutions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {executions.length === 0 ? '暂无执行历史' : '没有找到匹配的执行记录'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {executions.length === 0
                    ? '规则执行历史将在这里显示'
                    : '尝试调整搜索条件或过滤选项'
                  }
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      执行时间
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      当前监控指标数量
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      当前应生成
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      是否触发创建任务
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建任务个数
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建任务ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExecutions.map((execution, index) => (
                    <tr key={execution.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 font-mono">
                            {formatDateTime(execution.executedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{execution.currentMetricCount}</span>
                          <span className="text-gray-500 ml-1">
                            ({execution.metric === 'comments' && '评论数'}
                             {execution.metric === 'likes' && '点赞数'}
                             {execution.metric === 'shares' && '转发数'}
                             {execution.metric === 'hot' && '热度值'})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {execution.expectedAction.includes('一级评论')
                            ? `${execution.expectedAction.match(/(\d+)/)?.[1] || '1'}个一级评论任务`
                            : execution.expectedAction.includes('楼中楼')
                            ? `${execution.expectedAction.match(/(\d+)/)?.[1] || '1'}个楼中楼评论`
                            : execution.expectedAction
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          execution.triggeredTaskCreation
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {execution.triggeredTaskCreation ? '是' : '否'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {execution.createdTaskCount > 0 ? (
                          <span className="text-sm text-gray-900">
                            {execution.createdTaskCount}个{execution.expectedAction.includes('一级评论') ? '一级评论任务' : '楼中楼任务'}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {execution.createdTaskIds.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 font-mono">
                              {execution.createdTaskIds.join('；')}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(execution.createdTaskIds.join('；'));
                                  setCopiedTaskId(execution.id);
                                  setTimeout(() => setCopiedTaskId(null), 2000);
                                } catch (err) {
                                  console.error('复制失败:', err);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="复制任务ID"
                            >
                              {copiedTaskId === execution.id ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

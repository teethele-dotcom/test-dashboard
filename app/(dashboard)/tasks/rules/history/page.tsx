
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

import { MessageCircle, Heart, Repeat2, Flame, Zap, Plus, Trash2, Save, CheckCircle, AlertCircle, Eye, Settings, Play, Pause, Sparkles, Search, Calendar, Clock, Target, Check, X, ArrowLeft, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { AiFillTikTok } from 'react-icons/ai';
import { SiXiaohongshu } from 'react-icons/si';
import { Switch } from '@/components/ui/switch';

interface ExecutionHistory {
  id: string;
  ruleId: string;
  publicOpinionId: string;
  publicOpinionInfo: {
    title: string;
    url: string;
    platform: string;
  };
  ruleInfo: {
    title: string;
    platform: string;
    action: string;
  };
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

function TaskRulesExecutionHistoryContent() {
  const searchParams = useSearchParams();
  const ruleId = searchParams.get('ruleId');

  const [executions, setExecutions] = useState<ExecutionHistory[]>([
    {
      id: 'exec_001',
      ruleId: '82992331',
      publicOpinionId: 'po_001',
      publicOpinionInfo: {
        title: '这个新产品真的太棒了！大家快来试试看，效果超乎想象！',
        url: 'https://www.douyin.com/video/123456789',
        platform: '抖音'
      },
      ruleInfo: {
        title: '热门内容自动评论规则',
        platform: '抖音',
        action: '评论数每10天创建一条一级评论'
      },
      ruleName: '热门内容自动评论规则',
      executedAt: '2025-11-11 14:30:25',
      platform: '抖音',
      metric: 'comments',
      currentMetricCount: 25,
      expectedAction: '创建3个一级评论',
      triggeredTaskCreation: true,
      createdTaskCount: 15,
      createdTaskIds: ['task_12345', 'task_12346', 'task_12347', 'task_12348', 'task_12349', 'task_12350', 'task_12351', 'task_12352', 'task_12353', 'task_12354', 'task_12355', 'task_12356', 'task_12357', 'task_12358', 'task_12359'],
      status: 'success'
    },
    {
      id: 'exec_002',
      ruleId: '82992331',
      publicOpinionId: 'po_002',
      publicOpinionInfo: {
        title: '分享一下我的使用心得，这个功能真的很实用！',
        url: 'https://www.douyin.com/video/987654321',
        platform: '抖音'
      },
      ruleInfo: {
        title: '热门内容自动评论规则',
        platform: '抖音',
        action: '评论数每10天创建一条一级评论'
      },
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
      publicOpinionId: 'po_003',
      publicOpinionInfo: {
        title: '今天试用了这个新款护肤品，肤感超级好，推荐给大家！',
        url: 'https://www.xiaohongshu.com/discovery/item/abcdef123',
        platform: '小红书'
      },
      ruleInfo: {
        title: '评论监控自动回复规则',
        platform: '小红书',
        action: '点赞数每5天创建一条楼中楼回复'
      },
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
      publicOpinionId: 'po_004',
      publicOpinionInfo: {
        title: '这个教程讲得太详细了，新手也能轻松学会！',
        url: 'https://www.douyin.com/video/456789123',
        platform: '抖音'
      },
      ruleInfo: {
        title: '热门内容自动评论规则',
        platform: '抖音',
        action: '评论数每10天创建一条一级评论'
      },
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
      publicOpinionId: 'po_005',
      publicOpinionInfo: {
        title: '分享我的穿搭心得，希望能给大家一些灵感！',
        url: 'https://www.xiaohongshu.com/discovery/item/xyz789456',
        platform: '小红书'
      },
      ruleInfo: {
        title: '评论监控自动回复规则',
        platform: '小红书',
        action: '点赞数每5天创建一条楼中楼回复'
      },
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
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [triggeredOnly, setTriggeredOnly] = useState(true);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);
  const [copiedPublicOpinionId, setCopiedPublicOpinionId] = useState<string | null>(null);
  const [copiedRuleId, setCopiedRuleId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [copyNotification, setCopyNotification] = useState<{
    show: boolean;
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [taskIdsTooltip, setTaskIdsTooltip] = useState<{
    show: boolean;
    taskIds: string[];
    x: number;
    y: number;
  } | null>(null);
  const [ruleTooltip, setRuleTooltip] = useState<{
    show: boolean;
    ruleId: string;
    x: number;
    y: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [timeRangeMode, setTimeRangeMode] = useState<'today' | '3days' | 'month' | 'custom'>('today');
  const [platformFilter, setPlatformFilter] = useState<'all' | '抖音' | '小红书'>('all');
  const ruleTooltipHideTimer = useRef<NodeJS.Timeout | null>(null);

  // 设置默认今天日期时间
  useEffect(() => {
    if (!startDateFilter && !endDateFilter) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      setStartDateFilter(todayStart.toISOString().slice(0, 16));
      setEndDateFilter(todayEnd.toISOString().slice(0, 16));
    }
  }, []);

  // 当搜索条件改变时重置分页
  useEffect(() => {
    setCurrentPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, startDateFilter, endDateFilter, triggeredOnly, platformFilter]);

  // 点击外部区域关闭浮窗
  useEffect(() => {
    const handleClickOutside = () => {
      setTaskIdsTooltip(null);
    };

    if (taskIdsTooltip?.show) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [taskIdsTooltip?.show]);

  // 根据ruleId过滤执行历史
  const ruleFilteredExecutions = ruleId
    ? executions.filter(execution => execution.ruleId === ruleId)
    : executions;

  // 进一步过滤执行历史
  const filteredExecutions = ruleFilteredExecutions.filter(execution => {
    const matchesSearch = !searchQuery ||
                         execution.ruleId.includes(searchQuery) ||
                         execution.publicOpinionId.includes(searchQuery) ||
                         execution.createdTaskIds.some(taskId => taskId.includes(searchQuery));

    const matchesPlatform = platformFilter === 'all' || execution.platform === platformFilter;

    const executionDate = new Date(execution.executedAt.split(' ')[0]);
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const matchesDateRange = (!startDate || executionDate >= startDate) && (!endDate || executionDate <= endDate);
    const matchesTriggered = !triggeredOnly || execution.triggeredTaskCreation;

    return matchesSearch && matchesPlatform && matchesDateRange && matchesTriggered;
  });

  // 获取当前规则信息
  const currentRule = ruleId ? executions.find(execution => execution.ruleId === ruleId) : null;

  // 分页逻辑
  const totalPages = Math.ceil(filteredExecutions.length / pageSize);
  const paginatedExecutions = filteredExecutions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* 复制成功提示 */}
      {copyNotification?.show && (
        <div
          className="fixed bg-green-100 text-green-700 px-3 py-2 rounded-lg shadow-lg z-[10001] animate-fade-in text-sm font-medium"
          style={{
            left: copyNotification.x + 10,
            top: copyNotification.y - 10
          }}
        >
          <span>{copyNotification.text}</span>
        </div>
      )}

      {/* 任务ID浮窗 */}
      {taskIdsTooltip?.show && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[10002] max-w-xs animate-fade-in"
          style={{
            left: taskIdsTooltip.x + 10,
            top: taskIdsTooltip.y + 10
          }}
        >
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {taskIdsTooltip.taskIds.map((taskId, index) => (
              <button
                key={index}
                className={`px-2 py-1 text-xs font-mono bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-800 border rounded cursor-pointer transition-colors duration-200`}
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await navigator.clipboard.writeText(taskId);
                    setCopyNotification({
                      show: true,
                      text: '已复制',
                      x: e.clientX,
                      y: e.clientY
                    });
                    setTimeout(() => setCopyNotification(null), 2000);
                  } catch (err) {
                    console.error('复制失败:', err);
                    setCopyNotification({
                      show: true,
                      text: '复制失败',
                      x: e.clientX,
                      y: e.clientY
                    });
                    setTimeout(() => setCopyNotification(null), 2000);
                  }
                }}
                title={`点击复制: ${taskId}`}
              >
                {taskId}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 规则浮窗 */}
      {ruleTooltip?.show && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[10003] min-w-[300px] animate-fade-in"
          style={{
            left: ruleTooltip.x + 10,
            top: ruleTooltip.y - 10
          }}
          onMouseEnter={() => {
            // 清空隐藏定时器
            if (ruleTooltipHideTimer.current) {
              clearTimeout(ruleTooltipHideTimer.current);
            }
          }}
          onMouseLeave={() => {
            // 延迟隐藏浮窗
            ruleTooltipHideTimer.current = setTimeout(() => {
              setRuleTooltip(null);
            }, 300);
          }}
        >
          {(() => {
            const execution = executions.find(exec => exec.ruleId === ruleTooltip.ruleId);
            if (!execution) return null;
            return (
              <>
                <div className="flex items-center gap-3 mb-2">
                  {getPlatformIcon(execution.ruleInfo.platform)}
                  <span className="text-sm text-gray-900 flex-1">{execution.ruleInfo.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/tasks/rules/${execution.ruleId}`, '_blank')}
                    className="text-xs px-2 py-1 ml-2 h-auto"
                  >
                    查看详情
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  {execution.ruleInfo.action}
                </div>
              </>
            );
          })()}
        </div>
      )}

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



        {/* 搜索和过滤栏 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-8 relative z-10">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="输入规则ID/舆情ID/任务ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* 平台筛选 + 日期范围过滤和补发任务按钮 */}
              <div className="flex gap-2 items-center">
                <Select value={platformFilter} onValueChange={(value: 'all' | '抖音' | '小红书') => setPlatformFilter(value)}>
                  <SelectTrigger className="w-auto h-10 border-0 bg-transparent hover:bg-gray-50 focus:border-blue-500 px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部平台</SelectItem>
                    <SelectItem value="抖音">抖音</SelectItem>
                    <SelectItem value="小红书">小红书</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeRangeMode} onValueChange={(value: 'today' | '3days' | 'month' | 'custom') => {
                  setTimeRangeMode(value);

                  if (value !== 'custom') {
                    const now = new Date();
                    let startDate: Date;
                    let endDate: Date;

                    switch (value) {
                      case 'today':
                        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                        break;
                      case '3days':
                        startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
                        endDate = now;
                        break;
                      case 'month':
                        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        endDate = now;
                        break;
                      default:
                        return;
                    }

                    setStartDateFilter(startDate.toISOString().slice(0, 16));
                    setEndDateFilter(endDate.toISOString().slice(0, 16));
                  }
                }}>
                  <SelectTrigger className="w-auto h-10 border-0 bg-transparent hover:bg-gray-50 focus:border-blue-500 px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="3days">最近3天</SelectItem>
                    <SelectItem value="month">最近一个月</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>

                {timeRangeMode === 'custom' && (
                  <>
                    <div className="flex-1">
                      <Input
                        id="startDateFilter"
                        type="datetime-local"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="h-10 border-gray-200 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <span className="flex items-center text-gray-400 text-sm">至</span>
                    <div className="flex-1">
                      <Input
                        id="endDateFilter"
                        type="datetime-local"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="h-10 border-gray-200 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </>
                )}

                <Button
                  variant={triggeredOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTriggeredOnly(!triggeredOnly)}
                  className={`h-10 px-4 ${triggeredOnly ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-200 hover:border-blue-500'}`}
                >
                  仅看需补发任务
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 执行历史表格 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-6">
          <div className="overflow-x-auto overflow-y-visible">
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
                      规则ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      舆情ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      巡检时间
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      当前指标数
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      平台
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      任务类型
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      计划生成任务数
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      本次补发任务数
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      补发任务ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedExecutions.map((execution, index) => (
                    <tr key={execution.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="relative inline-block"
                            onMouseEnter={(e) => {
                              // 立即显示浮窗，清空隐藏定时器
                              if (ruleTooltipHideTimer.current) {
                                clearTimeout(ruleTooltipHideTimer.current);
                                ruleTooltipHideTimer.current = null;
                              }
                              setRuleTooltip({
                                show: true,
                                ruleId: execution.ruleId,
                                x: e.clientX,
                                y: e.clientY
                              });
                            }}
                            onMouseLeave={() => {
                              // 延迟隐藏浮窗
                              ruleTooltipHideTimer.current = setTimeout(() => {
                                setRuleTooltip(null);
                              }, 300);
                            }}
                          >
                            <span
                              className="text-sm text-gray-900 font-mono cursor-pointer hover:text-blue-600 transition-colors inline-block"
                            >
                              {execution.ruleId}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 text-gray-400 hover:text-gray-600 p-1 h-5 w-5"
                              title="复制规则ID"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await navigator.clipboard.writeText(execution.ruleId);
                                  setCopiedRuleId(execution.id);
                                  setTimeout(() => setCopiedRuleId(null), 2000);
                                } catch (err) {
                                  console.error('复制失败:', err);
                                }
                              }}
                            >
                              {copiedRuleId === execution.id ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="relative group">
                            <span className="text-sm text-gray-900 font-mono cursor-pointer hover:text-blue-600 transition-colors">
                              {execution.publicOpinionId}
                            </span>
                            <div className="absolute top-0 left-full ml-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[10000] min-w-[350px]">
                              <div className="flex items-center gap-3">
                                {getPlatformIcon(execution.publicOpinionInfo.platform)}
                                <span className="text-sm text-gray-900">{execution.publicOpinionInfo.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(execution.publicOpinionInfo.url);
                                      setCopiedUrl(execution.id);
                                      setTimeout(() => setCopiedUrl(null), 2000);
                                    } catch (err) {
                                      console.error('复制失败:', err);
                                    }
                                  }}
                                  className="text-gray-400 hover:text-gray-600 p-1 h-6 w-6"
                                  title="打开原贴"
                                >
                                  {copiedUrl === execution.id ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(execution.publicOpinionId);
                                setCopiedPublicOpinionId(execution.id);
                                setTimeout(() => setCopiedPublicOpinionId(null), 2000);
                              } catch (err) {
                                console.error('复制失败:', err);
                              }
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 h-6 w-6"
                            title="复制舆情ID"
                          >
                            {copiedPublicOpinionId === execution.id ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 font-mono">
                            {formatDateTime(execution.executedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {execution.currentMetricCount}({execution.metric === 'comments' && '评论数'}
                             {execution.metric === 'likes' && '点赞数'}
                             {execution.metric === 'shares' && '转发数'}
                             {execution.metric === 'hot' && '热度值'})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {getPlatformIcon(execution.platform)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${execution.expectedAction.includes('一级评论') ? 'text-blue-600' : 'text-purple-600'}`}>
                          {execution.expectedAction.includes('一级评论') ? '一级评论' : '楼中楼评论'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {execution.expectedAction.match(/(\d+)/)?.[1] || '1'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {execution.createdTaskCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {execution.createdTaskIds.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {/* 显示前3个任务ID */}
                            {execution.createdTaskIds.slice(0, 3).map((taskId, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span
                                  className="text-sm text-gray-900 font-mono cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-1 py-0.5 rounded transition-colors duration-200"
                                  onClick={async (e: React.MouseEvent) => {
                                    try {
                                      await navigator.clipboard.writeText(taskId);
                                      setCopyNotification({
                                        show: true,
                                        text: '已复制',
                                        x: e.clientX,
                                        y: e.clientY
                                      });
                                      setTimeout(() => setCopyNotification(null), 2000);
                                    } catch (err) {
                                      console.error('复制失败:', err);
                                      setCopyNotification({
                                        show: true,
                                        text: '复制失败',
                                        x: e.clientX,
                                        y: e.clientY
                                      });
                                      setTimeout(() => setCopyNotification(null), 2000);
                                    }
                                  }}
                                  title="点击复制"
                                >
                                  {taskId}
                                </span>
                              </div>
                            ))}
                            {/* 如果超过3个，显示+N按钮 */}
                            {execution.createdTaskIds.length > 3 && (
                              <div className="flex items-center gap-2 mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded font-normal"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTaskIdsTooltip({
                                      show: true,
                                      taskIds: execution.createdTaskIds,
                                      x: e.clientX,
                                      y: e.clientY
                                    });
                                  }}
                                  title="点击查看全部任务ID"
                                >
                                  +{execution.createdTaskIds.length - 3}
                                </Button>
                              </div>
                            )}
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

        {/* 分页控件 */}
        {filteredExecutions.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, filteredExecutions.length)}
                    </span>{' '}
                    条，共 <span className="font-medium">{filteredExecutions.length}</span> 条结果
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="rounded-l-md"
                    >
                      上一页
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="rounded-none"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-r-md"
                    >
                      下一页
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TaskRulesExecutionHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskRulesExecutionHistoryContent />
    </Suspense>
  );
}

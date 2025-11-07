'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Heart, Repeat2, Flame, Zap, Plus, Trash2, Save, CheckCircle, AlertCircle, Eye, Settings, Play, Pause, Sparkles, ArrowLeft, ThumbsUp, Flag, Shield, Trash, Search, TrendingUp, Reply, MessageSquare, Building } from 'lucide-react';

interface TriggerAction {
  id: string;
  type: 'primary_comment' | 'secondary_comment' | 'nested_comment_group' | 'main_like' | 'comment_like' | 'report_main' | 'report_comment' | 'block' | 'delete_main' | 'delete_comment' | 'delete_dropdown' | 'delete_trending';
  count: number; // 执行次数
  frequency?: number; // 执行频率（每N条指标执行一次）
  content?: string; // 评论内容（可选）
}

interface TriggerRule {
  id: string;
  // 基本信息
  name: string;
  // 触发条件
  platform: string; // 阵地
  sentiment: 'positive' | 'negative' | 'neutral'; // 情感倾向
  isMainPost: boolean; // 是否主帖
  mainPostSource: string; // 主帖来源
  publishTimeDays: number; // 发表时间（天内）
  checkFrequencyHours: number; // 巡查频率（小时）
  // 触发设置
  metric: 'comments' | 'likes' | 'shares' | 'hot'; // 监控指标
  triggerInterval: number; // 触发间隔（每N条）
  // 执行动作列表
  actions: TriggerAction[];
  isActive: boolean;
}

export default function NewRulePage() {
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    sentiment: 'neutral' as TriggerRule['sentiment'],
    isMainPost: true,
    mainPostSource: '',
    publishTimeDays: 7,
    checkFrequencyHours: 2,
    metric: 'comments' as TriggerRule['metric'],
    actions: [] as TriggerAction[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const actionsContainerRef = useRef<HTMLDivElement>(null);

  const metrics = [
    { value: 'comments', label: '评论数', icon: MessageCircle, color: 'bg-blue-100 text-blue-800' },
    { value: 'likes', label: '点赞数', icon: Heart, color: 'bg-red-100 text-red-800' },
    { value: 'shares', label: '转发数', icon: Repeat2, color: 'bg-green-100 text-green-800' },
    { value: 'hot', label: '热度值', icon: Flame, color: 'bg-orange-100 text-orange-800' }
  ];

  // 获取当前选中指标的中文名称
  const getCurrentMetricLabel = () => {
    const metric = metrics.find(m => m.value === formData.metric);
    return metric ? metric.label : '指标';
  };

  // 获取动作类型的中文描述
  const getActionTypeDescription = (actionType: TriggerAction['type']) => {
    switch (actionType) {
      case 'primary_comment': return '个一级评论任务';
      case 'secondary_comment': return '个二级评论任务';
      case 'nested_comment_group': return '组楼中楼评论任务';
      case 'main_like': return '个主站点赞任务';
      case 'comment_like': return '个评论点赞任务';
      case 'report_main': return '个投诉主站任务';
      case 'report_comment': return '个投诉评论任务';
      case 'block': return '个屏蔽任务';
      case 'delete_main': return '个删除主站任务';
      case 'delete_comment': return '个删除评论任务';
      case 'delete_dropdown': return '个下拉框词删除任务';
      case 'delete_trending': return '个大家都在搜删除任务';
      default: return '个任务';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = '规则名称不能为空';
    }
    if (!formData.platform) {
      newErrors.platform = '请选择监控阵地';
    }
    if (!formData.metric) {
      newErrors.metric = '请选择监控指标';
    }
    if (formData.actions.length === 0) {
      newErrors.actions = '请至少启用一个执行动作';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newRule: TriggerRule = {
      id: Date.now().toString(),
      name: formData.name,
      platform: formData.platform,
      sentiment: formData.sentiment,
      isMainPost: formData.isMainPost,
      mainPostSource: formData.mainPostSource,
      publishTimeDays: formData.publishTimeDays,
      checkFrequencyHours: formData.checkFrequencyHours,
      metric: formData.metric,
      triggerInterval: 1, // 移除triggerInterval，使用每个动作的frequency
      actions: formData.actions,
      isActive: true
    };

    // 这里应该保存到后端或状态管理
    console.log('New rule created:', newRule);

    // 重定向回规则列表页
    window.location.href = '/tasks/rules';
  };

  const addAction = () => {
    // 获取所有可用的动作类型
    const allActionTypes: TriggerAction['type'][] = [
      'primary_comment',
      'secondary_comment',
      'nested_comment_group',
      'main_like',
      'comment_like',
      'report_main',
      'report_comment',
      'block',
      'delete_main',
      'delete_comment',
      'delete_dropdown',
      'delete_trending'
    ];

    // 获取已使用的动作类型
    const usedTypes = formData.actions.map(action => action.type);

    // 检查是否还有可用的动作类型
    const availableTypes = allActionTypes.filter(type => !usedTypes.includes(type));

    // 如果没有可用的动作类型，停止添加
    if (availableTypes.length === 0) {
      return;
    }

    // 找到第一个未使用的动作类型
    const availableType = availableTypes[0];

    const newAction: TriggerAction = {
      id: Date.now().toString(),
      type: availableType,
      count: 1,
      frequency: 10,
      content: ''
    };
    setFormData({ ...formData, actions: [...formData.actions, newAction] });
  };

  const removeAction = (actionId: string) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter(a => a.id !== actionId)
    });
  };

  const updateAction = (actionId: string, updates: Partial<TriggerAction>) => {
    setFormData({
      ...formData,
      actions: formData.actions.map(a =>
        a.id === actionId ? { ...a, ...updates } : a
      )
    });
  };

  // 使用 Intersection Observer 监听滚动，自动更新选中的动作
  useEffect(() => {
    if (formData.actions.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        // 清除之前的定时器
        if (timeoutId) clearTimeout(timeoutId);

        // 延迟执行，避免滚动过程中的频繁切换
        timeoutId = setTimeout(() => {
          // 找到当前在视口中的动作卡片
          const visibleEntries = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.5);

          if (visibleEntries.length > 0) {
            // 选择最靠上的那个（boundingClientRect.top 最小的）
            const topEntry = visibleEntries.reduce((prev, current) =>
              prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
            );

            const actionId = topEntry.target.id.replace('action-', '');
            setSelectedActionId(actionId);
          }
        }, 100); // 100ms 防抖延迟
      },
      {
        root: actionsContainerRef.current,
        threshold: 0.6, // 单个阈值，避免多阈值导致的频繁触发
        rootMargin: '-20px 0px -20px 0px' // 减小检测区域，避免边界闪烁
      }
    );

    // 观察所有动作卡片
    formData.actions.forEach(action => {
      const element = document.getElementById(`action-${action.id}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [formData.actions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* 页面标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            创建智能触发规则
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            打造您的自动化监控帝国，让数据为您工作
          </p>
        </div>

        {/* 返回按钮 */}
        <div className="mb-8">
          <Link href="/tasks/rules">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回规则列表
            </Button>
          </Link>
        </div>

        {/* 创建规则表单 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">规则配置</h2>
                <p className="text-gray-600">配置您的自动化监控规则</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="p-8">
            {/* 规则名称 */}
            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">规则名称</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    规则名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：微信公众号评论自动回复规则"
                    className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 rounded-lg shadow-sm"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* 左侧：触发规则配置 */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 h-[710px] flex flex-col">
                  <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">触发规则配置</h3>
                      <p className="text-sm text-gray-600">设置监控条件和触发逻辑</p>
                    </div>
                  </div>

                  <div className="space-y-6">

                    {/* 阵地选择 */}
                    <div>
                      <Label htmlFor="platform" className="text-sm font-semibold text-gray-700 mb-3 block">
                        监控阵地 <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.platform}
                        onValueChange={(value: string) => setFormData({ ...formData, platform: value })}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                          <SelectValue placeholder="选择监控阵地" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="微信公众号">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">微</span>
                              </div>
                              微信公众号
                            </div>
                          </SelectItem>
                          <SelectItem value="微博">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">微</span>
                              </div>
                              微博
                            </div>
                          </SelectItem>
                          <SelectItem value="抖音">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">抖</span>
                              </div>
                              抖音
                            </div>
                          </SelectItem>
                          <SelectItem value="快手">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">快</span>
                              </div>
                              快手
                            </div>
                          </SelectItem>
                          <SelectItem value="B站">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">B</span>
                              </div>
                              B站
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.platform && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.platform}
                        </p>
                      )}
                    </div>

                    {/* 监控指标 */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                        监控指标 <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {metrics.map((metric) => {
                          // 禁止选择点赞数、转发数、热度值
                          const isDisabled = ['likes', 'shares', 'hot'].includes(metric.value);
                          return (
                            <button
                              key={metric.value}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => !isDisabled && setFormData({ ...formData, metric: metric.value as TriggerRule['metric'] })}
                              className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                                isDisabled
                                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                                  : formData.metric === metric.value
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {metric.value === 'hot' ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="relative">
                                        <metric.icon className={`h-6 w-6 ${isDisabled ? 'text-gray-400' : 'text-gray-600'} cursor-help`} />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="flex items-center gap-2">
                                        <span className="text-orange-600">🔥</span>
                                        <span className="font-medium">热度值计算公式</span>
                                      </div>
                                      <p className="text-sm mt-1">评论数 + 转发数 + 点赞数</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <metric.icon className={`h-6 w-6 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`} />
                                )}
                                <div className="flex-1">
                                  <p className={`font-medium text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>{metric.label}</p>
                                  <p className={`text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {metric.value === 'comments' && '监控评论变化'}
                                    {metric.value === 'likes' && '监控点赞变化'}
                                    {metric.value === 'shares' && '监控转发变化'}
                                    {metric.value === 'hot' && '监控热度变化'}
                                  </p>

                                </div>
                                {formData.metric === metric.value && (
                                  <div className="ml-auto">
                                    <CheckCircle className="h-5 w-5 text-blue-500" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.metric && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.metric}
                        </p>
                      )}
                    </div>

                    {/* 触发条件 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sentiment" className="text-sm font-semibold text-gray-700 mb-2 block">
                          情感倾向
                        </Label>
                        <Select
                          value={formData.sentiment}
                          onValueChange={(value: TriggerRule['sentiment']) =>
                            setFormData({ ...formData, sentiment: value })
                          }
                        >
                          <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="positive">😊 正面</SelectItem>
                            <SelectItem value="negative">😠 负面</SelectItem>
                            <SelectItem value="neutral">😐 中性</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="isMainPost" className="text-sm font-semibold text-gray-700 mb-2 block">
                          是否主帖
                        </Label>
                        <Select
                          value="true"
                          disabled={true}
                        >
                          <SelectTrigger className="h-10 border-2 border-gray-300 bg-gray-100 rounded-lg cursor-not-allowed">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">✅ 是</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mainPostSource" className="text-sm font-semibold text-gray-700 mb-2 block">
                        主帖来源
                      </Label>
                      <Select
                        value={formData.mainPostSource}
                        onValueChange={(value: string) => setFormData({ ...formData, mainPostSource: value })}
                      >
                        <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                          <SelectValue placeholder="选择主帖来源" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="官方账号">🏢 官方账号</SelectItem>
                          <SelectItem value="用户投稿">👤 用户投稿</SelectItem>
                          <SelectItem value="品牌合作">🤝 品牌合作</SelectItem>
                          <SelectItem value="营销活动">📢 营销活动</SelectItem>
                          <SelectItem value="其他">📄 其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="publishTimeDays" className="text-sm font-semibold text-gray-700 mb-2 block">
                          发表时间范围
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="publishTimeDays"
                            type="number"
                            min="1"
                            max="30"
                            value={formData.publishTimeDays}
                            onChange={(e) => setFormData({ ...formData, publishTimeDays: parseInt(e.target.value) || 7 })}
                            className="h-10 w-16 border-2 border-gray-200 focus:border-blue-500 rounded-lg text-center text-sm font-bold"
                          />
                          <span className="text-sm text-gray-600 font-medium">天内</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">📅 范围：1-30天</p>
                      </div>

                      <div>
                        <Label htmlFor="checkFrequencyHours" className="text-sm font-semibold text-gray-700 mb-2 block">
                          巡查频率
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="checkFrequencyHours"
                            type="number"
                            min="1"
                            max="24"
                            value={formData.checkFrequencyHours}
                            onChange={(e) => setFormData({ ...formData, checkFrequencyHours: parseInt(e.target.value) || 2 })}
                            className="h-10 w-16 border-2 border-gray-200 focus:border-blue-500 rounded-lg text-center text-sm font-bold"
                          />
                          <span className="text-sm text-gray-600 font-medium">小时</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">⏰ 范围：1-24小时</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：执行动作配置 */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-indigo-200/50 h-[710px] flex flex-col shadow-xl backdrop-blur-sm">
                  {/* 头部区域 */}
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          执行动作配置
                        </h3>
                        <p className="text-sm text-gray-600">设置自动化执行的动作序列</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={addAction}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl px-4 py-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加动作
                    </Button>
                  </div>

                  {/* 已配置动作概览 */}
                  {formData.actions.length > 0 && (
                    <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Eye className="h-3 w-3 text-indigo-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">已配置动作概览</h4>
                        <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                          {formData.actions.length} 个动作
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.actions.map((action, index) => (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => {
                              // 滚动到对应的动作卡片
                              setTimeout(() => {
                                const element = document.getElementById(`action-${action.id}`);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }, 100);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 border-indigo-200/40 hover:border-indigo-300/60"
                          >
                            <div className="w-4 h-4 rounded flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
                              <span className="font-bold text-xs text-white">{index + 1}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {action.type === 'primary_comment' && '一级评论'}
                              {action.type === 'secondary_comment' && '二级评论'}
                              {action.type === 'nested_comment_group' && '楼中楼组'}
                              {action.type === 'main_like' && '主站点赞'}
                              {action.type === 'comment_like' && '评论点赞'}
                              {action.type === 'report_main' && '投诉主站'}
                              {action.type === 'report_comment' && '投诉评论'}
                              {action.type === 'block' && '屏蔽'}
                              {action.type === 'delete_main' && '删除主站'}
                              {action.type === 'delete_comment' && '删除评论'}
                              {action.type === 'delete_dropdown' && '下拉框词删除'}
                              {action.type === 'delete_trending' && '大家都在搜删除'}
                              {!action.type && '待配置'}
                            </span>
                            {action.type && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>{action.frequency}</span>
                                <span>/</span>
                                <span>{action.count}</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 动作列表容器 */}
                  <div ref={actionsContainerRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {formData.actions.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                          <Sparkles className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700">还没有配置执行动作</h4>
                        <p className="text-sm text-gray-500 mt-2">点击上方"添加动作"按钮开始配置</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.actions.map((action, index) => (
                          <div
                            key={action.id}
                            id={`action-${action.id}`}
                            className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-300/50 ${
                              selectedActionId === action.id
                                ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 bg-indigo-50/30'
                                : 'border-indigo-200/30'
                            }`}
                          >
                            {/* 动作头部 */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                  <span className="text-white font-bold text-sm">{index + 1}</span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    {action.type === 'primary_comment' && '一级评论'}
                                    {action.type === 'secondary_comment' && '二级评论'}
                                    {action.type === 'nested_comment_group' && '楼中楼组'}
                                    {action.type === 'main_like' && '主站点赞'}
                                    {action.type === 'comment_like' && '评论点赞'}
                                    {action.type === 'report_main' && '投诉主站'}
                                    {action.type === 'report_comment' && '投诉评论'}
                                    {action.type === 'block' && '屏蔽'}
                                    {action.type === 'delete_main' && '删除主站'}
                                    {action.type === 'delete_comment' && '删除评论'}
                                    {action.type === 'delete_dropdown' && '下拉框词删除'}
                                    {action.type === 'delete_trending' && '大家都在搜删除'}
                                    {!action.type && '选择动作类型'}
                                  </h4>
                                  {action.type && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {getCurrentMetricLabel()}每增加 {action.frequency} {formData.metric === 'hot' ? '点' : '个'}时，自动创建 {action.count} {getActionTypeDescription(action.type)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(action.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* 动作类型选择 */}
                            <div className="mb-5">
                              <Label className="text-sm font-medium text-gray-700 mb-3 block">选择动作类型</Label>
                              <Select
                                value={action.type}
                                onValueChange={(value: TriggerAction['type']) =>
                                  updateAction(action.id, { type: value })
                                }
                              >
                                <SelectTrigger className="w-full h-12 border-2 border-indigo-200 focus:border-indigo-500 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                                  <SelectValue placeholder="请选择执行动作类型" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80">
                                  {/* 评论任务 */}
                                  <div className="px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50/50 border-b border-indigo-100">
                                    <MessageCircle className="h-3 w-3 inline mr-2" />
                                    评论任务
                                  </div>
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'primary_comment')) && (
                                    <SelectItem value="primary_comment" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">一级评论</div>
                                            <div className="text-xs text-gray-500">在主贴下发表一级评论</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'secondary_comment')) && (
                                    <SelectItem value="secondary_comment" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Reply className="h-4 w-4 text-green-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">二级评论</div>
                                            <div className="text-xs text-gray-500">回复其他用户的评论</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'nested_comment_group')) && (
                                    <SelectItem value="nested_comment_group" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Building className="h-4 w-4 text-purple-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">楼中楼组</div>
                                            <div className="text-xs text-gray-500">发表一组楼中楼评论（1主3从）</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}

                                  {/* 互动任务 */}
                                  <div className="px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50/50 border-b border-indigo-100 mt-1">
                                    <Heart className="h-3 w-3 inline mr-2" />
                                    互动任务
                                  </div>
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'main_like')) && (
                                    <SelectItem value="main_like" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <ThumbsUp className="h-4 w-4 text-red-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">主站点赞</div>
                                            <div className="text-xs text-gray-500">为主要内容点赞</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'comment_like')) && (
                                    <SelectItem value="comment_like" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <Heart className="h-4 w-4 text-pink-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">评论点赞</div>
                                            <div className="text-xs text-gray-500">为评论内容点赞</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}

                                  {/* 管理任务 */}
                                  <div className="px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50/50 border-b border-indigo-100 mt-1">
                                    <Flag className="h-3 w-3 inline mr-2" />
                                    管理任务
                                  </div>
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'report_main')) && (
                                    <SelectItem value="report_main" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Flag className="h-4 w-4 text-orange-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">投诉主站</div>
                                            <div className="text-xs text-gray-500">投诉违规主站内容</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'report_comment')) && (
                                    <SelectItem value="report_comment" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <MessageCircle className="h-4 w-4 text-yellow-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">投诉评论</div>
                                            <div className="text-xs text-gray-500">投诉违规评论内容</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'block')) && (
                                    <SelectItem value="block" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-gray-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">屏蔽</div>
                                            <div className="text-xs text-gray-500">屏蔽不良内容</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}

                                  {/* 清理任务 */}
                                  <div className="px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50/50 border-b border-indigo-100 mt-1">
                                    <Trash className="h-3 w-3 inline mr-2" />
                                    清理任务
                                  </div>
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'delete_main')) && (
                                    <SelectItem value="delete_main" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <Trash className="h-4 w-4 text-red-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">删除主站</div>
                                            <div className="text-xs text-gray-500">删除违规主贴内容</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'delete_comment')) && (
                                    <SelectItem value="delete_comment" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <MessageCircle className="h-4 w-4 text-red-500" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">删除评论</div>
                                            <div className="text-xs text-gray-500">删除违规评论内容</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'delete_dropdown')) && (
                                    <SelectItem value="delete_dropdown" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Search className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">下拉框词删除</div>
                                            <div className="text-xs text-gray-500">删除搜索下拉框词汇</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                  {(!formData.actions.some(a => a.id !== action.id && a.type === 'delete_trending')) && (
                                    <SelectItem value="delete_trending" className="py-3 px-3 rounded-lg hover:bg-indigo-50/50">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="h-4 w-4 text-orange-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-medium text-gray-900">大家都在搜删除</div>
                                            <div className="text-xs text-gray-500">删除大家都在搜词汇</div>
                                          </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-indigo-600 opacity-0 group-data-[state=checked]:opacity-100" />
                                      </div>
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 执行参数配置 */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">触发频率</Label>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={action.frequency}
                                    onChange={(e) => updateAction(action.id, {
                                      frequency: parseInt(e.target.value) || 1
                                    })}
                                    className="h-10 text-center border-2 border-indigo-200 focus:border-indigo-500 rounded-xl bg-white/50 backdrop-blur-sm pr-8"
                                    placeholder="1"
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium">
                                    次/触发
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">指标每达到N个时执行</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">执行次数</Label>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={action.count}
                                    onChange={(e) => updateAction(action.id, {
                                      count: parseInt(e.target.value) || 1
                                    })}
                                    className="h-10 text-center border-2 border-indigo-200 focus:border-indigo-500 rounded-xl bg-white/50 backdrop-blur-sm pr-8"
                                    placeholder="1"
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium">
                                    次
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">每次执行多少次此动作</p>
                              </div>
                            </div>


                          </div>
                        ))}
                      </div>
                    )}

                    {errors.actions && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <p className="text-sm font-medium text-red-800">{errors.actions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 底部操作按钮 */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 mt-8">
              <Link href="/tasks/rules">
                <Button
                  type="button"
                  variant="outline"
                  className="px-8 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Save className="h-5 w-5 mr-2" />
                创建规则
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

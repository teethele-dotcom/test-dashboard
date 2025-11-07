'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Heart, Repeat2, Flame, Zap, Plus, Trash2, Save, CheckCircle, AlertCircle, Eye, Settings, Play, Pause, Sparkles, ArrowLeft, ThumbsUp, Flag, Shield, Trash, Search, TrendingUp, Reply, MessageSquare, Building } from 'lucide-react';
import { AiFillTikTok } from 'react-icons/ai';
import { SiXiaohongshu } from 'react-icons/si';

interface TriggerAction {
  id: string;
  type: 'primary_comment' | 'secondary_comment' | 'nested_comment_group' | 'main_like' | 'comment_like' | 'report_main' | 'report_comment' | 'block' | 'delete_main' | 'delete_comment' | 'delete_dropdown' | 'delete_trending';
  count: number;
  frequency?: number;
  content?: string;
}

interface TriggerRule {
  id: string;
  name: string;
  platform: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  isMainPost: boolean;
  mainPostSource: string;
  publishTimeDays: number;
  checkFrequencyHours: number;
  metric: 'comments' | 'likes' | 'shares' | 'hot';
  triggerInterval: number;
  actions: TriggerAction[];
  isActive: boolean;
}

export default function NewSimpleRulePage() {
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    sentiment: 'neutral' as TriggerRule['sentiment'],
    isMainPost: true,
    mainPostSource: '',
    publishTimeDays: 7,
    checkFrequencyHours: 2,
    metric: 'comments' as TriggerRule['metric'],
    actions: [{
      id: 'default-action',
      type: 'primary_comment' as TriggerAction['type'],
      count: 1,
      frequency: 10,
      content: ''
    }] as TriggerAction[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [exampleThreshold, setExampleThreshold] = useState<number>(50);
  const [isEditingThreshold, setIsEditingThreshold] = useState<boolean>(false);
  const actionsContainerRef = useRef<HTMLDivElement>(null);

  const metrics = [
    { value: 'comments', label: '评论数', icon: MessageCircle, color: 'bg-blue-100 text-blue-800' },
    { value: 'likes', label: '点赞数', icon: Heart, color: 'bg-red-100 text-red-800' },
    { value: 'shares', label: '转发数', icon: Repeat2, color: 'bg-green-100 text-green-800' },
    { value: 'hot', label: '热度值', icon: Flame, color: 'bg-orange-100 text-orange-800' }
  ];

  const getCurrentMetricLabel = () => {
    const metric = metrics.find(m => m.value === formData.metric);
    return metric ? metric.label : '指标';
  };

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
      triggerInterval: 1,
      actions: formData.actions,
      isActive: true
    };

    console.log('New simple rule created:', newRule);
    window.location.href = '/tasks/rules';
  };

  const addAction = () => {
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

    const usedTypes = formData.actions.map(action => action.type);
    const availableTypes = allActionTypes.filter(type => !usedTypes.includes(type));

    if (availableTypes.length === 0) {
      return;
    }

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

  useEffect(() => {
    if (formData.actions.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          const visibleEntries = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.5);

          if (visibleEntries.length > 0) {
            const topEntry = visibleEntries.reduce((prev, current) =>
              prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
            );

            const actionId = topEntry.target.id.replace('action-', '');
            setSelectedActionId(actionId);
          }
        }, 100);
      },
      {
        root: actionsContainerRef.current,
        threshold: 0.6,
        rootMargin: '-20px 0px -20px 0px'
      }
    );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
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
          <form onSubmit={handleFormSubmit} className="p-8">
            {/* 规则名称 */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">规则名称</h3>
                  </div>
                </div>
                <div className="w-full">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入规则名称"
                    className="h-12 text-lg border-2 border-purple-300 focus:border-purple-500 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 h-[710px] flex flex-col">
                  <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">触发规则配置</h3>
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
                          <SelectItem value="抖音">
                            <div className="flex items-center gap-2">
                              <AiFillTikTok className="w-5 h-5 text-black" />
                              抖音
                            </div>
                          </SelectItem>
                          <SelectItem value="小红书">
                            <div className="flex items-center gap-2">
                              <SiXiaohongshu className="w-5 h-5 text-red-500" />
                              小红书
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
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-blue-200/50 h-[710px] flex flex-col shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-8 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">执行动作配置</h3>
                      <p className="text-sm text-gray-600">设置自动化执行的动作</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    {(() => {
                      const action = formData.actions[0];
                      return (
                        <div className="space-y-6">
                          {/* 动作类型选择 */}
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                              执行动作 <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => updateAction(action.id, { type: 'primary_comment' })}
                                className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                                  action.type === 'primary_comment'
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">一级评论</p>
                                    <p className="text-sm text-gray-600">在主贴下发表一级评论</p>
                                  </div>
                                  {action.type === 'primary_comment' && (
                                    <CheckCircle className="h-5 w-5 text-blue-500" />
                                  )}
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => updateAction(action.id, { type: 'nested_comment_group' })}
                                className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                                  action.type === 'nested_comment_group'
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Building className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">楼中楼组</p>
                                    <p className="text-sm text-gray-600">
                                      发表一组楼中楼评论
                                      <br />
                                      （1主3从）
                                    </p>
                                  </div>
                                  {action.type === 'nested_comment_group' && (
                                    <CheckCircle className="h-5 w-5 text-blue-500" />
                                  )}
                                </div>
                              </button>
                            </div>
                            {errors.actions && (
                              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.actions}
                              </p>
                            )}
                          </div>

                          {/* 执行参数配置 */}
                          {action.type && (
                            <div className="text-left">
                              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                                执行规则
                              </h4>
                              <div className="bg-blue-50/50 rounded-2xl px-8 py-6 border border-blue-200/30 space-y-4">
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
                                  <span>{getCurrentMetricLabel()}每</span>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={action.frequency}
                                    onChange={(e) => updateAction(action.id, {
                                      frequency: parseInt(e.target.value) || 1
                                    })}
                                    className="w-16 h-10 text-center border-2 border-blue-300 focus:border-blue-500 rounded-lg bg-white text-lg font-bold"
                                    placeholder="10"
                                  />
                                  <span>{formData.metric === 'hot' ? '点' : '个'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
                                  <span>自动创建</span>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={action.count}
                                    onChange={(e) => updateAction(action.id, {
                                      count: parseInt(e.target.value) || 1
                                    })}
                                    className="w-16 h-10 text-center border-2 border-blue-300 focus:border-blue-500 rounded-lg bg-white text-lg font-bold"
                                    placeholder="1"
                                  />
                                  <span>{getActionTypeDescription(action.type)}</span>
                                </div>

                                {/* 示例说明 */}
                                <div className="mt-6 pt-6 border-t border-blue-200/30">
                                  <div className="bg-white/70 rounded-xl p-4 border border-blue-200/20">
                                    <div className="flex items-start gap-3">
                                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-xs font-bold">💡</span>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 mb-1">执行示例</p>
                                        <p className="text-sm text-gray-600">
                                          当{formData.metric === 'comments' ? '评论数' : formData.metric === 'likes' ? '点赞数' : formData.metric === 'shares' ? '转发数' : '热度值'}达到
                                          {isEditingThreshold ? (
                                            <Input
                                              type="number"
                                              min="1"
                                              value={exampleThreshold}
                                              onChange={(e) => setExampleThreshold(parseInt(e.target.value) || 1)}
                                              onBlur={() => setIsEditingThreshold(false)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === 'Escape') {
                                                  setIsEditingThreshold(false);
                                                }
                                              }}
                                              className="inline-block w-16 h-6 mx-1 text-center border border-blue-300 focus:border-blue-500 rounded text-sm font-semibold text-blue-600"
                                              autoFocus
                                            />
                                          ) : (
                                            <span
                                              className="inline-block mx-1 px-1 py-0.5 text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 rounded border border-transparent hover:border-blue-200"
                                              onClick={() => setIsEditingThreshold(true)}
                                            >
                                              {exampleThreshold}
                                            </span>
                                          )}
                                          {formData.metric === 'hot' ? '点' : '个'}时，将创建
                                          <span className="font-semibold text-indigo-600 ml-1">
                                            {Math.floor(exampleThreshold / (action.frequency || 10)) * (action.count || 1)}
                                          </span>
                                          {getActionTypeDescription(action.type)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

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
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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

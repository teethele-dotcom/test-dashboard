'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Repeat2, Flame, Zap, Plus, Trash2, Save, CheckCircle, AlertCircle, Eye, Settings, Play, Pause, Sparkles, Search } from 'lucide-react';
import { AiFillTikTok } from 'react-icons/ai';
import { SiXiaohongshu } from 'react-icons/si';
import { Switch } from '@/components/ui/switch';

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
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
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

export default function TaskRulesPage() {
  const [rules, setRules] = useState<TriggerRule[]>([
    {
      id: '82992331',
      name: '热门内容自动评论规则',
      createdBy: '蔡纤',
      createdAt: '2025-11-05 14:29:03',
      updatedBy: '蔡纤',
      updatedAt: '2025-11-05 14:29:03',
      platform: '抖音',
      sentiment: 'positive',
      isMainPost: true,
      mainPostSource: '官方账号',
      publishTimeDays: 7,
      checkFrequencyHours: 2,
      metric: 'comments',
      triggerInterval: 5,
      actions: [
        { id: '1', type: 'primary_comment', count: 1, frequency: 10, content: '' }
      ],
      isActive: true
    },
    {
      id: '82992332',
      name: '评论监控自动回复规则',
      createdBy: '蔡纤',
      createdAt: '2025-11-05 14:30:15',
      updatedBy: '蔡纤',
      updatedAt: '2025-11-05 14:30:15',
      platform: '小红书',
      sentiment: 'neutral',
      isMainPost: false,
      mainPostSource: '用户投稿',
      publishTimeDays: 3,
      checkFrequencyHours: 1,
      metric: 'likes',
      triggerInterval: 10,
      actions: [
        { id: '1', type: 'nested_comment_group', count: 1, frequency: 5, content: '' }
      ],
      isActive: false
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<TriggerRule | null>(null);
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
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const metrics = [
    { value: 'comments', label: '评论数', icon: MessageCircle, color: 'bg-blue-100 text-blue-800' },
    { value: 'likes', label: '点赞数', icon: Heart, color: 'bg-red-100 text-red-800' },
    { value: 'shares', label: '转发数', icon: Repeat2, color: 'bg-green-100 text-green-800' },
    { value: 'hot', label: '热度值', icon: Flame, color: 'bg-orange-100 text-orange-800' }
  ];

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

    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const currentUser = '蔡纤'; // 临时使用固定用户，实际应该从认证系统中获取

    const newRule: TriggerRule = {
      id: editingRule?.id || Date.now().toString(),
      name: formData.name,
      createdBy: editingRule?.createdBy || currentUser,
      createdAt: editingRule?.createdAt || currentTime,
      updatedBy: currentUser,
      updatedAt: currentTime,
      platform: formData.platform,
      sentiment: formData.sentiment,
      isMainPost: formData.isMainPost,
      mainPostSource: formData.mainPostSource,
      publishTimeDays: formData.publishTimeDays,
      checkFrequencyHours: formData.checkFrequencyHours,
      metric: formData.metric,
      triggerInterval: 1, // 移除triggerInterval，使用每个动作的frequency
      actions: formData.actions,
      isActive: editingRule?.isActive ?? true
    };

    if (editingRule) {
      setRules(rules.map(rule => rule.id === editingRule.id ? newRule : rule));
    } else {
      setRules([...rules, newRule]);
    }

    setShowForm(false);
    setEditingRule(null);
    resetForm();
  };

  const handleEdit = (rule: TriggerRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      platform: rule.platform,
      sentiment: rule.sentiment,
      isMainPost: rule.isMainPost,
      mainPostSource: rule.mainPostSource,
      publishTimeDays: rule.publishTimeDays,
      checkFrequencyHours: rule.checkFrequencyHours,
      metric: rule.metric,
      actions: rule.actions
    });
    setShowForm(true);
  };

  const addAction = () => {
    const newAction: TriggerAction = {
      id: Date.now().toString(),
      type: 'primary_comment',
      count: 1,
      frequency: 1,
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

  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      sentiment: 'neutral',
      isMainPost: true,
      mainPostSource: '',
      publishTimeDays: 7,
      checkFrequencyHours: 2,
      metric: 'comments',
      actions: []
    });
    setErrors({});
    setShowPreview(false);
  };



  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个触发规则吗？')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getMetricInfo = (metric: string) => {
    return metrics.find(m => m.value === metric) || metrics[0];
  };

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

  // 过滤规则（搜索功能）
  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.id.includes(searchQuery)
  );

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRules([]);
    } else {
      setSelectedRules(filteredRules.map(rule => rule.id));
    }
    setSelectAll(!selectAll);
  };

  // 处理单个规则选择
  const handleRuleSelect = (ruleId: string) => {
    if (selectedRules.includes(ruleId)) {
      setSelectedRules(selectedRules.filter(id => id !== ruleId));
    } else {
      setSelectedRules([...selectedRules, ruleId]);
    }
  };

  // 批量启用规则
  const handleBulkEnable = () => {
    setRules(rules.map(rule =>
      selectedRules.includes(rule.id) ? { ...rule, isActive: true } : rule
    ));
    setSelectedRules([]);
    setSelectAll(false);
  };

  // 批量禁用规则
  const handleBulkDisable = () => {
    setRules(rules.map(rule =>
      selectedRules.includes(rule.id) ? { ...rule, isActive: false } : rule
    ));
    setSelectedRules([]);
    setSelectAll(false);
  };

  // 批量删除规则
  const handleBulkDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedRules.length} 个规则吗？`)) {
      setRules(rules.filter(rule => !selectedRules.includes(rule.id)));
      setSelectedRules([]);
      setSelectAll(false);
    }
  };

  // 格式化时间显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 获取动作描述
  const getActionDescription = (actions: TriggerAction[]) => {
    if (actions.length === 0) return '无执行动作';

    const primaryAction = actions.find(action => action.type === 'primary_comment');
    if (primaryAction && primaryAction.frequency) {
      const metricInfo = getMetricInfo('comments'); // 假设是评论相关的
      return `${metricInfo.label}每${primaryAction.frequency}个自动创建${primaryAction.count}个一级评论`;
    }

    return `${actions.length}个执行动作`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">


        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">活跃规则</p>
                <p className="text-3xl font-bold text-green-600">{rules.filter(r => r.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">监控指标</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总规则数</p>
                <p className="text-3xl font-bold text-purple-600">{rules.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Repeat2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今日触发</p>
                <p className="text-3xl font-bold text-orange-600">12</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 规则列表 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-end items-center">
              <Link href="/tasks/rules/new-simple">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Plus className="h-5 w-5 mr-2" />
                  创建新规则
                </Button>
              </Link>
            </div>
          </div>

          {/* 搜索和批量操作栏 */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between gap-4">
              {/* 搜索框 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索规则名称、平台或ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 批量操作按钮 */}
              {selectedRules.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">已选择 {selectedRules.length} 个规则</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkEnable}
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    批量启用
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDisable}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    批量禁用
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    批量删除
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {filteredRules.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {rules.length === 0 ? '还没有规则' : '没有找到匹配的规则'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {rules.length === 0
                    ? '创建您的第一个智能触发规则，让自动化监控开始工作'
                    : '尝试调整搜索条件或创建新规则'
                  }
                </p>
                <Link href="/tasks/rules/new-simple">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="h-5 w-5 mr-2" />
                    开始创建
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 全选复选框 */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    全选 ({filteredRules.length} 个规则)
                  </span>
                </div>

                {/* 规则卡片列表 */}
                <div className="grid gap-6">
                  {filteredRules.map((rule, index) => {
                    const metricInfo = getMetricInfo(rule.metric);
                    return (
                      <div key={rule.id} className="group bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:scale-[1.02]">
                        {/* 头部区域：规则名称、ID、创建信息、状态开关、操作按钮 */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                checked={selectedRules.includes(rule.id)}
                                onChange={() => handleRuleSelect(rule.id)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{rule.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>ID: {rule.id}</span>
                                  <span>创建于 {formatDate(rule.createdAt)}</span>
                                  <span>最后更新: {rule.updatedBy} {formatDate(rule.updatedAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${rule.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                  {rule.isActive ? '启用' : '禁用'}
                                </span>
                                <Switch
                                  checked={rule.isActive}
                                  onCheckedChange={() => toggleStatus(rule.id)}
                                  className={`data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300`}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(rule)}
                                  className="text-blue-600 hover:bg-blue-50 transition-all duration-300"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  编辑
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(rule.id)}
                                  className="text-red-600 hover:bg-red-50 transition-all duration-300"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  删除
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 条件和动作区域：触发条件和执行动作在同一行 */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 触发条件 */}
                            <div className="bg-blue-50/30 rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-gray-700 mb-3">触发条件</h5>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                                  {getPlatformIcon(rule.platform)}
                                  {rule.platform}
                                </Badge>
                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                  {metricInfo.label}
                                </Badge>
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                                  巡查频率: {rule.checkFrequencyHours}小时
                                </Badge>
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                  情感倾向: {rule.sentiment === 'positive' ? '正面' : rule.sentiment === 'negative' ? '负面' : '中性'}
                                </Badge>
                                <Badge variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
                                  {rule.isMainPost ? '主帖' : '评论'}
                                </Badge>
                              </div>
                            </div>

                            {/* 执行动作 */}
                            <div className="bg-orange-50/30 rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-gray-700 mb-3">执行动作</h5>
                              <div>
                                <p className="text-sm text-gray-600 mb-2">{getActionDescription(rule.actions)}</p>
                                <div className="flex flex-wrap gap-2">
                                  {rule.actions.map((action, actionIndex) => (
                                    <Badge key={action.id} variant="outline" className="text-xs">
                                      {action.type === 'primary_comment' && '💬 一级评论'}
                                      {action.type === 'secondary_comment' && '↩️ 二级评论'}
                                      {action.type === 'nested_comment_group' && '🏗️ 楼中楼组'}
                                      {action.type === 'main_like' && '❤️ 主帖点赞'}
                                      {action.type === 'comment_like' && '👍 评论点赞'}
                                      {action.type === 'report_main' && '⚠️ 投诉主帖'}
                                      {action.type === 'report_comment' && '🚨 投诉评论'}
                                      {action.type === 'block' && '🚫 屏蔽'}
                                      {action.type === 'delete_main' && '🗑️ 删除主帖'}
                                      {action.type === 'delete_comment' && '🗑️ 删除评论'}
                                      {action.type === 'delete_dropdown' && '📝 删除下拉词'}
                                      {action.type === 'delete_trending' && '🔥 删除大家都在搜'}
                                      {action.frequency && ` (每${action.frequency}条)`}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 创建规则表单 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingRule ? '编辑触发规则' : '创建智能触发规则'}
                    </h2>
                    <p className="text-gray-600">配置您的自动化监控规则</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingRule(null);
                    resetForm();
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8">
              {/* 规则名称 - 第一行横铺 */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">📋</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">规则名称</h3>
                      <p className="text-sm text-gray-600">为您的自动化规则起一个响亮的名字</p>
                    </div>
                  </div>
                  <div className="max-w-2xl">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例如：微信公众号评论自动回复规则"
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 左侧：触发规则配置 */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">触发规则配置</h3>
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
                                <AiFillTikTok className="w-5 h-5 text-black" />
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
                          {metrics.map((metric) => (
                            <button
                              key={metric.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, metric: metric.value as TriggerRule['metric'] })}
                              className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                                formData.metric === metric.value
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <metric.icon className="h-6 w-6 text-gray-600" />
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{metric.label}</p>
                                  <p className="text-xs text-gray-600">
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
                          ))}
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
                            value={formData.isMainPost.toString()}
                            onValueChange={(value: string) => setFormData({ ...formData, isMainPost: value === 'true' })}
                          >
                            <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">✅ 是</SelectItem>
                              <SelectItem value="false">❌ 否</SelectItem>
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
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">执行动作配置</h3>
                        <p className="text-sm text-gray-600">设置自动化执行的动作序列</p>
                      </div>
                    </div>

                    {/* 动作列表 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700">执行动作</h4>
                        <Button
                          type="button"
                          onClick={addAction}
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          添加动作
                        </Button>
                      </div>

                      {formData.actions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-50" />
                          <p className="text-sm font-medium">还没有配置执行动作</p>
                          <p className="text-xs mt-2">点击上方按钮添加动作</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                          {formData.actions.map((action, index) => (
                            <div key={action.id} className="bg-white/60 rounded-xl p-5 border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-900">
                                    动作 {index + 1}
                                  </span>
                                  <Select
                                    value={action.type}
                                    onValueChange={(value: TriggerAction['type']) =>
                                      updateAction(action.id, { type: value })
                                    }
                                  >
                                    <SelectTrigger className="w-32 h-8 border-2 border-orange-200 focus:border-orange-500 rounded-lg">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="primary_comment">💬 一级评论</SelectItem>
                                      <SelectItem value="secondary_comment">↩️ 二级评论</SelectItem>
                                      <SelectItem value="nested_comment_group">🏗️ 楼中楼组</SelectItem>
                                      <SelectItem value="main_like">❤️ 主帖点赞</SelectItem>
                                      <SelectItem value="comment_like">� 评论点赞</SelectItem>
                                      <SelectItem value="report_main">⚠️ 投诉主帖</SelectItem>
                                      <SelectItem value="report_comment">� 投诉评论</SelectItem>
                                      <SelectItem value="block">🚫 屏蔽</SelectItem>
                                      <SelectItem value="delete_main">🗑️ 删除主帖</SelectItem>
                                      <SelectItem value="delete_comment">🗑️ 删除评论</SelectItem>
                                      <SelectItem value="delete_dropdown">📝 删除下拉词</SelectItem>
                                      <SelectItem value="delete_trending">🔥 删除大家都在搜</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAction(action.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <Label className="text-xs text-gray-600 mb-2 block font-medium">每几条执行</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={action.frequency}
                                    onChange={(e) => updateAction(action.id, {
                                      frequency: parseInt(e.target.value) || 1
                                    })}
                                    className="h-9 text-sm text-center border-2 border-gray-200 focus:border-orange-500 rounded-lg"
                                    placeholder="1"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">每增加N条指标就执行一次</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600 mb-2 block font-medium">执行次数</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={action.count}
                                    onChange={(e) => updateAction(action.id, {
                                      count: parseInt(e.target.value) || 1
                                    })}
                                    className="h-9 text-sm text-center border-2 border-gray-200 focus:border-orange-500 rounded-lg"
                                    placeholder="1"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">每次执行次数</p>
                                </div>
                              </div>

                              {(action.type === 'secondary_comment' || action.type === 'nested_comment_group') && (
                                <div>
                                  <Label className="text-xs text-gray-600 mb-2 block font-medium">回复内容</Label>
                                  <Input
                                    value={action.content}
                                    onChange={(e) => updateAction(action.id, {
                                      content: e.target.value
                                    })}
                                    placeholder="输入回复内容..."
                                    className="h-9 text-sm border-2 border-gray-200 focus:border-orange-500 rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {errors.actions && (
                        <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.actions}
                        </p>
                      )}
                    </div>
                  </div>


                </div>
              </div>

              {/* 底部操作按钮 */}
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRule(null);
                    resetForm();
                  }}
                  className="px-8 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingRule ? '更新规则' : '创建规则'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

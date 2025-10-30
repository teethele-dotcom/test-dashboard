'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronRight, Check } from 'lucide-react';
import MobilePreview from '@/components/MobilePreview';

const steps = ['基本信息', '预算与奖励', '审核要求'];

export default function NewTaskPage(): React.ReactElement {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<'save' | 'create' | 'publish'>('create');

  // Form data
  const [formData, setFormData] = useState({
    // Mandatory basic fields
    taskName: '',
    taskType: '',
    taskPlatform: '',
    taskTheme: '',
    taskCycle: '',
    claimStartTime: '',
    claimEndTime: '',
    taskImage: '/placeholder.svg', // default image

    // Task rules (moved to end)
    ruleDescription: '1. 参与者需按照任务要求完成相应操作\n2. 作品质量需达到合格标准\n3. 需在规定时间内提交作品\n4. 系统会进行自动筛选审核',
    executionFlowDescription: '1. 用户领取任务后，按任务要求完成内容创作\n2. 提交作品至平台系统\n3. 系统自动审核通过后，发放任务奖励\n4. 奖励积分自动到账，可在个人中心查看',

    // Mandatory reward fields
    budgetSource: '',
    pointsBudget: '',
    totalTasks: '',
    basicRewardPoints: '10',

    // Points explanation
    pointsModuleTitle: '积分奖励说明',
    pointsBasicValue: '基础积分：根据任务完成度发放',
    pointsAdvancedValue: '进阶积分：根据作品质量和原创性额外奖励',

    // Statement/Disclaimer
    statementTitle: '用户声明',
    statementDescription: '我承诺提交的作品为本人原创，不涉及盗用他人内容，同时遵守平台相关规范。',

    // Extra rewards (default off)
    enableExtraRewards: 'false',
    extraRewardPoints: '0',

    // Optional fields
    taskForm: '',
    visibilityScope: '人群', // or '公司'
    taskMaterial: '',

    // Audit requirements
    taskSubmission: '在线提交',
    auditMethod: '机器审核',
    appealPeriod: '3天',
    wordCountRequirement: '',
    prohibitedWords: '',
    keywords: '',
    emotionRequirement: '',

    // Legacy fields for compatibility
    title: '',
    description: '',
    platform: '',
    type: '原创任务',
    cycle: '',
    startDate: '',
    endDate: '',
    creator: '当前用户'
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Keyboard shortcut for quick submission
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        if (currentStep === steps.length - 1) {
          handleAction('create'); // Quick submit on final step
        } else {
          nextStep(); // Go to next step on other steps
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, formData]); // Dependency array needs updating

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve =>
        setTimeout(() => {
          console.log('Creating task:', formData);
          resolve(true);
        }, 1500)
      );

      // Show success message and redirect
      if (submitAction === 'publish') {
        alert('任务发布成功！');
      } else if (submitAction === 'create') {
        alert('任务创建成功！');
      } else {
        alert('任务保存成功！');
      }

      router.push('/tasks');
    } catch (error) {
      console.error('任务创建失败:', error);
      alert('操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = (action: 'save' | 'create' | 'publish') => {
    setSubmitAction(action);
    submitForm();
  };

  const handleCancel = () => {
    if (confirm('离开页面将丢失未保存的数据，确定要离开吗？')) {
      router.push('/tasks');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Task Name - Mandatory */}
              <div className="space-y-2">
                <label htmlFor="taskName" className="text-sm font-medium">任务名称 *</label>
                <Input
                  id="taskName"
                  value={formData.taskName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('taskName', e.target.value)}
                  placeholder="请输入任务名称"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Task Type - Mandatory */}
                <div className="space-y-2">
                  <label htmlFor="taskType" className="text-sm font-medium">任务类型 *</label>
                  <select
                    id="taskType"
                    value={formData.taskType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('taskType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">选择任务类型</option>
                    <option value="原创任务">原创任务</option>
                    <option value="验证任务">验证任务</option>
                    <option value="调研任务">调研任务</option>
                    <option value="互动任务">互动任务</option>
                  </select>
                </div>

                {/* Task Platform - Mandatory */}
                <div className="space-y-2">
                  <label htmlFor="taskPlatform" className="text-sm font-medium">任务平台 *</label>
                  <select
                    id="taskPlatform"
                    value={formData.taskPlatform}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('taskPlatform', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">选择平台</option>
                    <option value="微信">微信</option>
                    <option value="抖音">抖音</option>
                    <option value="微博">微博</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Task Theme - Mandatory */}
                <div className="space-y-2">
                  <label htmlFor="taskTheme" className="text-sm font-medium">任务主题 *</label>
                  <select
                    id="taskTheme"
                    value={formData.taskTheme}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('taskTheme', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">选择主题</option>
                    <option value="创意设计">创意设计</option>
                    <option value="内容创作">内容创作</option>
                    <option value="产品体验">产品体验</option>
                    <option value="市场调研">市场调研</option>
                    <option value="品牌推广">品牌推广</option>
                  </select>
                </div>

                {/* Task Form - Optional */}
                <div className="space-y-2">
                  <label htmlFor="taskForm" className="text-sm font-medium">任务形式</label>
                  <select
                    id="taskForm"
                    value={formData.taskForm}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('taskForm', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">选择任务形式</option>
                    <option value="图片上传">图片上传</option>
                    <option value="视频上传">视频上传</option>
                    <option value="文字创作">文字创作</option>
                    <option value="问卷填写">问卷填写</option>
                    <option value="互动类">互动类</option>
                  </select>
                </div>
              </div>

              {/* Task Cycle - Mandatory */}
              <div className="space-y-2">
                <label htmlFor="taskCycle" className="text-sm font-medium">任务周期 *</label>
                <select
                  id="taskCycle"
                  value={formData.taskCycle}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('taskCycle', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">选择任务周期</option>
                  <option value="单次任务">单次任务</option>
                  <option value="每日任务">每日任务</option>
                  <option value="每周任务">每周任务</option>
                  <option value="每月任务">每月任务</option>
                  <option value="长期任务">长期任务</option>
                </select>
              </div>

              {/* Task Claim Times - Mandatory */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="claimStartTime" className="text-sm font-medium">任务领取开始时间 *</label>
                  <Input
                    id="claimStartTime"
                    type="datetime-local"
                    value={formData.claimStartTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('claimStartTime', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="claimEndTime" className="text-sm font-medium">任务领取结束时间 *</label>
                  <Input
                    id="claimEndTime"
                    type="datetime-local"
                    value={formData.claimEndTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('claimEndTime', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Task Image - Default provided */}
              <div className="space-y-2">
                <label className="text-sm font-medium">任务图片 *</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 border-2 rounded-lg flex items-center justify-center">
                    <img src={formData.taskImage} alt="任务图片" className="max-w-full max-h-full rounded" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    使用默认图片，如需更换可上传新图片
                  </div>
                </div>
              </div>

              {/* Visibility Scope - Optional */}
              <div className="space-y-2">
                <label htmlFor="visibilityScope" className="text-sm font-medium">任务可见范围</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibilityScope"
                      value="人群"
                      checked={formData.visibilityScope === '人群'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('visibilityScope', e.target.value)}
                      className="mr-2"
                    />
                    人群
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibilityScope"
                      value="公司"
                      checked={formData.visibilityScope === '公司'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('visibilityScope', e.target.value)}
                      className="mr-2"
                    />
                    公司
                  </label>
                </div>
              </div>

              {/* Task Material - Optional */}
              <div className="space-y-2">
                <label htmlFor="taskMaterial" className="text-sm font-medium">任务素材</label>
                <textarea
                  id="taskMaterial"
                  value={formData.taskMaterial}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('taskMaterial', e.target.value)}
                  placeholder="可选：提供任务相关的素材链接或说明"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            {/* Budget and Basic Rewards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Budget Source - Mandatory */}
              <div className="space-y-2">
                <label htmlFor="budgetSource" className="text-sm font-medium">预算来源 *</label>
                <select
                  id="budgetSource"
                  value={formData.budgetSource}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('budgetSource', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">选择预算来源</option>
                  <option value="公司预算">公司预算</option>
                  <option value="项目专项资金">项目专项资金</option>
                  <option value="活动营销预算">活动营销预算</option>
                  <option value="部门经费">部门经费</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              {/* Task Total - Mandatory */}
              <div className="space-y-2">
                <label htmlFor="totalTasks" className="text-sm font-medium">任务总量 *</label>
                <Input
                  id="totalTasks"
                  type="number"
                  value={formData.totalTasks}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('totalTasks', e.target.value)}
                  placeholder="请输入任务总数量"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Points Budget - Mandatory */}
              <div className="space-y-2">
                <label htmlFor="pointsBudget" className="text-sm font-medium">积分预算 *</label>
                <Input
                  id="pointsBudget"
                  type="number"
                  value={formData.pointsBudget}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('pointsBudget', e.target.value)}
                  placeholder="请输入积分预算金额"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  💡 设置任务完成后用户可获得的积分奖励金额
                </p>
              </div>

              {/* Basic Reward Points - Mandatory */}
              <div className="space-y-2">
                <label htmlFor="basicRewardPoints" className="text-sm font-medium">基础奖励积分 *</label>
                <Input
                  id="basicRewardPoints"
                  type="number"
                  value={formData.basicRewardPoints}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('basicRewardPoints', e.target.value)}
                  placeholder="10"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  💡 基础完成度可获得的积分奖励
                </p>
              </div>
            </div>

            {/* Points Explanation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">积分说明</h3>

              <div className="space-y-2">
                <label htmlFor="pointsModuleTitle" className="text-sm font-medium">模块标题</label>
                <Input
                  id="pointsModuleTitle"
                  value={formData.pointsModuleTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('pointsModuleTitle', e.target.value)}
                  placeholder="积分奖励说明"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="pointsBasicValue" className="text-sm font-medium">基础积分</label>
                  <textarea
                    id="pointsBasicValue"
                    value={formData.pointsBasicValue}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('pointsBasicValue', e.target.value)}
                    placeholder="基础积分说明"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="pointsAdvancedValue" className="text-sm font-medium">进阶积分</label>
                  <textarea
                    id="pointsAdvancedValue"
                    value={formData.pointsAdvancedValue}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('pointsAdvancedValue', e.target.value)}
                    placeholder="进阶积分说明"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Statement/Disclaimer */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">声明</h3>

              <div className="space-y-2">
                <label htmlFor="statementTitle" className="text-sm font-medium">声明标题</label>
                <Input
                  id="statementTitle"
                  value={formData.statementTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('statementTitle', e.target.value)}
                  placeholder="用户声明"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="statementDescription" className="text-sm font-medium">声明描述</label>
                <textarea
                  id="statementDescription"
                  value={formData.statementDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('statementDescription', e.target.value)}
                  placeholder="声明描述内容"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Extra Rewards Toggle */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableExtraRewards === 'true'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateFormData('enableExtraRewards', e.target.checked.toString());
                      // Reset extra reward points when disabled
                      if (!e.target.checked) {
                        updateFormData('extraRewardPoints', '0');
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">开启额外奖励积分</span>
                </label>
              </div>

              {formData.enableExtraRewards && (
                <div className="space-y-2 ml-6">
                  <label htmlFor="extraRewardPoints" className="text-sm font-medium">额外奖励积分</label>
                  <Input
                    id="extraRewardPoints"
                    type="number"
                    value={formData.extraRewardPoints}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('extraRewardPoints', e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            {/* Task Rules */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">任务规则配置</h3>

              <div className="space-y-2">
                <label htmlFor="ruleDescription" className="text-sm font-medium">规则描述 *</label>
                <textarea
                  id="ruleDescription"
                  value={formData.ruleDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('ruleDescription', e.target.value)}
                  placeholder="请输入任务规则描述"
                  rows={6}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  💡 明确告知参与者任务的具体要求和标准
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="executionFlowDescription" className="text-sm font-medium">执行流程说明 *</label>
                <textarea
                  id="executionFlowDescription"
                  value={formData.executionFlowDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('executionFlowDescription', e.target.value)}
                  placeholder="请输入任务执行流程说明"
                  rows={6}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  💡 详细说明参与者需要完成的任务步骤
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-800 mb-2">💰 预算与奖励说明</h4>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• 积分预算应与任务总量相匹配，确保奖励资金充足</li>
                <li>• 基础积分设置应考虑任务难度和工作量</li>
                <li>• 声明内容将向用户展示，增强任务可信度</li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Task Submission */}
            <div className="space-y-2">
              <label htmlFor="taskSubmission" className="text-sm font-medium">任务提交</label>
              <select
                id="taskSubmission"
                value={formData.taskSubmission}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('taskSubmission', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="在线提交">在线提交</option>
                <option value="线下提交">线下提交</option>
                <option value="邮件提交">邮件提交</option>
                <option value="其他方式">其他方式</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Audit Method */}
              <div className="space-y-2">
                <label htmlFor="auditMethod" className="text-sm font-medium">审核方式</label>
                <select
                  id="auditMethod"
                  value={formData.auditMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('auditMethod', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="机器审核">机器审核</option>
                  <option value="人工审核">人工审核</option>
                  <option value="混合审核">混合审核</option>
                  <option value="无需审核">无需审核</option>
                </select>
              </div>

              {/* Appeal Period */}
              <div className="space-y-2">
                <label htmlFor="appealPeriod" className="text-sm font-medium">申诉周期</label>
                <select
                  id="appealPeriod"
                  value={formData.appealPeriod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('appealPeriod', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="3天">3天</option>
                  <option value="7天">7天</option>
                  <option value="15天">15天</option>
                  <option value="30天">30天</option>
                  <option value="无申诉">无申诉</option>
                </select>
              </div>
            </div>

            {/* Content Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">内容审核要求</h3>

              <div className="space-y-2">
                <label htmlFor="wordCountRequirement" className="text-sm font-medium">字数要求</label>
                <Input
                  id="wordCountRequirement"
                  value={formData.wordCountRequirement}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('wordCountRequirement', e.target.value)}
                  placeholder="例如：不少于500字，不超过2000字"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="prohibitedWords" className="text-sm font-medium">违禁词</label>
                <textarea
                  id="prohibitedWords"
                  value={formData.prohibitedWords}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('prohibitedWords', e.target.value)}
                  placeholder="请输入用逗号分隔的违禁词列表"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="keywords" className="text-sm font-medium">关键词</label>
                <textarea
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('keywords', e.target.value)}
                  placeholder="请输入任务内容应包含的关键词，用逗号分隔"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="emotionRequirement" className="text-sm font-medium">情感</label>
                <select
                  id="emotionRequirement"
                  value={formData.emotionRequirement}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('emotionRequirement', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">不限制</option>
                  <option value="正面积极">正面积极</option>
                  <option value="中性客观">中性客观</option>
                  <option value="幽默有趣">幽默有趣</option>
                  <option value="专业严谨">专业严谨</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            {/* Audit Cycle */}
            <div className="space-y-2">
              <label htmlFor="cycle" className="text-sm font-medium">审核周期</label>
              <select
                id="cycle"
                value={formData.cycle}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('cycle', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">选择审核周期</option>
                <option value="即时审核">即时审核</option>
                <option value="1周">1周审核周期</option>
                <option value="2周">2周审核周期</option>
                <option value="1个月">1个月审核周期</option>
              </select>
            </div>

            {/* Activity Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">活动开始时间</label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">活动结束时间</label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">⚙️ 审核要求说明</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 选择合适的审核方式以平衡效率和准确性</li>
                <li>• 申诉周期设置应考虑用户体验和运营成本</li>
                <li>• 内容要求应明确具体，便于审核人员判断</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" onClick={() => router.push('/tasks')}>
          任务列表
        </Button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">新建任务</span>
      </div>

      {/* 步骤进度条 */}
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                index <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="ml-8 h-px w-16 bg-muted" />
            )}
          </div>
        ))}
      </div>

      {/* 主内容区域 - 填满浏览器高度 */}
      <div className="flex h-[calc(100vh-280px)] gap-8 px-6">
        {/* 表单内容区域 - 扩大宽度 */}
        <div className="flex-1 overflow-y-auto">
          <Card className="shadow-sm h-fit">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">{steps[currentStep]}</CardTitle>
              <CardDescription className="text-base">
                {currentStep === 0 && "填写任务的基本信息，让用户了解任务内容"}
                {currentStep === 1 && "设置预算、奖励配置和任务规则"}
                {currentStep === 2 && "配置审核要求和内容标准"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pb-44">
              {renderStep()}
            </CardContent>
          </Card>
        </div>

        {/* 移动端预览区域 - 固定宽度 */}
        <div className="w-72 sticky top-0">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">📱 移动端预览</h3>
              <p className="text-sm text-gray-600">实时查看移动端展示效果</p>
            </div>

            {/* Enhanced Mobile Preview Component */}
            <MobilePreview formData={formData} />

            <div className="text-xs text-center text-muted-foreground">
              ✏️ 填写表单可实时预览效果
            </div>
          </div>
        </div>
      </div>

      {/* 固定底部操作按钮 - 考虑到左侧导航栏 */}
      <div className="fixed bottom-0 left-14 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        {/* 使用flexbox布局确保按钮宽度一致 */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* 上一步按钮 */}
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="w-full sm:w-auto sm:min-w-[100px]"
          >
            上一步
          </Button>

          {/* 右侧按钮组 */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="w-full sm:w-auto min-w-[80px]"
              disabled={isSubmitting}
            >
              取消
            </Button>

            {/* 最后一步的特定按钮 */}
            {currentStep === steps.length - 1 ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => handleAction('save')}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[80px]"
                >
                  {isSubmitting && submitAction === 'save' ? '保存中...' : '保存'}
                </Button>
                <Button
                  onClick={() => handleAction('create')}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-8 min-w-[100px]"
                  size="lg"
                >
                  {isSubmitting && submitAction === 'create' ? '创建中...' : '创建任务'}
                </Button>
                <Button
                  onClick={() => handleAction('publish')}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-8 min-w-[80px]"
                  size="lg"
                >
                  {isSubmitting && submitAction === 'publish' ? '发布中...' : '发布'}
                </Button>
              </>
            ) : (
              /* 非最后一步时的下一步按钮 */
              <Button
                onClick={nextStep}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto min-w-[100px]"
              >
                下一步
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

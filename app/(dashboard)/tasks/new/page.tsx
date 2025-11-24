'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, Check, X, Plus } from 'lucide-react';
import MobilePreview from '@/components/MobilePreview';

const steps = ['基本信息', '预算与奖励', '审核要求'];

// Generate mock assets outside component to ensure stability
const generateMockAssets = () => {
  const types = ['image', 'video', 'document', 'text', 'presentation', 'audio'];
  const categories = ['品牌', '产品', '营销', '用户', '培训', '活动', '资料'];
  const spaces = ['公司资源', '部门共享', '个人素材', '项目专用', '系统模版'];
  const tagsList = ['热销', '新品', '明星产品', '客户好评', '技术支持', '创意设计'];

  const assets = [];

  for (let i = 1; i <= 200; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const space = spaces[Math.floor(Math.random() * spaces.length)];

    // Generate random tags (1-3 tags per asset)
    const numTags = Math.floor(Math.random() * 3) + 1;
    const tags = [];
    for (let j = 0; j < numTags; j++) {
      tags.push(tagsList[Math.floor(Math.random() * tagsList.length)]);
    }

    // Generate realistic content based on type
    let content = '';
    switch (type) {
      case 'image':
        content = `产品展示图 - 高清分辨率, 适合电商使用, 文件大小约${Math.floor(Math.random() * 5) + 1}MB`;
        break;
      case 'video':
        content = `产品教程视频 - 时长${Math.floor(Math.random() * 10) + 2}分钟, 支持多设备播放, 包含字幕`;
        break;
      case 'document':
        content = `使用指南文档 - 包含详细操作步骤, 图文并茂, 便于用户理解和使用`;
        break;
      case 'text':
        content = `营销文案模板 - 包含多种风格版本, 适用于不同营销场景, 可定制化修改`;
        break;
      case 'presentation':
        content = `演示文稿资料 - 包含数据分析图表, 产品功能介绍, 会议演示素材`;
        break;
      case 'audio':
        content = `音频素材文件 - 背景音乐/音效, 高质量编码, 支持多格式导出`;
        break;
    }

    // Random creator names
    const creators = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
    const creator = creators[Math.floor(Math.random() * creators.length)];

    // Random creation dates within last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const createdAt = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));

    // Random publish data with multiple states
    const rand = Math.random();
    let status = 'unpublished'; // unpublished, occupied, published
    let taskId = null;
    const occupiedTasks = [];

    if (rand < 0.3) { // 30% published
      status = 'published';
      taskId = `TASK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    } else if (rand < 0.6) { // 30% occupied
      status = 'occupied';
      // Create 1-3 occupied task IDs
      const numTasks = Math.floor(Math.random() * 3) + 1;
      for (let t = 0; t < numTasks; t++) {
        occupiedTasks.push(`TASK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
      }
      taskId = occupiedTasks[0]; // For compatibility with hover
    } else { // 40% unpublished
      status = 'unpublished';
    }

    // Platform data for published/occupied items
    const publishedPlatforms = ['微信', '抖音', '微博'];
    const randomPlatforms = status === 'unpublished' ? [] :
      publishedPlatforms.filter(() => Math.random() > 0.4);

    // If no platforms selected but is published or occupied, publish to at least one
    if ((status === 'published' || status === 'occupied') && randomPlatforms.length === 0) {
      randomPlatforms.push(publishedPlatforms[Math.floor(Math.random() * publishedPlatforms.length)]);
    }

    assets.push({
      id: i.toString(),
      name: `${category}${Math.random().toString(36).substring(2, 8)}${type.charAt(0).toUpperCase() + type.slice(1)}_${i}`,
      type,
      category,
      space,
      tags: tags.filter((tag, index, arr) => arr.indexOf(tag) === index), // Remove duplicates
      content,
      creator,
      createdAt: createdAt.toISOString(),
      imageUrl: type === 'image' ? `/api/placeholder/80/60?text=${type.charAt(0).toUpperCase()}${i}` : null,
      isPublished: status === 'published',
      status,
      publishedPlatforms: randomPlatforms,
      occupiedTasks,
      taskId
    });
  }
  return assets;
};

// Generate assets once outside component
const availableAssets = generateMockAssets();

export default function NewTaskPage(): React.ReactElement {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<'save' | 'create' | 'publish'>('create');
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedMaterialsOrder, setSelectedMaterialsOrder] = useState<string[]>([]);
  const [autoDistribute, setAutoDistribute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpace, setFilterSpace] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterCategories, setFilterCategories] = useState<string>('all');
  const [filterTags, setFilterTags] = useState<string>('all');

  // Merged filter state for publish status and platforms
  const [filterPublishCombined, setFilterPublishCombined] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter for showing only selected items
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

    // Mandatory reward fields - moved budgetSource here
    budgetSource: '',
    totalTasks: '',
    rewardType: '积分', // 积分, 优惠券, 商品

    // Points related fields
    pointsBudget: '',
    basicRewardPoints: '10',

    // Coupon specific fields
    basicRewardCouponType: '', // coupon type when rewardType is 优惠券

    // Page display settings
    displayModuleTitle: '积分奖励说明',
    displayBasicValue: '基础积分：根据任务完成度发放',
    displayAdvancedValue: '进阶积分：根据作品质量和原创性额外奖励',
    displayMaxPoints: '100', // when rewardType is 积分
    displayStatementTitle: '用户声明',
    displayStatementDescription: '我承诺提交的作品为本人原创，不涉及盗用他人内容，同时遵守平台相关规范。',

    // Task rules (moved to end)
    ruleDescription: '1. 参与者需按照任务要求完成相应操作\n2. 作品质量需达到合格标准\n3. 需在规定时间内提交作品\n4. 系统会进行自动筛选审核',
    executionFlowDescription: '1. 用户领取任务后，按任务要求完成内容创作\n2. 提交作品至平台系统\n3. 系统自动审核通过后，发放任务奖励\n4. 奖励积分自动到账，可在个人中心查看',

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
    pointsModuleTitle: '',
    pointsBasicValue: '',
    pointsAdvancedValue: '',
    statementTitle: '',
    statementDescription: '',
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

  const handleMaterialModalConfirm = () => {
    // Reset pagination to first page when closing modal
    setCurrentPage(1);

    // Create mock rich material data for mobile preview
    const mockMaterials = selectedMaterials.map(materialName => {
      // Parse material type from name or generate mock data
      const isImage = materialName.includes('图文') || materialName.includes('图片');
      const isVideo = materialName.includes('视频');

      if (isImage) {
        return {
          name: materialName,
          type: 'image',
          url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000 + 1500000000)}?w=300&h=200&fit=crop&auto=format`,
          description: '产品展示图片',
          thumbnail: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000 + 1500000000)}?w=120&h=80&fit=crop&auto=format`
        };
      } else if (isVideo) {
        return {
          name: materialName,
          type: 'video',
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // Sample video URL
          duration: '02:30',
          description: '产品介绍视频',
          thumbnail: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000 + 1500000000)}?w=300&h=200&fit=crop&auto=format`
        };
      } else {
        return {
          name: materialName,
          type: 'document',
          url: '#',
          description: '文档素材',
          thumbnail: null
        };
      }
    });

    // Store the selected materials with rich data in formData.taskMaterial as JSON string
    updateFormData('taskMaterial', JSON.stringify({
      materials: selectedMaterials,
      materialsData: mockMaterials,
      autoDistribute
    }));
    setIsMaterialModalOpen(false);
  };

  const toggleMaterialSelection = (asset: { name: string }) => {
    const wasSelected = selectedMaterials.includes(asset.name);

    setSelectedMaterials(prev => {
      if (wasSelected) {
        return prev.filter(name => name !== asset.name);
      } else {
        return [...prev, asset.name];
      }
    });

    setSelectedMaterialsOrder(prev => {
      if (wasSelected) {
        return prev.filter(name => name !== asset.name);
      } else {
        return [...prev, asset.name];
      }
    });
  };

  const selectAllCurrentPage = () => {
    // Get current filtered assets that are visible on current page
    const filteredAssets = availableAssets.filter(asset => {
      // First check if only showing selected items
      if (showOnlySelected) {
        const isSelected = selectedMaterials.includes(asset.name);
        if (!isSelected) return false;
      }

                  const matchesSearch = searchQuery === '' ||
                    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    asset.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    asset.creator.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesSpace = filterSpace === 'all' || asset.space === filterSpace;
                  const matchesType = filterType === 'all' || asset.type === filterType;
                  const matchesCategory = filterCategories === 'all' || asset.category === filterCategories;
                  const matchesTags = filterTags === 'all' || asset.tags.some(tag => tag === filterTags);

                  // Unified publish status and platform filtering
                  let matchesPublishCombined = true;
                  if (filterPublishCombined !== 'all') {
                    switch (filterPublishCombined) {
                      case 'wechat-published':
                        matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('微信');
                        break;
                      case 'douyin-published':
                        matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('抖音');
                        break;
                      case 'weibo-published':
                        matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('微博');
                        break;
                      case 'unpublished':
                        matchesPublishCombined = !asset.isPublished;
                        break;
                      default:
                        matchesPublishCombined = true;
                    }
                  }

                  return matchesSearch && matchesSpace && matchesType && matchesCategory && matchesTags && matchesPublishCombined;
    });

    // Get selected assets that might not match current filters
    const selectedAssets = availableAssets.filter(asset =>
      selectedMaterials.includes(asset.name)
    );

    // Combine filtered assets with selected assets, remove duplicates and sort selected to top
    const allVisibleAssets = [...filteredAssets];
    selectedAssets.forEach(asset => {
      if (!allVisibleAssets.find(a => a.name === asset.name)) {
        allVisibleAssets.unshift(asset); // Add selected items at top
      }
    });

    // Sort so selected items appear at the top
    allVisibleAssets.sort((a, b) => {
      const aSelected = selectedMaterials.includes(a.name);
      const bSelected = selectedMaterials.includes(b.name);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

    // Get assets for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageAssets = allVisibleAssets.slice(startIndex, endIndex);

    const assetNames = currentPageAssets.map(asset => asset.name);
    setSelectedMaterials(prev => {
      const newSelected = new Set(prev);
      assetNames.forEach(name => newSelected.add(name));
      return Array.from(newSelected);
    });
  };

  const deselectAllCurrentPage = () => {
    // Get current filtered assets that are visible on current page
    const filteredAssets = availableAssets.filter(asset => {
      // First check if only showing selected items
      if (showOnlySelected) {
        const isSelected = selectedMaterials.includes(asset.name);
        if (!isSelected) return false;
      }

      const matchesSearch = searchQuery === '' ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.creator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpace = filterSpace === 'all' || asset.space === filterSpace;
      const matchesType = filterType === 'all' || asset.type === filterType;
      const matchesCategory = filterCategories === 'all' || asset.category === filterCategories;
      const matchesTags = filterTags === 'all' || asset.tags.some(tag => tag === filterTags);

      // Unified publish status and platform filtering
      let matchesPublishCombined = true;
      if (filterPublishCombined !== 'all') {
        switch (filterPublishCombined) {
          case 'wechat-published':
            matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('微信');
            break;
          case 'douyin-published':
            matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('抖音');
            break;
          case 'weibo-published':
            matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('微博');
            break;
          case 'unpublished':
            matchesPublishCombined = !asset.isPublished;
            break;
          default:
            matchesPublishCombined = true;
        }
      }

      return matchesSearch && matchesSpace && matchesType && matchesCategory && matchesTags && matchesPublishCombined;
    });

    // Get selected assets that might not match current filters
    const selectedAssets = availableAssets.filter(asset =>
      selectedMaterials.includes(asset.name)
    );

    // Combine filtered assets with selected assets, remove duplicates and sort selected to top
    const allVisibleAssets = [...filteredAssets];
    selectedAssets.forEach(asset => {
      if (!allVisibleAssets.find(a => a.name === asset.name)) {
        allVisibleAssets.unshift(asset); // Add selected items at top
      }
    });

    // Sort so selected items appear at the top
    allVisibleAssets.sort((a, b) => {
      const aSelected = selectedMaterials.includes(a.name);
      const bSelected = selectedMaterials.includes(b.name);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

    // Get assets for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageAssets = allVisibleAssets.slice(startIndex, endIndex);

    const assetNames = currentPageAssets.map(asset => asset.name);
    setSelectedMaterials(prev => prev.filter(name => !assetNames.includes(name)));
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

              <div className="grid grid-cols-2 gap-4">
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

              {/* Task Material - Optional */}
              <div className="space-y-2">
                <label className="text-sm font-medium">任务素材</label>
                {selectedMaterials.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => setIsMaterialModalOpen(true)}
                        className="text-sm text-muted-foreground hover:text-primary cursor-pointer underline underline-offset-2"
                      >
                        已选素材 ({selectedMaterials.length} 个)
                      </button>
                      {selectedMaterials.length > 0 && (
                        <Button
                          onClick={() => setSelectedMaterials([])}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-800 h-6 px-2"
                        >
                          清空
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMaterials.slice(0, 10).map((material, index) => (
                        <div key={`${material}-${index}`} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-1 max-w-32">
                          <span className="truncate">{material}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMaterials(prev => prev.filter(m => m !== material));
                            }}
                            className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {selectedMaterials.length > 10 && (
                        <button
                          onClick={() => setIsMaterialModalOpen(true)}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-600 cursor-pointer transition-colors"
                          key="more-button"
                        >
                          +{selectedMaterials.length - 10} 个更多
                        </button>
                      )}
                    </div>
                    {selectedMaterials.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        点击【已选素材】或【更多】管理所有素材
                      </p>
                    )}
                  </div>
                )}
                <Button
                  onClick={() => {
                    // 如果已有选中的素材，打开弹窗时自动开启"仅显示已选中"模式
                    if (selectedMaterials.length > 0) {
                      setShowOnlySelected(true);
                    } else {
                      setShowOnlySelected(false);
                    }
                    setIsMaterialModalOpen(true);
                  }}
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
选择素材
                </Button>


              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Reward Type - Mandatory */}
              <div className="space-y-2">
                <label className="text-sm font-medium">奖励内容 *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rewardType"
                      value="积分"
                      checked={formData.rewardType === '积分'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('rewardType', e.target.value)}
                      className="mr-2"
                    />
                    积分
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rewardType"
                      value="优惠券"
                      checked={formData.rewardType === '优惠券'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('rewardType', e.target.value)}
                      className="mr-2"
                    />
                    优惠券
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rewardType"
                      value="商品"
                      checked={formData.rewardType === '商品'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('rewardType', e.target.value)}
                      className="mr-2"
                    />
                    商品
                  </label>
                </div>
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

            {/* Basic Reward display */}
            {formData.rewardType === '积分' && (
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
            )}

            {formData.rewardType === '优惠券' && (
              <div className="space-y-2">
                <label htmlFor="basicRewardCouponType" className="text-sm font-medium">基础奖励 *</label>
                <select
                  id="basicRewardCouponType"
                  value={formData.basicRewardCouponType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('basicRewardCouponType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">选择优惠券类型</option>
                  <option value="折扣券">折扣券</option>
                  <option value="满减券">满减券</option>
                  <option value="免邮券">免邮券</option>
                  <option value="换购券">换购券</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            )}

            {formData.rewardType === '商品' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">基础奖励 *</label>
                <Input
                  value="礼品商品"
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">
                  💡 商品类型奖励将在后续步骤中详细配置
                </p>
              </div>
            )}

            {/* Points Budget - Only show for points rewards */}
            {formData.rewardType === '积分' && (
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
            )}

            {/* Page Display Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">页面展示设置</h3>

              {formData.rewardType === '积分' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="displayMaxPoints" className="text-sm font-medium">展示最高获得积分</label>
                    <Input
                      id="displayMaxPoints"
                      type="number"
                      value={formData.displayMaxPoints}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('displayMaxPoints', e.target.value)}
                      placeholder="100"
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 向用户展示可获得的最高积分奖励
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="displayModuleTitle" className="text-sm font-medium">模块标题</label>
                    <Input
                      id="displayModuleTitle"
                      value={formData.displayModuleTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('displayModuleTitle', e.target.value)}
                      placeholder="积分奖励说明"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="displayBasicValue" className="text-sm font-medium">基础奖励</label>
                      <textarea
                        id="displayBasicValue"
                        value={formData.displayBasicValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('displayBasicValue', e.target.value)}
                        placeholder="基础奖励说明"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="displayAdvancedValue" className="text-sm font-medium">进阶奖励</label>
                      <textarea
                        id="displayAdvancedValue"
                        value={formData.displayAdvancedValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('displayAdvancedValue', e.target.value)}
                        placeholder="进阶奖励说明"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="displayStatementTitle" className="text-sm font-medium">声明标题</label>
                      <Input
                        id="displayStatementTitle"
                        value={formData.displayStatementTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('displayStatementTitle', e.target.value)}
                        placeholder="用户声明"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="displayStatementDescription" className="text-sm font-medium">声明描述</label>
                      <textarea
                        id="displayStatementDescription"
                        value={formData.displayStatementDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('displayStatementDescription', e.target.value)}
                        placeholder="声明描述内容"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </>
              )}

              {(formData.rewardType === '优惠券' || formData.rewardType === '商品') && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="displayModuleTitle" className="text-sm font-medium">模块标题</label>
                    <Input
                      id="displayModuleTitle"
                      value={formData.displayModuleTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('displayModuleTitle', e.target.value)}
                      placeholder={`${formData.rewardType}奖励说明`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="displayBasicValue" className="text-sm font-medium">基础奖励</label>
                      <textarea
                        id="displayBasicValue"
                        value={formData.displayBasicValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('displayBasicValue', e.target.value)}
                        placeholder="基础奖励说明"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="displayAdvancedValue" className="text-sm font-medium">进阶奖励</label>
                      <textarea
                        id="displayAdvancedValue"
                        value={formData.displayAdvancedValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('displayAdvancedValue', e.target.value)}
                        placeholder="进阶奖励说明"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="displayStatementTitle" className="text-sm font-medium">声明标题</label>
                      <Input
                        id="displayStatementTitle"
                        value={formData.displayStatementTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('displayStatementTitle', e.target.value)}
                        placeholder="用户声明"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="displayStatementDescription" className="text-sm font-medium">声明描述</label>
                      <textarea
                        id="displayStatementDescription"
                        value={formData.displayStatementDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('displayStatementDescription', e.target.value)}
                        placeholder="声明描述内容"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Extra Rewards Toggle - Only show for points rewards */}
            {formData.rewardType === '积分' && (
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
            )}

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
                {formData.rewardType === '积分' && (
                  <>
                    <li>• 积分预算应与任务总量相匹配，确保奖励资金充足</li>
                    <li>• 基础积分设置应考虑任务难度和工作量</li>
                  </>
                )}
                {formData.rewardType !== '积分' && (
                  <>
                    <li>• {formData.rewardType}奖励设置将决定用户获得的相应权益</li>
                    <li>• 请确保奖励库存充足，避免无法兑现</li>
                  </>
                )}
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
            <MobilePreview formData={formData} autoDistribute={autoDistribute} />

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

      {/* Material Selection Modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full mx-6 h-[85vh] flex flex-col overflow-hidden">
            {/* Header - Fixed */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">选择任务素材</h3>
                </div>
                <button
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Comprehensive Search and Filters - Fixed */}
            <div className="p-4 border-b bg-gray-50">
              <div className="grid grid-cols-6 gap-3 mb-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">综合搜索</label>
                  <Input
                    placeholder="素材名称、内容关键词..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">空间</label>
                  <select
                    value={filterSpace}
                    onChange={(e) => setFilterSpace(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm bg-white h-8 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部空间</option>
                    <option value="公司资源">公司资源</option>
                    <option value="部门共享">部门共享</option>
                    <option value="个人素材">个人素材</option>
                    <option value="项目专用">项目专用</option>
                    <option value="系统模版">系统模版</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">类型</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm bg-white h-8 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部类型</option>
                    <option value="image">图文</option>
                    <option value="video">视频</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">标签</label>
                  <select
                    value={filterTags}
                    onChange={(e) => setFilterTags(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm bg-white h-8 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部标签</option>
                    <option value="热销">热销</option>
                    <option value="新品">新品</option>
                    <option value="明星产品">明星产品</option>
                    <option value="客户好评">客户好评</option>
                    <option value="技术支持">技术支持</option>
                    <option value="创意设计">创意设计</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">分类</label>
                  <select
                    value={filterCategories}
                    onChange={(e) => setFilterCategories(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm bg-white h-8 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部分类</option>
                    <option value="品牌">品牌</option>
                    <option value="产品">产品</option>
                    <option value="营销">营销</option>
                    <option value="用户">用户</option>
                    <option value="培训">培训</option>
                    <option value="活动">活动</option>
                    <option value="资料">资料</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">发布状态</label>
                  <select
                    value={filterPublishCombined}
                    onChange={(e) => setFilterPublishCombined(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm bg-white h-8 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部素材</option>
                    <optgroup label="已发布">
                      <option value="wechat-published">微信</option>
                      <option value="douyin-published">抖音</option>
                      <option value="weibo-published">微博</option>
                    </optgroup>
                    <option value="occupied">已占用</option>
                    <option value="unpublished">未发布</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enhanced Material Selection Table */}
            <div className="flex-1 overflow-x-auto bg-white">
              <div className="min-w-0">
                {(() => {
                  // 过滤符合当前筛选条件的素材
                  let allVisibleAssets = availableAssets.filter(asset => {
                    const matchesSearch = searchQuery === '' ||
                      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      asset.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      asset.creator.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesSpace = filterSpace === 'all' || asset.space === filterSpace;
                    const matchesType = filterType === 'all' || asset.type === filterType;
                    const matchesCategory = filterCategories === 'all' || asset.category === filterCategories;
                    const matchesTags = filterTags === 'all' || asset.tags.some(tag => tag === filterTags);

                    // Unified publish status and platform filtering
                    let matchesPublishCombined = true;
                    if (filterPublishCombined !== 'all') {
                      switch (filterPublishCombined) {
                        case 'wechat-published':
                          matchesPublishCombined = asset.status === 'published' && asset.publishedPlatforms.includes('微信');
                          break;
                        case 'douyin-published':
                          matchesPublishCombined = asset.status === 'published' && asset.publishedPlatforms.includes('抖音');
                          break;
                        case 'weibo-published':
                          matchesPublishCombined = asset.status === 'published' && asset.publishedPlatforms.includes('微博');
                          break;
                        case 'occupied':
                          matchesPublishCombined = asset.status === 'occupied';
                          break;
                        case 'unpublished':
                          matchesPublishCombined = asset.status === 'unpublished';
                          break;
                        default:
                          matchesPublishCombined = true;
                      }
                    }

                    return matchesSearch && matchesSpace && matchesType && matchesCategory && matchesTags && matchesPublishCombined;
                  });

                  // 如果开启了"仅显示已选中"，则只显示选中的素材，并按选择顺序排序
                  if (showOnlySelected) {
                    const selectedAssets = availableAssets.filter(asset =>
                      selectedMaterials.includes(asset.name)
                    );
                    // 按选择顺序排序：先选择的项目在前，后选择的项目在后
                    allVisibleAssets = selectedMaterialsOrder
                      .map(name => selectedAssets.find(asset => asset.name === name))
                      .filter((asset): asset is typeof availableAssets[0] => asset !== undefined);
                  }

                  if (allVisibleAssets.length === 0) {
                    return (
                      <div className="flex items-center justify-center py-12 text-gray-500">
                        <div className="text-center">
                          <p className="text-lg mb-2">没有找到匹配的素材</p>
                          <p className="text-sm text-gray-400">尝试调整搜索条件</p>
                        </div>
                      </div>
                    );
                  }

                  // Pagination logic
                  const totalItems = allVisibleAssets.length;
                  const totalPages = Math.ceil(totalItems / itemsPerPage);
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const currentAssets = allVisibleAssets.slice(startIndex, endIndex);

                  return (
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                          <th className="px-3 py-4 text-center w-10">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (checked) {
                                  selectAllCurrentPage();
                                } else {
                                  deselectAllCurrentPage();
                                }
                              }}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-3 py-4 text-center text-sm font-medium text-gray-600 w-14">类型</th>
                          <th className="px-3 py-4 text-center text-sm font-medium text-gray-600 w-14">封面</th>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-600 flex-1 min-w-[280px]">标题与内容</th>
                          <th className="px-3 py-4 text-center text-sm font-medium text-gray-600 w-24">标签</th>
                          <th className="px-3 py-4 text-center text-sm font-medium text-gray-600 w-18">分类</th>
                          <th className="px-3 py-4 text-center text-sm font-medium text-gray-600 w-22">发布状态</th>
                          <th className="px-3 py-4 text-center text-sm font-medium text-gray-600 w-24">创建信息</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentAssets.map((asset) => (
                          <tr
                            key={asset.id}
                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                              selectedMaterials.includes(asset.name) ? 'bg-blue-50' : ''
                            }`}
                            onClick={(e) => {
                              // Only toggle if not clicking on checkbox (avoid double-trigger)
                              if ((e.target as HTMLInputElement).type !== 'checkbox') {
                                toggleMaterialSelection(asset);
                              }
                            }}
                          >
                            {/* Checkbox */}
                            <td className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedMaterials.includes(asset.name)}
                                onChange={() => toggleMaterialSelection(asset)}
                                className="h-4 w-4 text-blue-600 rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>

                            {/* Type */}
                            <td className="px-4 py-4 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 whitespace-nowrap">
                                {asset.type === 'video' ? '视频' : '图文'}
                              </span>
                            </td>

                            {/* Cover/Thumbnail */}
                            <td className="px-4 py-4 text-center">
                              {asset.type === 'image' ? (
                                <img
                                  src={asset.imageUrl || '/placeholder.svg'}
                                  alt={asset.name}
                                  className="w-10 h-8 object-cover rounded border mx-auto"
                                />
                              ) : asset.type === 'video' ? (
                                <div className="w-10 h-8 bg-gray-300 rounded flex items-center justify-center mx-auto border">
                                  <span className="text-xs font-medium text-gray-600">视频</span>
                                </div>
                              ) : (
                                <div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center mx-auto border">
                                  <span className="text-xs font-medium text-gray-500 uppercase">
                                    {asset.type.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Title and Content combined */}
                            <td className="px-4 py-4">
                              <div className="space-y-1 min-w-[300px]">
                                {/* Title - First row */}
                                <div className="text-sm font-medium truncate" title={asset.name}>
                                  {asset.name}
                                </div>
                                {/* Content - Second row, limited to 30 chars */}
                                <div className="text-xs text-gray-600 cursor-help"
                                     title={asset.content}
                                     onMouseEnter={(e) => {
                                       // Create tooltip on hover
                                       const tooltip = document.createElement('div');
                                       tooltip.className = 'fixed z-50 bg-gray-900 text-white text-sm p-3 rounded-lg shadow-lg max-w-md break-words';
                                       tooltip.textContent = asset.content;
                                       tooltip.style.left = `${e.pageX + 10}px`;
                                       tooltip.style.top = `${e.pageY + 10}px`;
                                       document.body.appendChild(tooltip);

                                       const handleMouseLeave = () => {
                                         if (document.body.contains(tooltip)) {
                                           document.body.removeChild(tooltip);
                                         }
                                       };

                                       e.currentTarget?.addEventListener('mouseleave', handleMouseLeave);
                                     }}>
                                  {asset.content.length > 30 ? asset.content.substring(0, 30) + '...' : asset.content}
                                </div>
                              </div>
                            </td>

                            {/* Tags */}
                            <td className="px-4 py-4 text-center">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {asset.tags.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {asset.tags.length > 2 && (
                                  <span className="text-xs text-gray-500">+{asset.tags.length - 2}</span>
                                )}
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-4 text-center">
                              <span className="text-xs text-gray-600 whitespace-nowrap">
                                {asset.category}
                              </span>
                            </td>

                            {/* Publish Status */}
                            <td className="px-4 py-4 text-center">
                              {asset.status === 'published' ? (
                                <div className="text-center">
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap cursor-pointer hover:bg-green-200 transition-colors"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      // Create a temporary feedback text element
                                      const feedbackText = document.createElement('div');
                                      feedbackText.textContent = '✓ 已复制';
                                      feedbackText.className = 'fixed text-xs bg-green-600 text-white px-2 py-1 rounded z-[1001] pointer-events-none';
                                      feedbackText.style.left = `${e.pageX + 10}px`;
                                      feedbackText.style.top = `${e.pageY - 5}px`;
                                      feedbackText.style.opacity = '0';
                                      feedbackText.style.transition = 'opacity 0.2s ease';
                                      document.body.appendChild(feedbackText);

                                      try {
                                        await navigator.clipboard.writeText(asset.taskId!);
                                        // Fade in, then fade out and remove
                                        requestAnimationFrame(() => {
                                          feedbackText.style.opacity = '1';
                                          setTimeout(() => {
                                            feedbackText.style.opacity = '0';
                                            setTimeout(() => {
                                              if (document.body.contains(feedbackText)) {
                                                document.body.removeChild(feedbackText);
                                              }
                                            }, 200);
                                          }, 1500);
                                        });
                                      } catch (error) {
                                        console.error('复制失败:', error);
                                        feedbackText.textContent = '✗ 复制失败';
                                        feedbackText.style.backgroundColor = '#dc2626';
                                        feedbackText.style.opacity = '1';
                                        setTimeout(() => {
                                          feedbackText.style.opacity = '0';
                                          setTimeout(() => {
                                            if (document.body.contains(feedbackText)) {
                                              document.body.removeChild(feedbackText);
                                            }
                                          }, 200);
                                        }, 2000);
                                      }
                                    }}
                                    onMouseEnter={(e) => {
                                      // First check if tooltip already exists
                                      const existingTooltip = document.querySelector(`.tooltip-published-${asset.id}`);
                                      if (existingTooltip) return;

                                      const tooltip = document.createElement('div');
                                      tooltip.className = `fixed z-[1000] bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs break-words tooltip-published-${asset.id}`;
                                      tooltip.style.left = `${e.pageX + 10}px`;
                                      tooltip.style.top = `${e.pageY + 10}px`;
                                      tooltip.style.position = 'fixed';

                                      // Create clickable tooltip content (same as occupied logic)
                                      tooltip.innerHTML = '';
                                      const taskIdSpan = document.createElement('span');
                                      taskIdSpan.textContent = asset.taskId!;
                                      taskIdSpan.className = 'cursor-pointer underline hover:text-blue-400 select-none';
                                      taskIdSpan.onclick = async (event) => {
                                        event.stopPropagation();
                                        await navigator.clipboard.writeText(asset.taskId!);

                                        // Show small feedback text near cursor
                                        const feedbackText = document.createElement('div');
                                        feedbackText.textContent = '✓ 已复制';
                                        feedbackText.className = 'fixed text-xs bg-green-600 text-white px-2 py-1 rounded z-[1001] pointer-events-none';
                                        feedbackText.style.left = `${event.pageX + 10}px`;
                                        feedbackText.style.top = `${event.pageY - 5}px`;
                                        feedbackText.style.opacity = '0';
                                        feedbackText.style.transition = 'opacity 0.2s ease';

                                        document.body.appendChild(feedbackText);

                                        // Fade in, then fade out and remove
                                        requestAnimationFrame(() => {
                                          feedbackText.style.opacity = '1';
                                          setTimeout(() => {
                                            feedbackText.style.opacity = '0';
                                            setTimeout(() => {
                                              if (document.body.contains(feedbackText)) {
                                                document.body.removeChild(feedbackText);
                                              }
                                            }, 200);
                                          }, 1500);
                                        });
                                      };
                                      tooltip.appendChild(taskIdSpan);

                                      document.body.appendChild(tooltip);

                                      // Add mouse enter event to tooltip (same as occupied logic)
                                      tooltip.addEventListener('mouseenter', () => {
                                        // Keep tooltip visible when mouse enters it
                                        clearTimeout((tooltip as any)._removeTimeout);
                                      });

                                      // Add mouse leave event to tooltip
                                      tooltip.addEventListener('mouseleave', () => {
                                        // Delay removal when mouse leaves tooltip
                                        (tooltip as any)._removeTimeout = setTimeout(() => {
                                          if (document.body.contains(tooltip)) {
                                            document.body.removeChild(tooltip);
                                          }
                                        }, 200);
                                      });

                                      const handleMouseLeave = (leaveEvent: MouseEvent) => {
                                        // Check if mouse is moving towards tooltip
                                        const tooltipRect = tooltip.getBoundingClientRect();
                                        const mouseX = leaveEvent.clientX;
                                        const mouseY = leaveEvent.clientY;

                                        // Give some buffer around tooltip for mouse movement
                                        const extendedRect = {
                                          left: tooltipRect.left - 10,
                                          right: tooltipRect.right + 10,
                                          top: tooltipRect.top - 10,
                                          bottom: tooltipRect.bottom + 10
                                        };

                                        const mouseInExtended_area = mouseX >= extendedRect.left &&
                                                                     mouseX <= extendedRect.right &&
                                                                     mouseY >= extendedRect.top &&
                                                                     mouseY <= extendedRect.bottom;

                                        if (!mouseInExtended_area) {
                                          // Only remove if mouse is not moving towards tooltip
                                          (tooltip as any)._removeTimeout = setTimeout(() => {
                                            if (document.body.contains(tooltip)) {
                                              document.body.removeChild(tooltip);
                                            }
                                          }, 300);
                                        }
                                      };

                                      e.currentTarget?.addEventListener('mouseleave', handleMouseLeave);

                                      // Store event listeners for cleanup
                                      (e.currentTarget as any)._currentTooltip = tooltip;
                                      (e.currentTarget as any)._handleMouseLeave = handleMouseLeave;
                                    }}
                                  >
                                    已发布
                                  </span>
                                  {asset.publishedPlatforms.length > 0 && (
                                    <span className="block text-xs text-gray-500 mt-1 whitespace-nowrap">
                                      {asset.publishedPlatforms.slice(0, 2).join('/')}
                                      {asset.publishedPlatforms.length > 2 && '+' + (asset.publishedPlatforms.length - 2)}
                                    </span>
                                  )}
                                </div>
                              ) : asset.status === 'occupied' ? (
                                <div className="text-center">
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap cursor-pointer hover:bg-blue-200 transition-colors"
                                    onMouseEnter={(e) => {
                                      // First check if tooltip already exists
                                      const existingTooltip = document.querySelector(`.tooltip-${asset.id}`);
                                      if (existingTooltip) return;

                                      const tooltip = document.createElement('div');
                                      tooltip.className = `fixed z-[1000] bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs break-words tooltip-${asset.id}`;
                                      tooltip.style.left = `${e.pageX + 10}px`;
                                      tooltip.style.top = `${e.pageY + 10}px`;
                                      tooltip.style.position = 'fixed';

                                      // Create clickable task IDs
                                      const createTooltipContent = () => {
                                        tooltip.innerHTML = '';
                                        const prefix = document.createElement('span');
                                        prefix.textContent = '占用：';
                                        prefix.style.color = '#d1d5db'; // Light gray
                                        tooltip.appendChild(prefix);

                                        asset.occupiedTasks.forEach((taskId, index) => {
                                          if (index > 0) {
                                            const space = document.createElement('span');
                                            space.textContent = '  ';
                                            tooltip.appendChild(space);
                                          }

                                          const taskIdSpan = document.createElement('span');
                                          taskIdSpan.textContent = taskId;
                                          taskIdSpan.className = 'cursor-pointer underline hover:text-blue-400 select-none';
                                          taskIdSpan.style.color = '#3b82f6';
                                          taskIdSpan.onclick = async (event) => {
                                            event.stopPropagation();
                                            await navigator.clipboard.writeText(taskId);

                                            // Show small feedback text near cursor
                                            const feedbackText = document.createElement('div');
                                            feedbackText.textContent = '✓ 已复制';
                                            feedbackText.className = 'fixed text-xs bg-green-600 text-white px-2 py-1 rounded z-[1001] pointer-events-none';
                                            feedbackText.style.left = `${event.pageX + 10}px`;
                                            feedbackText.style.top = `${event.pageY - 5}px`;
                                            feedbackText.style.opacity = '0';
                                            feedbackText.style.transition = 'opacity 0.2s ease';

                                            document.body.appendChild(feedbackText);

                                            // Fade in, then fade out and remove
                                            requestAnimationFrame(() => {
                                              feedbackText.style.opacity = '1';
                                              setTimeout(() => {
                                                feedbackText.style.opacity = '0';
                                                setTimeout(() => {
                                                  if (document.body.contains(feedbackText)) {
                                                    document.body.removeChild(feedbackText);
                                                  }
                                                }, 200);
                                              }, 1500);
                                            });
                                          };
                                          tooltip.appendChild(taskIdSpan);
                                        });
                                      };

                                      createTooltipContent();
                                      document.body.appendChild(tooltip);

                                      // Add mouse enter event to tooltip
                                      tooltip.addEventListener('mouseenter', () => {
                                        // Keep tooltip visible when mouse enters it
                                        clearTimeout((tooltip as any)._removeTimeout);
                                      });

                                      // Add mouse leave event to tooltip
                                      tooltip.addEventListener('mouseleave', () => {
                                        // Delay removal when mouse leaves tooltip
                                        (tooltip as any)._removeTimeout = setTimeout(() => {
                                          if (document.body.contains(tooltip)) {
                                            document.body.removeChild(tooltip);
                                          }
                                        }, 200);
                                      });

                                      const handleMouseLeave = (leaveEvent: MouseEvent) => {
                                        // Check if mouse is moving towards tooltip
                                        const tooltipRect = tooltip.getBoundingClientRect();
                                        const mouseX = leaveEvent.clientX;
                                        const mouseY = leaveEvent.clientY;

                                        // Give some buffer around tooltip for mouse movement
                                        const extendedRect = {
                                          left: tooltipRect.left - 10,
                                          right: tooltipRect.right + 10,
                                          top: tooltipRect.top - 10,
                                          bottom: tooltipRect.bottom + 10
                                        };

                                        const mouseInExtended_area = mouseX >= extendedRect.left &&
                                                                     mouseX <= extendedRect.right &&
                                                                     mouseY >= extendedRect.top &&
                                                                     mouseY <= extendedRect.bottom;

                                        if (!mouseInExtended_area) {
                                          // Only remove if mouse is not moving towards tooltip
                                          (tooltip as any)._removeTimeout = setTimeout(() => {
                                            if (document.body.contains(tooltip)) {
                                              document.body.removeChild(tooltip);
                                            }
                                          }, 300);
                                        }
                                      };

                                      e.currentTarget?.addEventListener('mouseleave', handleMouseLeave);

                                      // Store event listeners for cleanup
                                      (e.currentTarget as any)._currentTooltip = tooltip;
                                      (e.currentTarget as any)._handleMouseLeave = handleMouseLeave;
                                    }}
                                    onMouseLeave={(e) => {
                                      // Clean up any existing tooltip (this won't be called due to the listener above)
                                      // This is just a placeholder to maintain event flow
                                    }}
                                  >
                                    已占用
                                  </span>
                                  {asset.publishedPlatforms.length > 0 && (
                                    <span className="block text-xs text-gray-500 mt-1 whitespace-nowrap">
                                      {asset.publishedPlatforms.slice(0, 2).join('/')}
                                      {asset.publishedPlatforms.length > 2 && '+' + (asset.publishedPlatforms.length - 2)}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                                  未发布
                                </span>
                              )}
                            </td>

                            {/* Creator and Date combined - 创建信息 */}
                            <td className="px-4 py-4 text-center">
                              <div>
                                <div className="text-xs text-gray-600 font-medium whitespace-nowrap mb-1">
                                  {asset.creator}
                                </div>
                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(asset.createdAt).toLocaleDateString('zh-CN')}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              {/* Pagination */}
              {(() => {
                const filteredAssets = availableAssets.filter(asset => {
                  // First check if only showing selected items
                  if (showOnlySelected) {
                    const isSelected = selectedMaterials.includes(asset.name);
                    if (!isSelected) return false;
                  }

                  const matchesSearch = searchQuery === '' ||
                    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    asset.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    asset.creator.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesSpace = filterSpace === 'all' || asset.space === filterSpace;
                  const matchesType = filterType === 'all' || asset.type === filterType;
                  const matchesCategory = filterCategories === 'all' || asset.category === filterCategories;
                  const matchesTags = filterTags === 'all' || asset.tags.some(tag => tag === filterTags);

                  // Unified publish status and platform filtering
                  let matchesPublishCombined = true;
                  if (filterPublishCombined !== 'all') {
                    switch (filterPublishCombined) {
                      case 'wechat-published':
                        matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('微信');
                        break;
                      case 'douyin-published':
                        matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('抖音');
                        break;
                      case 'weibo-published':
                        matchesPublishCombined = asset.isPublished && asset.publishedPlatforms.includes('微博');
                        break;
                      case 'unpublished':
                        matchesPublishCombined = !asset.isPublished;
                        break;
                      default:
                        matchesPublishCombined = true;
                    }
                  }

                  return matchesSearch && matchesSpace && matchesType && matchesCategory && matchesTags && matchesPublishCombined;
                });

                const selectedAssets = availableAssets.filter(asset =>
                  selectedMaterials.includes(asset.name)
                );

                const allVisibleAssets = [...filteredAssets];
                selectedAssets.forEach(asset => {
                  if (!allVisibleAssets.find(a => a.name === asset.name)) {
                    allVisibleAssets.unshift(asset);
                  }
                });

                allVisibleAssets.sort((a, b) => {
                  const aSelected = selectedMaterials.includes(a.name);
                  const bSelected = selectedMaterials.includes(b.name);
                  if (aSelected && !bSelected) return -1;
                  if (!aSelected && bSelected) return 1;
                  return 0;
                });

                const totalItems = allVisibleAssets.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);

                if (totalPages <= 1) return null;

                const getVisiblePages = () => {
                  const delta = 2;
                  const range = [];
                  const rangeWithDots = [];

                  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                    range.push(i);
                  }

                  if (currentPage - delta > 2) {
                    rangeWithDots.push(1, '...');
                  } else {
                    rangeWithDots.push(1);
                  }

                  rangeWithDots.push(...range);

                  if (currentPage + delta < totalPages - 1) {
                    rangeWithDots.push('...', totalPages);
                  } else if (totalPages > 1) {
                    rangeWithDots.push(totalPages);
                  }

                  return rangeWithDots;
                };

                return (
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
                    <div className="text-sm text-gray-600">
                      显示 {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} 条，共 {totalItems} 条记录
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* First page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        ««
                      </Button>

                      {/* Previous page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        ‹
                      </Button>

                      {/* Page numbers */}
                      {getVisiblePages().map((page, index) => (
                        <Button
                          key={`${page}-${index}`}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => typeof page === 'number' && setCurrentPage(page)}
                          disabled={page === '...'}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}

                      {/* Next page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        ›
                      </Button>

                      {/* Last page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        »»
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>



            {/* Footer - Fixed */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  已选择 {selectedMaterials.length} 个素材
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-only-selected-footer"
                    checked={showOnlySelected}
                    onChange={(e) => setShowOnlySelected(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="show-only-selected-footer" className="text-sm font-medium cursor-pointer">
                    仅显示已选中
                  </label>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setIsMaterialModalOpen(false)}
                  variant="outline"
                >
                  取消
                </Button>
                <Button
                  onClick={handleMaterialModalConfirm}
                  disabled={selectedMaterials.length === 0}
                >
                  确认选择
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MdSmartphone, MdWeb, MdApps, MdOutlinePlayArrow, MdPalette, MdCheckCircle, MdBusinessCenter, MdQuestionAnswer,
         MdArrowBack, MdShare, MdTask, MdGroup, MdDateRange, MdLibraryBooks, MdAttachFile, MdEmojiObjects, MdWarning,
         MdPhotoCamera, MdAccessTime, MdEmojiEvents, MdFolder, MdRocket } from 'react-icons/md';
import { FaFire, FaWeixin, FaTiktok, FaWeibo } from 'react-icons/fa';

interface MobilePreviewProps {
  formData: {
    taskName: string;
    taskType: string;
    taskPlatform: string;
    taskImage: string;
    ruleDescription: string;
    executionFlowDescription: string;
    pointsBudget: string;
    basicRewardPoints: string;
    pointsModuleTitle: string;
    pointsBasicValue: string;
    pointsAdvancedValue: string;
    statementTitle: string;
    statementDescription: string;
    taskTheme: string;
    taskCycle: string;
    claimStartTime: string;
    claimEndTime: string;
    taskMaterial: string;
    totalTasks: string;
  };
  autoDistribute: boolean;
}

const getPlatformIcon = (platform: string) => {
  const icons = {
    '微信': FaWeixin,
    '抖音': FaTiktok,
    '微博': FaWeibo,
  };
  return icons[platform as keyof typeof icons] || FaWeixin;
};

const getTypeIcon = (type: string) => {
  const icons = {
    '原创任务': MdPalette,
    '验证任务': MdCheckCircle,
    '调研任务': MdBusinessCenter,
    '互动任务': MdQuestionAnswer,
  };
  return icons[type as keyof typeof icons] || MdPalette;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function MobilePreview({ formData, autoDistribute }: MobilePreviewProps) {
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <div className="bg-white border-2 border-gray-300 rounded-[2rem] overflow-hidden shadow-2xl mx-auto w-80 h-[600px] flex flex-col">
      {/* Mobile Header - 模拟手机状态栏 */}
      <div className="h-6 bg-black flex items-center justify-center relative">
        <div className="text-white text-xs">9:41</div>
        <div className="absolute right-2 w-16 h-3 bg-black border rounded-full flex items-center justify-center">
          <div className="w-10 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
          {formData.taskImage ? (
            <img
              src={formData.taskImage}
              alt="任务图片"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center">
              <MdPhotoCamera className="text-white text-4xl opacity-50" />
            </div>
          )}
          {/* Overlay for better text readability */}
          {formData.taskImage && (
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          )}

          {/* Back Button */}
          <button className="absolute top-2 left-2 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Share Button */}
          <button className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        {/* Title Bar */}
        <div className="px-4 py-3 border-b bg-white">
          {/* Task Name - Full Width */}
          <div className="mb-3">
            <h1 className="font-bold text-lg leading-tight">
              {formData.taskName || '精彩任务名称'}
            </h1>
          </div>

          {/* Platform Icon and Task Type */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                {React.createElement(getPlatformIcon(formData.taskPlatform), {
                  size: 20,
                  color: '#6b7280'
                })}
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-1">
                原创任务
              </Badge>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MdAccessTime size={12} />
              <span>截止 {formatDate(formData.claimEndTime) || '待定'}</span>
            </div>
          </div>

          {/* Participation Stats - New Line */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-center gap-6 text-xs mb-2">
              <div className="flex flex-col items-center">
                <span className="text-red-700 font-bold text-sm">{formData.totalTasks || '10'}</span>
                <span className="text-red-600 text-xs">总共任务</span>
              </div>
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
              <div className="flex flex-col items-center">
                <span className="text-red-700 font-bold text-sm">3</span>
                <span className="text-red-600 text-xs">已领取</span>
              </div>
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
              <div className="flex flex-col items-center">
                <span className="text-red-700 font-bold text-sm">{Math.max(0, parseInt(formData.totalTasks || '10') - 3)}</span>
                <span className="text-red-600 text-xs">还剩</span>
              </div>
            </div>
            <div className="text-xs text-red-500 text-center">
              🔥 机会难得，立即抢领！
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none h-12 bg-gray-50 border-b">
            <TabsTrigger
              value="activity"
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              活动
            </TabsTrigger>
            <TabsTrigger
              value="material"
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              素材
            </TabsTrigger>
            <TabsTrigger
              value="statement"
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              声明
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Activity Tab */}
            <TabsContent value="activity" className="flex-1 px-4 py-3 mt-0 space-y-4 h-full">
              {/* Task Info */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                    {React.createElement(getTypeIcon(formData.taskType), {
                      size: 24,
                      color: 'white'
                    })}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {formData.taskType || '活动类型'}
                    </p>
                    <p className="text-xs text-blue-600">
                      {formData.taskTheme || '任务主题'} • {formData.taskCycle || '任务周期'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reward Section */}
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90 mb-1">奖励积分</p>
                    <p className="text-2xl font-bold">{formData.pointsBudget || '0'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-90 mb-1">基础奖励</p>
                    <p className="text-lg font-semibold">+{formData.basicRewardPoints || '0'}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs opacity-90 flex items-center gap-1">
                  <MdEmojiEvents size={12} />
                  <span>完成任务即可获得，优质作品可额外奖励</span>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-sm mb-2">活动要求</h3>
                  <div className="text-xs text-gray-600 whitespace-pre-line">
                    {formData.ruleDescription || '暂无活动要求'}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm mb-2">执行流程</h3>
                  <div className="text-xs text-gray-600 whitespace-pre-line">
                    {formData.executionFlowDescription || '暂无执行流程'}
                  </div>
                </div>

                {/* Time Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="font-medium text-gray-900">开始时间</p>
                    <p className="text-gray-600">{formatDate(formData.claimStartTime) || '未设置'}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="font-medium text-gray-900">结束时间</p>
                    <p className="text-gray-600">{formatDate(formData.claimEndTime) || '未设置'}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pb-4">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2">
                  <MdRocket size={16} />
                  <span>立即参与 ({formData.totalTasks && `${formData.totalTasks}份任务`})</span>
                </button>
              </div>
            </TabsContent>

            {/* Material Tab */}
            <TabsContent value="material" className="flex-1 px-4 py-3 mt-0 h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <MdLibraryBooks size={16} />
                  </div>
                  <h3 className="font-medium">任务素材</h3>
                </div>

                {(() => {
                  const materialData = formData.taskMaterial ? JSON.parse(formData.taskMaterial) : null;
                  const hasMaterials = materialData && materialData.materialsData && materialData.materialsData.length > 0;

                  if (hasMaterials) {
                    // 显示素材内容
                    return (
                      <div className="space-y-4">
                        {materialData.materialsData.map((material: any, index: number) => (
                          <div key={material.name} className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                            <div className="flex items-center gap-3 p-3 border-b border-green-200">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                                {material.type === 'image' ? '图' : material.type === 'video' ? '视' : '文'}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-green-900">{material.name}</p>
                                <p className="text-xs text-green-700">{material.description}</p>
                              </div>
                            </div>
                            <div className="p-4">
                              {material.type === 'image' && material.url && (
                                <div className="relative">
                                  <img
                                    src={material.url}
                                    alt={material.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                    <span className="text-gray-500 text-sm">图片加载失败</span>
                                  </div>
                                </div>
                              )}
                              {material.type === 'video' && material.url && (
                                <div className="relative">
                                  <video
                                    src={material.url}
                                    controls
                                    className="w-full h-48 object-cover rounded-lg"
                                    poster={material.thumbnail}
                                    onError={(e) => {
                                      const target = e.target as HTMLVideoElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  >
                                    您的浏览器不支持视频播放。
                                  </video>
                                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                    <span className="text-gray-500 text-sm">视频加载失败</span>
                                  </div>
                                  {/* 视频时长显示 */}
                                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                    {material.duration || '00:00'}
                                  </div>
                                </div>
                              )}
                              {material.type === 'document' && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <MdAttachFile size={24} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{material.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">点击下载查看完整文档</p>
                                  </div>
                                </div>
                              )}
                              {index < materialData.materialsData.length - 1 && (
                                <div className="mt-3 pt-3 border-t border-green-200"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    // 无素材状态
                    return (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <MdFolder className="text-3xl mb-2 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-500">暂无任务素材</p>
                        <p className="text-xs text-gray-400 mt-1">请在表单中添加素材说明</p>
                      </div>
                    );
                  }
                })()}

                {/* Suggested Actions */}
                {!autoDistribute && (
                  <div className="space-y-2">
                    <button className="w-full bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                      <MdAttachFile size={16} />
                      <span>查看附件资料</span>
                    </button>
                    <button className="w-full bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                      <MdEmojiObjects size={16} />
                      <span>参考示例作品</span>
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Statement Tab */}
            <TabsContent value="statement" className="flex-1 px-4 py-3 mt-0 h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <MdWarning size={16} />
                  </div>
                  <h3 className="font-medium">重要声明</h3>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-orange-900 mb-2">
                    {formData.statementTitle || '用户声明'}
                  </h4>
                  <div className="text-xs text-orange-800 whitespace-pre-line">
                    {formData.statementDescription || '暂无声明内容'}
                  </div>
                </div>

                {/* Points Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    {formData.pointsModuleTitle || '积分奖励说明'}
                  </h4>
                  <div className="space-y-2 text-xs text-blue-800">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <div className="whitespace-pre-line">
                        {formData.pointsBasicValue || '基础积分说明'}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <div className="whitespace-pre-line">
                        {formData.pointsAdvancedValue || '进阶积分说明'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-gray-500">总任务量</p>
                    <p className="font-medium">{formData.totalTasks || '0'} 份</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">积分预算</p>
                    <p className="font-medium">{formData.pointsBudget || '0'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Mobile Bottom Indicator */}
      <div className="h-1 bg-black rounded-b-[2rem]"></div>
    </div>
  );
}

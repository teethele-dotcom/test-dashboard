'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchInput } from '../search';
import { TasksTable } from '../tasks-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronUp, ChevronDown, X } from 'lucide-react';

export default function TasksPage() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      {/* 页面标题区域 - 已隐藏 */}
      <div className="hidden space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">任务管理</h1>
      </div>

      {/* 控制面板 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-background/50 p-4 rounded-lg border">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput />
          <div className="h-6 w-px bg-border" /> {/* 分割线 */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-32 px-3 py-2 border rounded-md text-sm bg-background hover:border-primary/50 focus:border-primary transition-colors"
            >
              <option value="">全部状态</option>
              <option value="待办">待办</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
            </select>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-36 px-3 py-2 border rounded-md text-sm bg-background hover:border-primary/50 focus:border-primary transition-colors"
            >
              <option value="">全部平台</option>
              <option value="微信小程序">微信小程序</option>
              <option value="H5页面">H5页面</option>
              <option value="Web应用">Web应用</option>
            </select>
            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="w-32 px-3 py-2 border rounded-md text-sm bg-background hover:border-primary/50 focus:border-primary transition-colors"
            >
              <option value="">全部创建人</option>
              <option value="张三">张三</option>
              <option value="李四">李四</option>
              <option value="王五">王五</option>
            </select>
          </div>
          {isMoreOpen && (
            <>
              <div className="h-6 w-px bg-border" /> {/* 分割线 */}
              <div className="flex items-center gap-2">
                <select className="w-28 px-3 py-2 border rounded-md text-sm bg-background hover:border-primary/50 focus:border-primary transition-colors">
                  <option>任务周期</option>
                  <option>1周</option>
                  <option>2周</option>
                  <option>3周</option>
                </select>
                <Button
                  onClick={() => {
                    setStatusFilter('');
                    setPlatformFilter('');
                    setCreatorFilter('');
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  重置
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="gap-2 transition-all"
          >
            高级筛选
            {isMoreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Link href="/tasks/new">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4" />
              新建任务
            </Button>
          </Link>
        </div>
      </div>

      {/* 数据表格 */}
      <TasksTable />
    </div>
  );
}

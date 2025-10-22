'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, Eye, Edit, MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskTotals {
  claimed: number;
  submitted: number;
  reviewed: number;
  completed: number;
}

interface Task {
  id: string;
  title: string;
  remark: string;
  status: '待办' | '进行中' | '已完成';
  platform: string;
  type: string;
  totalTasks: number;
  totals: TaskTotals;
  pointsBudget: number;
  pointsDistributed: number;
  cycle: string;
  startDate: string;
  endDate: string;
  publishTime: string;
  creator: string;
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: 'TK001',
    title: '用户注册页面优化',
    remark: '改善注册流程的用户体验',
    status: '已完成',
    platform: '微信小程序',
    type: '原创任务',
    totalTasks: 200,
    totals: {
      claimed: 150,
      submitted: 145,
      reviewed: 142,
      completed: 138
    },
    pointsBudget: 20000,
    pointsDistributed: 18400,
    cycle: '2周',
    startDate: '2024-01-01 09:00:00',
    endDate: '2024-01-15 18:00:00',
    publishTime: '2024-01-01 10:00:00',
    creator: '张三',
    createdAt: '2024-01-01 09:00:00'
  },
  {
    id: 'TK002',
    title: '商品详情页设计',
    remark: '重新设计商品展示页面',
    status: '进行中',
    platform: 'H5页面',
    type: '原创任务',
    totalTasks: 100,
    totals: {
      claimed: 80,
      submitted: 75,
      reviewed: 70,
      completed: 65
    },
    pointsBudget: 15000,
    pointsDistributed: 8500,
    cycle: '1周',
    startDate: '2024-01-02 10:00:00',
    endDate: '2024-01-09 17:00:00',
    publishTime: '2024-01-02 14:00:00',
    creator: '李四',
    createdAt: '2024-01-02 13:00:00'
  },
  {
    id: 'TK003',
    title: 'API接口开发',
    remark: '编写后端数据处理接口',
    status: '待办',
    platform: 'Web应用',
    type: '原创任务',
    totalTasks: 50,
    totals: {
      claimed: 0,
      submitted: 0,
      reviewed: 0,
      completed: 0
    },
    pointsBudget: 25000,
    pointsDistributed: 0,
    cycle: '3周',
    startDate: '2024-01-03 08:00:00',
    endDate: '2024-01-24 20:00:00',
    publishTime: '2024-01-03 16:00:00',
    creator: '王五',
    createdAt: '2024-01-03 15:00:00'
  },
];

export function TasksTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="hidden">
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table style={{ tableLayout: 'auto' }}>
            <TableHeader>
              <TableRow>
                <TableHead style={{ minWidth: '100px' }}>
                  任务ID
                  <ArrowUpDown className="inline h-4 w-4 ml-2" />
                </TableHead>
                <TableHead style={{ minWidth: '150px' }}>任务信息</TableHead>
                <TableHead style={{ minWidth: '80px' }}>
                  状态
                  <ArrowUpDown className="inline h-4 w-4 ml-2" />
                </TableHead>
                <TableHead style={{ minWidth: '100px' }}>平台信息</TableHead>
                <TableHead style={{ minWidth: '280px' }}>任务总量</TableHead>
                <TableHead style={{ minWidth: '120px' }}>积分预算</TableHead>
                <TableHead style={{ minWidth: '80px' }}>
                  任务周期
                  <ArrowUpDown className="inline h-4 w-4 ml-2" />
                </TableHead>
                <TableHead style={{ minWidth: '140px' }}>起止时间</TableHead>
                <TableHead style={{ minWidth: '100px' }}>
                  发布时间
                  <ArrowUpDown className="inline h-4 w-4 ml-2" />
                </TableHead>
                <TableHead style={{ minWidth: '120px' }}>创建信息</TableHead>
                <TableHead style={{ minWidth: '60px' }}>
                  <span className="sr-only">操作</span>
                </TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {mockTasks.map((task) => (
              <TableRow key={task.id} className="h-20 hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-mono">{task.id}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="space-y-1 max-w-36">
                    <p className="font-semibold text-sm leading-tight text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{task.remark}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant={
                    task.status === '已完成' ? 'default' :
                    task.status === '进行中' ? 'secondary' :
                    'outline'
                  } className="text-xs px-2 py-1 font-medium">
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-sm">
                    <p className="font-medium truncate max-w-24">{task.platform}</p>
                    <p className="text-xs text-muted-foreground font-normal">{task.type}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3 w-56">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <span>总数: {task.totalTasks}</span>
                      <div className="flex-1 bg-gray-200 rounded-sm h-1.5 max-w-8">
                        <div
                          className={`h-1.5 rounded-sm ${task.totals.completed / task.totalTasks > 0.95 ? 'bg-green-500' : task.totals.completed / task.totalTasks > 0.75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${(task.totals.completed / task.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                      <span>{Math.round((task.totals.completed / task.totalTasks) * 100)}%</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex gap-3 text-xs">
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1 flex-shrink-0"></span>
                          {task.totals.claimed}
                        </span>
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-1 flex-shrink-0"></span>
                          {task.totals.submitted}
                        </span>
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1 flex-shrink-0"></span>
                          {task.totals.reviewed}
                        </span>
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 flex-shrink-0"></span>
                          {task.totals.completed}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-xs">
                    <p className="font-medium leading-tight">{task.pointsBudget}</p>
                    <p className="text-muted-foreground leading-tight">已发: {task.pointsDistributed}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs">{task.cycle}</TableCell>
                <TableCell className="py-3 text-xs">
                  <div className="space-y-1">
                    <p>开始: {task.startDate}</p>
                    <p>结束: {task.endDate}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs">{task.publishTime}</TableCell>
                <TableCell className="py-3 text-xs">
                  <div className="space-y-1">
                    <p>{task.creator}</p>
                    <p>{task.createdAt}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">操作</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            显示 <strong>1-3</strong> 条，共 <strong>3</strong> 条
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              disabled
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              上一页
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              disabled
            >
              下一页
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}

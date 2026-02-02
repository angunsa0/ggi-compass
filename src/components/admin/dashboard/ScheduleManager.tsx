import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, X, Truck, Users } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  type: 'meeting' | 'delivery';
  description?: string;
}

interface ScheduleManagerProps {
  schedules: ScheduleItem[];
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
  onRemoveSchedule: (id: string) => void;
  isLoading?: boolean;
}

export function ScheduleManager({ schedules, onAddSchedule, onRemoveSchedule, isLoading }: ScheduleManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    title: '',
    type: 'meeting' as 'meeting' | 'delivery',
    description: '',
  });

  const handleAdd = () => {
    if (!newSchedule.date || !newSchedule.title) return;
    onAddSchedule(newSchedule);
    setNewSchedule({ date: '', title: '', type: 'meeting', description: '' });
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded w-40 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 border rounded-lg animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          주요 일정 관리
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
          className="min-h-[36px]"
        >
          <Plus className="h-4 w-4 mr-1" />
          일정 추가
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="p-4 border rounded-lg bg-muted/30 mb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                className="min-h-[44px]"
              />
              <select
                value={newSchedule.type}
                onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value as 'meeting' | 'delivery' })}
                className="h-11 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="meeting">미팅</option>
                <option value="delivery">납품</option>
              </select>
            </div>
            <Input
              placeholder="일정 제목"
              value={newSchedule.title}
              onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
              className="min-h-[44px]"
            />
            <Input
              placeholder="메모 (선택)"
              value={newSchedule.description}
              onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
              className="min-h-[44px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                취소
              </Button>
              <Button size="sm" onClick={handleAdd} disabled={!newSchedule.date || !newSchedule.title}>
                저장
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {sortedSchedules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              등록된 일정이 없습니다
            </p>
          ) : (
            sortedSchedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className="flex items-start gap-3 p-3 border rounded-lg hover:border-primary/50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${schedule.type === 'meeting' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'}`}>
                  {schedule.type === 'meeting' ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <Truck className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{schedule.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(schedule.date), 'PPP', { locale: ko })}
                  </p>
                  {schedule.description && (
                    <p className="text-xs text-muted-foreground mt-1">{schedule.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={() => onRemoveSchedule(schedule.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

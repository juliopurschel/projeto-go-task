import { Component, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskStatusEnum } from '../../../../domain/tasks/enums/task-status.enum';
import { ITask } from '../../../../domain/tasks/task.interface';
import { TaskStatus } from '../../../../domain/tasks/types/task-status';

@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, CdkDropList, CdkDrag, AsyncPipe],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css',
})
export class TaskListSectionComponent {
  readonly _taskService = inject(TaskService);

  onCardDrop(event: CdkDragDrop<ITask[]>) {
    const taskId = event.item.data.id;
    const taskCurrentStatus = event.item.data.status;
    const droppedColumn = event.container.id;

    this.updateTaskStatus(
      taskId,
      taskCurrentStatus,
      droppedColumn,
      event.currentIndex,
    );
  }

  private updateTaskStatus(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    droppedColumn: string,
    taskNextIndex: number,
  ) {
    let taskNextStatus: TaskStatus;

    switch (droppedColumn) {
      case 'to-do-column':
        taskNextStatus = TaskStatusEnum.TODO;
        break;
      case 'doing-column':
        taskNextStatus = TaskStatusEnum.DOING;
        break;
      case 'done-column':
        taskNextStatus = TaskStatusEnum.DONE;
        break;
      default:
        throw Error('Coluna não identificada');
    }

    this._taskService.updateTaskStatus(
      taskId,
      taskCurrentStatus,
      taskNextStatus,
      taskNextIndex,
    );
  }
}

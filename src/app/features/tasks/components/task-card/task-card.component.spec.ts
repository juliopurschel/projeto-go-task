import { Dialog } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TaskStatusEnum } from '../../../../domain/tasks/enums/task-status.enum';
import { TaskService } from '../../services/task.service';
import { TaskCommentsModalComponent } from '../task-comments-modal/task-comments-modal.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { TaskCardComponent } from './task-card.component';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let service: TaskService;
  let dialog: Dialog;

  beforeEach(async () => {
    Object.values(TaskStatusEnum).forEach((status) =>
      localStorage.removeItem(status),
    );
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
    }).compileComponents();
    service = TestBed.inject(TaskService);
    dialog = TestBed.inject(Dialog);
    service.addTask({
      name: 'Tarefa de teste',
      description: 'Descrição da tarefa',
    });
    const tasks = await firstValueFrom(service.todoTasks);
    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', tasks[0]);
    fixture.detectChanges();
  });

  afterEach(() => {
    dialog.closeAll();
    Object.values(TaskStatusEnum).forEach((status) =>
      localStorage.removeItem(status),
    );
  });

  it('should persist a comment added through the dialog after it closes', () => {
    component.openTaskCommentsModal();
    fixture.detectChanges();
    const modal = dialog.openDialogs[0]
      .componentInstance as TaskCommentsModalComponent;
    modal.commentControl.setValue('Comentário persistido');
    modal.onAddComment();
    modal.onCloseModal();
    const tasks = JSON.parse(localStorage.getItem(TaskStatusEnum.TODO)!);
    expect(tasks[0].comments[0].description).toBe('Comentário persistido');
  });

  it('should persist task edits returned by the form dialog', () => {
    component.openEditTaskModal();
    const modal = dialog.openDialogs[0]
      .componentInstance as TaskFormModalComponent;
    modal.taskForm.setValue({
      name: 'Tarefa atualizada',
      description: 'Descrição atualizada',
    });
    modal.onFormSubmit();
    const tasks = JSON.parse(localStorage.getItem(TaskStatusEnum.TODO)!);
    expect(tasks[0].name).toBe('Tarefa atualizada');
    expect(tasks[0].description).toBe('Descrição atualizada');
  });

  it('should delete its task from persisted state', () => {
    component.deleteTask();
    expect(JSON.parse(localStorage.getItem(TaskStatusEnum.TODO)!)).toEqual([]);
  });
});

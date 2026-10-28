import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatusEnum } from '../../../../domain/tasks/enums/task-status.enum';
import { ITask } from '../../../../domain/tasks/task.interface';
import { TaskCommentsModalComponent } from './task-comments-modal.component';

describe('TaskCommentsModalComponent', () => {
  let component: TaskCommentsModalComponent;
  let fixture: ComponentFixture<TaskCommentsModalComponent>;
  let dialogRef: jasmine.SpyObj<DialogRef>;
  let task: ITask;

  beforeEach(async () => {
    task = {
      id: 'task-1',
      name: 'Tarefa de teste',
      description: 'Descrição da tarefa',
      status: TaskStatusEnum.TODO,
      comments: [],
    };
    dialogRef = jasmine.createSpyObj('DialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [TaskCommentsModalComponent],
      providers: [
        { provide: DIALOG_DATA, useValue: task },
        { provide: DialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TaskCommentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should signal additions on close and return focus to the input', () => {
    const input = component.commentInputRef.nativeElement;
    spyOn(input, 'focus');
    component.commentControl.setValue('  Novo comentário  ');
    component.onAddComment();
    component.onCloseModal();
    expect(task.comments[0].description).toBe('Novo comentário');
    expect(component.commentControl.value).toBe('');
    expect(input.focus).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should reject empty and whitespace-only comments', () => {
    for (const value of ['', '   ']) {
      component.commentControl.setValue(value);
      component.onAddComment();
    }
    expect(task.comments).toEqual([]);
    expect(component.taskCommentsChanged).toBeFalse();
  });

  it('should remove a comment and signal the change on close', () => {
    task.comments = [{ id: 'comment-1', description: 'Comentário existente' }];
    component.onRemoveComment('comment-1');
    component.onCloseModal();
    expect(task.comments).toEqual([]);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close without signalling changes if no comment was changed', () => {
    component.onCloseModal();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TaskStatusEnum } from '../../../../domain/tasks/enums/task-status.enum';
import { ITask } from '../../../../domain/tasks/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskListSectionComponent } from './task-list-section.component';

describe('TaskListSectionComponent', () => {
  let fixture: ComponentFixture<TaskListSectionComponent>;
  const clearTasks = () =>
    Object.values(TaskStatusEnum).forEach((status) =>
      localStorage.removeItem(status),
    );

  beforeEach(async () => {
    clearTasks();
    await TestBed.configureTestingModule({
      imports: [TaskListSectionComponent],
    }).compileComponents();
    const service = TestBed.inject(TaskService);
    service.addTask({
      name: 'Primeira tarefa',
      description: 'Descrição da primeira',
    });
    service.addTask({
      name: 'Segunda tarefa',
      description: 'Descrição da segunda',
    });
    fixture = TestBed.createComponent(TaskListSectionComponent);
    fixture.detectChanges();
  });

  afterEach(clearTasks);

  function dropTask(targetIndex: number, currentIndex: number) {
    const lists = fixture.debugElement
      .queryAll(By.directive(CdkDropList))
      .map((element) =>
        element.injector.get<CdkDropList<ITask[]>>(CdkDropList),
      );
    const item = fixture.debugElement
      .query(By.directive(CdkDrag))
      .injector.get(CdkDrag);
    const event: CdkDragDrop<ITask[]> = {
      previousIndex: 0,
      currentIndex,
      item,
      container: lists[targetIndex],
      previousContainer: lists[0],
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 },
      dropPoint: { x: 0, y: 0 },
      event: new MouseEvent('mouseup'),
    };
    lists[targetIndex].dropped.emit(event);
    fixture.detectChanges();
  }

  it('should move a card to the column selected by the drop event', () => {
    dropTask(1, 0);
    const todo = JSON.parse(localStorage.getItem(TaskStatusEnum.TODO)!);
    const doing = JSON.parse(localStorage.getItem(TaskStatusEnum.DOING)!);
    expect(todo.map((task: ITask) => task.name)).toEqual(['Segunda tarefa']);
    expect(doing[0].name).toBe('Primeira tarefa');
    expect(doing[0].status).toBe(TaskStatusEnum.DOING);
    expect(
      fixture.nativeElement.querySelectorAll('#doing-column app-task-card')
        .length,
    ).toBe(1);
  });

  it('should render and persist the drop position within the same column', () => {
    dropTask(0, 1);
    const todo: ITask[] = JSON.parse(
      localStorage.getItem(TaskStatusEnum.TODO)!,
    );
    expect(todo.map((task) => task.name)).toEqual([
      'Segunda tarefa',
      'Primeira tarefa',
    ]);
    const cards = fixture.nativeElement.querySelectorAll(
      '#to-do-column app-task-card',
    );
    expect(cards[0].textContent).toContain('Segunda tarefa'.slice(0, 13));
    expect(cards.length).toBe(2);
  });
});

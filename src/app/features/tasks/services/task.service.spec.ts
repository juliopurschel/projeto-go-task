import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TaskStatusEnum } from '../../../domain/tasks/enums/task-status.enum';
import { ITask } from '../../../domain/tasks/task.interface';
import { TaskService } from './task.service';

describe('TaskService', () => {
  const taskForm = {
    name: 'Tarefa de teste',
    description: 'Descrição da tarefa',
  };
  const clearTasks = () =>
    Object.values(TaskStatusEnum).forEach((status) =>
      localStorage.removeItem(status),
    );
  const storedTasks = (status = TaskStatusEnum.TODO): ITask[] =>
    JSON.parse(localStorage.getItem(status) ?? '[]');
  let service: TaskService;

  beforeEach(() => {
    clearTasks();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  afterEach(clearTasks);

  it('should persist a new task without observable subscribers', () => {
    service.addTask(taskForm);
    expect(storedTasks()).toEqual([
      jasmine.objectContaining({
        ...taskForm,
        id: jasmine.any(String),
        status: TaskStatusEnum.TODO,
        comments: [],
      }),
    ]);
  });

  it('should preserve edits and comments after creating a new service instance', async () => {
    service.addTask(taskForm);
    const task = storedTasks()[0];
    service.updateTaskNameAndDescription(
      task.id,
      task.status,
      'Nome atualizado',
      'Descrição atualizada',
    );
    service.updateTaskComments(task.id, task.status, [
      { id: 'comment-1', description: 'Comentário salvo' },
    ]);

    const restored = await firstValueFrom(new TaskService().todoTasks);
    expect(restored[0]).toEqual(
      jasmine.objectContaining({
        name: 'Nome atualizado',
        description: 'Descrição atualizada',
        comments: [{ id: 'comment-1', description: 'Comentário salvo' }],
      }),
    );
  });

  it('should insert a moved task at the selected destination index', async () => {
    for (let i = 0; i < 3; i++) service.addTask(taskForm);
    const [first, second, third] = storedTasks();
    service.updateTaskStatus(first.id, first.status, TaskStatusEnum.DOING);
    service.updateTaskStatus(second.id, second.status, TaskStatusEnum.DOING);
    service.updateTaskStatus(third.id, third.status, TaskStatusEnum.DOING, 1);

    expect(storedTasks()).toEqual([]);
    const restored = await firstValueFrom(new TaskService().doingTasks);
    expect(restored.map((task) => task.id)).toEqual([
      first.id,
      third.id,
      second.id,
    ]);
    expect(
      restored.every((task) => task.status === TaskStatusEnum.DOING),
    ).toBeTrue();
  });

  it('should preserve reordering in both directions within the same column', async () => {
    for (let i = 0; i < 3; i++) service.addTask(taskForm);
    const [first, second, third] = storedTasks();
    service.updateTaskStatus(first.id, first.status, first.status, 2);
    expect(storedTasks().map((task) => task.id)).toEqual([
      second.id,
      third.id,
      first.id,
    ]);
    service.updateTaskStatus(first.id, first.status, first.status, 0);
    const restored = await firstValueFrom(new TaskService().todoTasks);
    expect(restored.map((task) => task.id)).toEqual([
      first.id,
      second.id,
      third.id,
    ]);
  });

  it('should keep the position when updating to the same status without an index', () => {
    service.addTask(taskForm);
    service.addTask(taskForm);
    const original = storedTasks();
    service.updateTaskStatus(
      original[0].id,
      original[0].status,
      original[0].status,
    );
    expect(storedTasks()).toEqual(original);
  });

  it('should persist deletion and retain other tasks', () => {
    service.addTask(taskForm);
    service.addTask(taskForm);
    const [first, second] = storedTasks();
    service.deleteTask(first.id, first.status);
    expect(storedTasks()).toEqual([second]);
  });

  it('should ignore updates to a missing task', () => {
    service.addTask(taskForm);
    const original = storedTasks();
    service.updateTaskStatus(
      'missing',
      TaskStatusEnum.TODO,
      TaskStatusEnum.DONE,
      0,
    );
    service.updateTaskNameAndDescription(
      'missing',
      TaskStatusEnum.TODO,
      'Outro nome',
      'Outra descrição',
    );
    service.updateTaskComments('missing', TaskStatusEnum.TODO, []);
    expect(storedTasks()).toEqual(original);
    expect(storedTasks(TaskStatusEnum.DONE)).toEqual([]);
  });

  it('should protect state from mutations to observable results and comment inputs', async () => {
    service.addTask(taskForm);
    const comments = [{ id: 'comment-1', description: 'Comentário original' }];
    const task = storedTasks()[0];
    service.updateTaskComments(task.id, task.status, comments);
    comments[0].description = 'Alteração externa';
    const tasks = await firstValueFrom(service.todoTasks);
    tasks[0].name = 'Nome externo';
    tasks[0].comments.length = 0;

    const current = await firstValueFrom(service.todoTasks);
    expect(current[0].name).toBe(taskForm.name);
    expect(current[0].comments[0].description).toBe('Comentário original');
  });

  it('should load an empty list for malformed JSON or non-array storage', async () => {
    spyOn(console, 'error');
    for (const value of ['{invalid', 'null', '{}']) {
      localStorage.setItem(TaskStatusEnum.TODO, value);
      expect(await firstValueFrom(new TaskService().todoTasks)).toEqual([]);
    }
  });

  it('should skip malformed tasks while retaining valid stored tasks', async () => {
    service.addTask(taskForm);
    const task = storedTasks()[0];
    localStorage.setItem(
      TaskStatusEnum.TODO,
      JSON.stringify([
        task,
        null,
        {},
        { ...task, comments: [null] },
        { ...task, status: TaskStatusEnum.DONE },
      ]),
    );
    expect(await firstValueFrom(new TaskService().todoTasks)).toEqual([task]);
  });

  it('should keep working in memory when browser storage is unavailable', async () => {
    spyOn(console, 'error');
    spyOn(Storage.prototype, 'setItem').and.throwError('Storage unavailable');
    service.addTask(taskForm);
    expect((await firstValueFrom(service.todoTasks))[0].name).toBe(
      taskForm.name,
    );
    expect(console.error).toHaveBeenCalled();
  });
});

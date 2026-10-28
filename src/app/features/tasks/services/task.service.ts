import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { TaskStatusEnum } from '../../../domain/tasks/enums/task-status.enum';
import { IComment } from '../../../domain/tasks/interfaces/comment.interface';
import { ITask } from '../../../domain/tasks/task.interface';
import { TaskStatus } from '../../../domain/tasks/types/task-status';
import { generateUniqueIdWithTimestamp } from '../../../shared/utils/generate-unique-id-with-timestamp';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Tarefas em a fazer
  private todoTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.TODO),
  );
  readonly todoTasks = this.todoTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  // Tarefas em fazendo
  private doingTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.DOING),
  );
  readonly doingTasks = this.doingTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  // Tarefas em feito
  private doneTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.DONE),
  );
  readonly doneTasks = this.doneTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  addTask(taskInfos: ITaskFormControls) {
    const newTask: ITask = {
      ...taskInfos,
      status: TaskStatusEnum.TODO,
      id: generateUniqueIdWithTimestamp(),
      comments: [],
    };

    const currentList = this.todoTasks$.value;
    this.setTaskList(TaskStatusEnum.TODO, [...currentList, newTask]);
  }

  updateTaskStatus(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    taskNextStatus: TaskStatus,
    taskNextIndex?: number,
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList = this.getTaskListByStatus(taskNextStatus);
    const currentTask = currentTaskList.value.find(
      (task) => task.id === taskId,
    );

    if (
      !currentTask ||
      (taskCurrentStatus === taskNextStatus && taskNextIndex === undefined)
    ) {
      return;
    }

    const currentTaskListWithoutTask = currentTaskList.value.filter(
      (task) => task.id !== taskId,
    );
    const updatedNextTaskList =
      taskCurrentStatus === taskNextStatus
        ? currentTaskListWithoutTask
        : [...nextTaskList.value];
    const nextIndex = Math.max(
      0,
      Math.min(
        taskNextIndex ?? updatedNextTaskList.length,
        updatedNextTaskList.length,
      ),
    );

    updatedNextTaskList.splice(nextIndex, 0, {
      ...currentTask,
      status: taskNextStatus,
    });

    if (taskCurrentStatus !== taskNextStatus) {
      this.setTaskList(taskCurrentStatus, currentTaskListWithoutTask);
    }
    this.setTaskList(taskNextStatus, updatedNextTaskList);
  }

  updateTaskNameAndDescription(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    newTaskName: string,
    newTaskDescription: string,
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex(
      (currentTask) => currentTask.id === taskId,
    );

    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];
      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        name: newTaskName,
        description: newTaskDescription,
      };

      this.setTaskList(taskCurrentStatus, updatedTaskList);
    }
  }

  updateTaskComments(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    newTaskComments: IComment[],
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex(
      (task) => task.id === taskId,
    );

    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];
      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        comments: structuredClone(newTaskComments),
      };

      this.setTaskList(taskCurrentStatus, updatedTaskList);
    }
  }

  deleteTask(taskId: string, taskCurrentStatus: TaskStatus) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);

    const newTaskList = currentTaskList.value.filter(
      (task) => task.id !== taskId,
    );

    this.setTaskList(taskCurrentStatus, newTaskList);
  }

  private setTaskList(status: TaskStatus, tasks: ITask[]) {
    this.saveTasksOnLocalStorage(status, tasks);
    this.getTaskListByStatus(status).next(tasks);
  }

  private loadTasksFromLocalStorage(key: TaskStatus): ITask[] {
    try {
      const storedTasks = localStorage.getItem(key);
      const tasks: unknown = storedTasks ? JSON.parse(storedTasks) : [];

      if (!Array.isArray(tasks)) {
        throw new Error('Os dados de tarefas devem ser uma lista');
      }

      return tasks.filter((task): task is ITask => this.isTask(task, key));
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage', error);
      return [];
    }
  }

  private isTask(value: unknown, status: TaskStatus): value is ITask {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const task = value as Partial<ITask>;
    return (
      typeof task.id === 'string' &&
      typeof task.name === 'string' &&
      typeof task.description === 'string' &&
      task.status === status &&
      Array.isArray(task.comments) &&
      task.comments.every((comment: unknown) => {
        if (typeof comment !== 'object' || comment === null) {
          return false;
        }
        const data = comment as Partial<IComment>;
        return (
          typeof data.id === 'string' && typeof data.description === 'string'
        );
      })
    );
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage', error);
    }
  }

  private getTaskListByStatus(taskStatus: TaskStatus) {
    const taskListObj = {
      [TaskStatusEnum.TODO]: this.todoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    };

    return taskListObj[taskStatus];
  }
}

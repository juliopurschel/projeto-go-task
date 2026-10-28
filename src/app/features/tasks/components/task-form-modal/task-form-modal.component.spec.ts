import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormModalComponent } from './task-form-modal.component';

describe('TaskFormModalComponent', () => {
  let component: TaskFormModalComponent;
  let fixture: ComponentFixture<TaskFormModalComponent>;
  let dialogRef: jasmine.SpyObj<DialogRef>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('DialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [TaskFormModalComponent],
      providers: [
        {
          provide: DIALOG_DATA,
          useValue: {
            mode: 'edit',
            formValues: {
              name: 'Tarefa de teste',
              description: 'Descrição da tarefa',
            },
          },
        },
        { provide: DialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TaskFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the form with the task being edited', () => {
    expect(component.taskForm.getRawValue()).toEqual({
      name: 'Tarefa de teste',
      description: 'Descrição da tarefa',
    });
  });

  it('should return form values when submitting a valid task', () => {
    component.onFormSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith(
      component.taskForm.getRawValue(),
    );
  });

  it('should not submit a task with missing or short fields', () => {
    component.taskForm.setValue({ name: 'Curto', description: '' });
    component.onFormSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close without changes when cancelled', () => {
    component.closeModal();
    expect(dialogRef.close).toHaveBeenCalledWith(undefined);
  });
});

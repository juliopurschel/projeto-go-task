import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskStatusEnum } from './domain/tasks/enums/task-status.enum';

describe('AppComponent', () => {
  beforeEach(async () => {
    Object.values(TaskStatusEnum).forEach((status) =>
      localStorage.removeItem(status),
    );
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'projeto-go-task' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('projeto-go-task');
  });

  it('should render the header and task board', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header h1')?.textContent).toContain(
      'Go Task',
    );
    expect(
      compiled.querySelector('app-main-content app-welcome-section'),
    ).not.toBeNull();
    expect(compiled.querySelectorAll('[cdkDropList]').length).toBe(3);
  });
});

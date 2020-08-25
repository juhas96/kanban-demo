import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BoardService} from '../board.service';

@Component({
  selector: 'app-task-dialog',
  template: `
    <h1 mat-dialog-title>Task</h1>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <textarea
            placeholder="Task description"
            matInput
            [(ngModel)]="data.task.description"
        ></textarea>
      </mat-form-field>
      <br />
      <mat-button-toggle-group
        #group="matButtonToggleGroup"
        [(ngModel)]="data.task.label"
      >
        <mat-button-toggle *ngFor="let opt of labelOptions" [value]="opt">
          <mat-icon [ngClass]="opt">
            {{opt === 'gray' ? 'check_circle' : 'lens'}}
          </mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <div mat-dialog-actions>
      <button
        mat-button
        [mat-dialog-close]="data"
      >
        {{ data.isNew ? 'Add Task' : 'Update Task' }}
      </button>

      <app-delete-button *ngIf="!data.isNew" (delete)="handleTaskDelete()"></app-delete-button>
    </div>
  `,
  styles: [
    `
      .content {
        overflow: hidden;
        height: auto;
        padding: 20px;
        width: 100%;
      }

      mat-form-field {
        width: 100%;
      }

      textarea { display: block; width: 100%; }

      .blue { color: #71deff; }
      .green { color: #36e9b6; }
      .yellow { color: #ffcf44; }
      .purple { color: #b15cff; }
      .gray { color: gray; }
      .red { color: #e74a4a; }
    `
  ]
})
export class TaskDialogComponent {

  labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private boardService: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskDelete(): void {
    this.boardService.removeTask(this.data.boardId, this.data.task);
  }

}

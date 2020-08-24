import {Component, Input, OnInit} from '@angular/core';
import {BoardService} from '../board.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Board, Task} from '../board.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TaskDialogComponent} from '../dialogs/task-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() board: Board;

  constructor(private boardService: BoardService,
              private dialogRef: MatDialogRef<TaskDialogComponent>,
              private dialog: MatDialog) { }

  taskDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }

  openDialog(task?: Task, idx?: number): void {
    const newTask = {label: 'purple'};
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
        ? {task: {...task}, isNew: false, boardId: this.board.id, idx}
        : {task: newTask, isNew: true}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.isNew) {
          this.boardService.updateTasks(this.board.id, [
            ...this.board.tasks,
            res.task
          ]);
        } else {
          const update = this.board.tasks;
          update.splice(res.idx, 1, res.task);
          this.boardService.updateTasks(this.board.id, this.board.tasks);
        }
      }
    });
  }

  ngOnInit(): void {
  }

}

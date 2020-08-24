import {Component, OnDestroy, OnInit} from '@angular/core';
import {Board} from '../board.model';
import {Subscription} from 'rxjs';
import {BoardService} from '../board.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {BoardDialogComponent} from '../dialogs/board-dialog.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[] = [];
  sub: Subscription;

  constructor(private boardService: BoardService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.boardService.getUserBoards().subscribe(boards => this.boards = boards);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<string>): void {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.boardService.sortBoards(this.boards);
  }

  openBoardDialog(): void {
    const dialogRef = this.matDialog.open(BoardDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.boardService.createBoard({
          title: res,
          priority: this.boards.length
        });
      }
    });
  }

}

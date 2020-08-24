import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {Board, Task} from './board.model';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore) { }

  async createBoard(data: Board): Promise<DocumentReference> {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{description: 'Description', label: 'yellow'}]
    });
  }

  deleteBoard(boardId: string): Promise<void> {
    return this.db.collection('boards')
      .doc(boardId)
      .delete();
  }

  updateTasks(boardId: string, tasks: Task[]): Promise<void> {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({tasks});
  }

  removeTask(boardId: string, task: Task): Promise<void> {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }

  getUserBoards(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Board>('boards', ref =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({idField: 'id'});
        } else {
          return [];
        }
      })
    );
  }

  sortBoards(boards: Board[]): void {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection('boards').doc(b.id));

    refs.forEach((ref, idx) => batch.update(ref, {priority: idx}));
    batch.commit();
  }
}

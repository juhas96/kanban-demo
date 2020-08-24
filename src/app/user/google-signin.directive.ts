import {Directive, HostListener} from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {

  constructor(private afAuth: AngularFireAuth) { }

  @HostListener('click')
  onClick(): void {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}

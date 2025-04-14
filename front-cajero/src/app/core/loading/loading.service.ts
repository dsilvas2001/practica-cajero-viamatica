import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading = this.loadingSubject.asObservable(); // Observable para suscribirse

  show() {
    this.loadingSubject.next(true); // Mostrar loading
  }

  hide() {
    this.loadingSubject.next(false); // Ocultar loading
  }

  showForSeconds(seconds: number) {
    this.show();
    setTimeout(() => this.hide(), seconds * 1000); // Ocultar después de X segundos
  }
}

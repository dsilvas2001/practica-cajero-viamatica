import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styles: ``,
})
export class NotificationsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() statusnotification: boolean = false;
  @Input() title: string = 'Notificación';
  @Input() message: string = 'Este es un mensaje de notificación.';
  @Input() type: string = 'success'; // success | error | info | logout | delete
  @Input() duration: number = 3000;
  @Output() deleteAction = new EventEmitter<boolean>();
  @Output() notificationClosed = new EventEmitter<void>();

  progressWidth = 100;
  private intervalId: any;
  private timeoutId: any;

  ngOnInit(): void {
    if (this.statusnotification) {
      this.initNotification();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusnotification'] && this.statusnotification) {
      this.initNotification();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  initNotification(): void {
    this.clearTimers();
    this.progressWidth = 100;
    this.startProgressBar();
    this.setAutoClose();
  }

  startProgressBar(): void {
    const intervalDuration = 50;
    const steps = this.duration / intervalDuration;
    const decrement = 100 / steps;

    this.intervalId = setInterval(() => {
      this.progressWidth -= decrement;
      if (this.progressWidth <= 0) {
        clearInterval(this.intervalId);
      }
    }, intervalDuration);
  }

  setAutoClose(): void {
    this.timeoutId = setTimeout(() => {
      this.closeNotification();
    }, this.duration);
  }

  clearTimers(): void {
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
  }

  closeNotification(): void {
    this.statusnotification = false;
    this.notificationClosed.emit();
    if (this.type === 'delete') {
      this.deleteAction.emit(false);
    }
  }

  closeNotificationDelete() {
    this.clearTimers();
    this.statusnotification = false;
    this.deleteAction.emit(false);
  }

  confirmDelete(): void {
    this.clearTimers();
    this.statusnotification = false;
    this.deleteAction.emit(true);
  }
}

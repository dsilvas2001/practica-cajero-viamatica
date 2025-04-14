import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../../../core/client/client.service';

@Component({
  selector: 'app-client-modal',
  templateUrl: './client-modal.component.html',
  styles: ``,
})
export class ClientModalComponent implements OnInit {
  @Input() clientData: any;
  @Input() action: string = 'add';
  @Output() closeModal = new EventEmitter<void>();
  @Output() clientUpdated = new EventEmitter<void>();

  clientForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      identification: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      email: ['', Validators.email],
      phonenumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: ['', Validators.required],
      referenceaddress: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.clientData && this.action === 'edit') {
      this.clientForm.patchValue(this.clientData);
    }
  }

  // Solo permite números en los campos de identificación y teléfono
  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  saveClient() {
    if (this.clientForm.invalid) return;

    this.isLoading = true;
    const formData = this.clientForm.value;

    if (this.action === 'add') {
      this.clientService.registerClient(formData).subscribe(
        () => {
          this.isLoading = false;
          this.clientUpdated.emit();
          this.closeModal.emit();
        },
        (error) => {
          this.isLoading = false;
          console.error('Error registering client:', error);
        }
      );
    } else {
      this.clientService
        .updateClient(this.clientData.clientid, formData)
        .subscribe(
          () => {
            this.isLoading = false;
            this.clientUpdated.emit();
            this.closeModal.emit();
          },
          (error) => {
            this.isLoading = false;
            console.error('Error updating client:', error);
          }
        );
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}

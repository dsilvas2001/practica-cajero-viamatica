import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { error } from 'console';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styles: ``,
})
export class UserModalComponent implements OnInit {
  @Input() usuario: any;
  @Output() usuarioActualizado = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  userForm: FormGroup;
  roles: any[] = [];
  estados: any[] = [];
  isLoading = false;

  //Notificacion
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  statusDelete: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarOpciones();
    this.cargarDatosUsuario();
  }

  cargarOpciones() {
    // Simulando carga de opciones (deberías reemplazar con llamadas reales)
    this.roles = [
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Gestor' },
      { id: 3, name: 'Cajero' },
    ];

    this.estados = [
      { id: 'ACT', name: 'Activo' },
      { id: 'INA', name: 'Inactivo' },
      { id: 'BLO', name: 'Bloqueado' },
    ];
  }

  cargarDatosUsuario() {
    if (this.usuario) {
      this.userForm.patchValue({
        username: this.usuario.username,
        email: this.usuario.email,
        rol: this.usuario.rol.rolId,
        estado: this.usuario.userStatus.statusid,
        aprobado: this.usuario.userApproval,
      });
    }
  }

  guardarCambios() {
    if (this.userForm.valid) {
      this.isLoading = true;

      // Obtener currentUserId del token
      const currentUser = this.authService.getUserInfo() || 'null';

      // Preparar objeto editUser según el formato requerido
      const editUser = {
        username: this.userForm.value.username,
        email: this.userForm.value.email,
        rolName: this.usuario.rol.rolName,
        userstatus_statusid: this.userForm.value.estado,
      };

      console.log('editUser');
      console.log('editUser');
      console.log(editUser);

      this.authService
        .updateUser(
          editUser,
          currentUser?.id || '', // currentUserId
          this.usuario.userid // userId
        )
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.showNotification(
              'Éxito',
              'Usuario actualizado correctamente',
              'success'
            );
            this.usuarioActualizado.emit();
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error al actualizar:', err);
            this.showNotification(
              'Error',
              'No se pudo actualizar el usuario',
              'error'
            );
          },
        });
    }
  }

  showNotification(title: string, message: string, type: string) {
    this.statusnotification = true;
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;
    if (type !== 'delete') {
      setTimeout(() => {
        this.statusnotification = false;
      }, 3000);
    }
  }

  onClose() {
    this.cerrarModal.emit();
  }
}

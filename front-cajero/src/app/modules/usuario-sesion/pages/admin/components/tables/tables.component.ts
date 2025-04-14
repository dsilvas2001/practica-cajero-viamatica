import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { read, utils } from 'xlsx';

interface ExcelUsuario {
  Username?: string;
  Email?: string;
  Rol?: string;
  Estado?: string;
  Aprobado?: string | boolean;
  'Creado Por'?: string;
  'Fecha Creación'?: string | number | Date;
}

interface UsuarioImportado {
  username: string;
  email: string;
  rol: { rolName: string };
  userStatus: { statusid: string };
  userApproval: boolean;
  createdBy: { userid: string };
  createdAt: string;
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styles: ``,
})
export class TablesComponent {
  @Output() countPacienteEvent = new EventEmitter<void>();
  //Modal
  statusModal: boolean = false;
  actionModal: string = 'add';
  userData: any = null;

  //Tabla
  usuarios: any[] = [];
  displayedUsuarios: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  //Notificacion
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  statusDelete: boolean = false;
  //loading
  isLoading = false;
  //
  showEditModal = false;
  selectedUser: any = null;

  constructor(private authServices: AuthService) {}

  ngOnInit() {
    this.mostrarUser();
  }

  abrirModal(paciente: any, actionModal: string): void {
    this.actionModal = actionModal;
    this.userData = actionModal === 'edit' ? paciente : null;
    this.statusModal = true; // Abrir el modal
  }

  // EVENTOS

  handleDeleteAction(confirmed: boolean): void {
    if (confirmed) {
      this.statusnotification = false;

      this.eliminarUsuario(this.userData.userid);
    } else {
      console.log('else', confirmed);
      this.statusnotification = false;
    }
  }

  // NOTIFICACION

  showDeleteNotification(usuario: any): void {
    this.userData = usuario;
    this.showNotification(
      'Eliminar Usuario',
      `¿Estás seguro de que deseas eliminar este usuario ${this.userData.username}?`,
      'delete'
    );
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

  // TABLE

  mostrarUser() {
    this.isLoading = true;
    this.authServices.getAllUser().subscribe(
      (datas: any[]) => {
        this.usuarios = datas;
        this.isLoading = false;
        this.updateDisplayedUsuarios();
      },
      (error) => {
        this.isLoading = false;

        console.error('Error fetching users:', error);
      }
    );
  }

  // Métodos para las acciones
  editarUsuario(usuario: any) {
    // Lógica para editar usuario
    this.selectedUser = { ...usuario }; // Copia del usuario para no modificar el original
    this.showEditModal = true;
  }

  eliminarUsuario(usuarioId: any) {
    const currentUser = this.authServices.getUserInfo();

    if (!confirm('¿Estás seguro de aprobar este usuario?')) return;

    if (!currentUser?.id) {
      this.showNotification(
        'Error',
        'No se pudo obtener el ID del usuario actual',
        'error'
      );
      return;
    }
    this.authServices.deleteUser(currentUser.id, usuarioId).subscribe(
      (data) => {
        this.mostrarUser();
        this.showNotification('Correcto!', 'Paciente Eliminado', 'success');
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);

        let mensaje = 'Ocurrió un error al intentar eliminar el usuario';

        // Manejo específico de errores
        if (error.status === 500) {
          mensaje =
            'No se puede eliminar el usuario porque tiene registros asociados';
        } else if (error.status === 403) {
          mensaje = 'No tienes permisos para realizar esta acción';
        } else if (error.status === 404) {
          mensaje = 'El usuario no existe o ya fue eliminado';
        }

        this.showNotification('Error', mensaje, 'error');
      }
    );
  }
  handleUserUpdated() {
    this.showEditModal = false;
    this.mostrarUser(); // Recargar la lista de usuarios
    this.showNotification(
      'Éxito',
      'Usuario actualizado correctamente',
      'success'
    );
  }
  closeModal() {
    this.showEditModal = false;
  }

  //Importar Excel
  // Método para importar Excel (actualizado)
  async importarExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isLoading = true; // Activar loading al inicio

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet);

      if (!jsonData.length) {
        this.showNotification(
          'Archivo vacío',
          'El Excel no contiene datos',
          'error'
        );
        return;
      }

      // Mapeo de datos con validación básica
      const usersToRegister = jsonData.map((row, index) => {
        const username = row.Username || row.username;
        const email = row.Email || row.email;
        const rol = row.Rol || row.rol;
        const estado = row.Estado || row.estado;

        if (!username || !email || !rol || !estado) {
          throw new Error(`Fila ${index + 2}: Datos incompletos`);
        }

        return {
          username: String(username),
          email: String(email),
          password: row.password,
          rolName: String(rol),
          userstatus_statusid: String(estado),
        };
      });

      const currentUser = this.authServices.getUserInfo();
      if (!currentUser?.id) {
        throw new Error('Usuario actual no identificado');
      }

      // Enviar al backend
      this.authServices
        .bulkRegisterUsers(currentUser.id, usersToRegister)
        .subscribe({
          next: (response) => {
            this.showNotification(
              'Éxito',
              `Se registraron ${usersToRegister.length} usuarios correctamente`,
              'success'
            );
            this.mostrarUser();
          },
          error: (err) => {
            console.error('Error al guardar usuarios:', err);
            this.showNotification(
              'Error',
              err.error?.message || 'Error al registrar usuarios',
              'error'
            );
          },
          complete: () => {
            this.isLoading = false; // Desactivar loading al finalizar (éxito o error)
          },
        });
    } catch (error) {
      this.isLoading = false; // Desactivar loading si hay error en el procesamiento
      this.showNotification(
        'Error',
        error instanceof Error ? error.message : 'Error procesando el archivo',
        'error'
      );
    } finally {
      input.value = '';
    }
  }

  // Método para parsear fechas de Excel (que faltaba)
  private parseExcelDate(excelDate: unknown): string {
    if (typeof excelDate === 'number') {
      // Fechas numéricas de Excel (días desde 1900-01-01)
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      return date.toISOString();
    } else if (typeof excelDate === 'string') {
      // Intentar parsear como string
      const parsedDate = new Date(excelDate);
      return isNaN(parsedDate.getTime())
        ? new Date().toISOString()
        : parsedDate.toISOString();
    } else if (excelDate instanceof Date) {
      // Si ya es un objeto Date
      return excelDate.toISOString();
    }
    return new Date().toISOString(); // Valor por defecto
  }

  // Método adicional para parsear valores booleanos
  private parsearBooleano(valor: string | boolean): boolean {
    if (typeof valor === 'boolean') return valor;
    return String(valor).toLowerCase() === 'sí';
  }

  //cambiar estado

  // Método para aprobar usuario
  aprobarUsuario(usuario: any) {
    if (usuario.userApproval) return; // Solo si está en "No"

    const currentUser = this.authServices.getUserInfo();

    if (!confirm('¿Estás seguro de aprobar este usuario?')) return;

    if (!currentUser?.id) {
      this.showNotification(
        'Error',
        'No se pudo obtener el ID del usuario actual',
        'error'
      );
      return;
    }
    this.authServices
      .updateValidatorUser(currentUser.id, usuario.userid)
      .subscribe({
        next: () => {
          usuario.userApproval = true; // Actualiza el estado local
          this.showNotification(
            'Usuario aprobado',
            'El usuario ha sido aprobado correctamente',
            'success'
          );
        },
        error: (err) => {
          console.error('Error:', err);
          this.showNotification(
            'Error',
            'No se pudo aprobar el usuario',
            'error'
          );
        },
      });
  }

  // PAGINATION

  updateDisplayedUsuarios() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsuarios = this.usuarios.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedUsuarios();
  }

  get totalPages(): number {
    return Math.ceil(this.usuarios.length / this.itemsPerPage);
  }
}

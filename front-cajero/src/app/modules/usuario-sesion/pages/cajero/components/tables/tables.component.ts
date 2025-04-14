import { Component } from '@angular/core';
import { ClientService } from '../../../../../../core/client/client.service';
import { read, utils } from 'xlsx';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styles: ``,
})
export class TablesComponent {
  // Modal
  showClientModal: boolean = false;
  actionModal: string = 'add';
  selectedClient: any = null;

  // Tabla
  clients: any[] = [];
  filteredClients: any[] = [];
  displayedClients: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';

  // Carga masiva
  temporaryClients: any[] = [];

  // Notificación
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  statusDelete: boolean = false;

  // Loading
  isLoading = false;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getAllClients().subscribe(
      (data: any[]) => {
        this.clients = data;
        this.filteredClients = [...this.clients];
        this.updateDisplayedClients();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching clients:', error);
        this.isLoading = false;
        this.showNotification(
          'Error',
          'No se pudieron cargar los clientes',
          'error'
        );
      }
    );
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.lastname.toLowerCase().includes(term) ||
          client.identification.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updateDisplayedClients();
  }

  abrirModal(client: any, action: string): void {
    this.actionModal = action;
    this.selectedClient = action === 'edit' ? { ...client } : null;
    this.showClientModal = true;
  }

  closeModal(): void {
    this.showClientModal = false;
  }

  handleClientUpdated(): void {
    this.loadClients();
    this.showNotification(
      'Éxito',
      'Operación realizada correctamente',
      'success'
    );
  }

  showDeleteNotification(client: any): void {
    this.selectedClient = client;
    this.showNotification(
      'Eliminar Cliente',
      `¿Estás seguro de eliminar a ${this.selectedClient.name} ${this.selectedClient.lastname}?`,
      'delete'
    );
  }

  handleDeleteAction(confirmed: boolean): void {
    if (confirmed && this.selectedClient) {
      // Lógica para eliminar cliente
      this.clientService.deleteClient(this.selectedClient.clientid).subscribe(
        () => {
          this.loadClients();
          this.showNotification(
            'Éxito',
            'Cliente eliminado correctamente',
            'success'
          );
        },
        (error) => {
          console.error('Error deleting client:', error);
          this.showNotification(
            'Error',
            'No se pudo eliminar el cliente',
            'error'
          );
        }
      );
    }
    this.statusnotification = false;
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

  // Importar desde Excel
  async importarExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet);

      if (!jsonData.length) {
        this.showNotification(
          'Archivo vacío',
          'El archivo Excel no contiene datos',
          'error'
        );
        return;
      }

      // Validar columnas requeridas
      const requiredColumns = [
        'name',
        'lastname',
        'identification',
        'email',
        'phonenumber',
        'address',
        'referenceaddress',
      ];
      const firstRow = jsonData[0];

      const missingColumns = requiredColumns.filter(
        (col) => !(col in firstRow)
      );
      if (missingColumns.length > 0) {
        this.showNotification(
          'Error en formato',
          `Faltan columnas requeridas: ${missingColumns.join(', ')}`,
          'error'
        );
        return;
      }

      // Procesar datos
      this.temporaryClients = jsonData.map((row: any) => ({
        name: row.name || '',
        lastname: row.lastname || '',
        identification: row.identification || '',
        email: row.email || '',
        phonenumber: row.phonenumber || '',
        address: row.address || '',
        referenceaddress: row.referenceaddress || '',
      }));

      this.showNotification(
        'Carga exitosa',
        `Se cargaron ${this.temporaryClients.length} clientes desde el archivo. Revise la vista previa antes de guardar.`,
        'success'
      );
    } catch (error) {
      console.error('Error al importar Excel:', error);
      this.showNotification(
        'Error en importación',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al procesar el archivo',
        'error'
      );
    } finally {
      input.value = '';
    }
  }

  // Guardar carga masiva
  // guardarCargaMasiva() {
  //   this.isLoading = true;
  //   this.clientService.saveBulkClients(this.temporaryClients).subscribe(
  //     (response) => {
  //       this.isLoading = false;
  //       this.showNotification('Éxito', 'Clientes guardados correctamente', 'success');
  //       this.temporaryClients = [];
  //       this.loadClients();
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       console.error('Error al guardar carga masiva:', error);
  //       this.showNotification('Error', 'No se pudieron guardar todos los clientes', 'error');
  //     }
  //   );
  // }

  // Paginación
  updateDisplayedClients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedClients();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClients.length / this.itemsPerPage);
  }
}

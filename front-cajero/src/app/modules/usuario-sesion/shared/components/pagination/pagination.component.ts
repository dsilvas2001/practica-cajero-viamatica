import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styles: ``,
})
export class PaginationComponent {
  @Input() currentPage: number = 1; // Página actual
  @Input() itemsPerPage: number = 5; // Elementos por página
  @Input() totalItems: number = 0; // Total de elementos en la lista

  @Output() pageChanged = new EventEmitter<number>(); // Emisor de eventos para cambios de página

  // Calcula el número total de páginas
  get totalPages(): number {
    return this.itemsPerPage > 0
      ? Math.ceil(this.totalItems / this.itemsPerPage)
      : 1;
  }

  // Método para cambiar de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }

  // Cambia a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Cambia a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Método para obtener las páginas a mostrar
  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (this.currentPage <= 4) {
      pages.push(...[1, 2, 3, 4, 5, '...', totalPages]);
    } else if (this.currentPage >= totalPages - 3) {
      pages.push(
        ...[
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ]
      );
    } else {
      pages.push(
        ...[
          1,
          '...',
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          '...',
          totalPages,
        ]
      );
    }

    return pages;
  }

  // Método para calcular el rango de elementos mostrados
  getDisplayedRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return { start, end };
  }
}

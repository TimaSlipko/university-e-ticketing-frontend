import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaleService } from '../../../../core/services/sale.service';
import { EventService } from '../../../../core/services/event.service';
import { Sale, Event, CreateSaleRequest, UpdateSaleRequest } from '../../../../core/models';

@Component({
  selector: 'app-manage-sales',
  templateUrl: './manage-sales.component.html'
})
export class ManageSalesComponent implements OnInit {
  sales: Sale[] = [];
  event: Event | null = null;
  eventId: number = 0;
  loading = false;
  error = '';
  success = '';
  
  showCreateForm = false;
  editingSale: Sale | null = null;
  saleForm: FormGroup;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private saleService: SaleService,
    private eventService: EventService
  ) {
    this.saleForm = this.createSaleForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      if (this.eventId) {
        this.loadEventAndSales();
      }
    });
  }

  private createSaleForm(): FormGroup {
    return this.fb.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]]
    });
  }

  private loadEventAndSales(): void {
    this.loading = true;
    this.error = '';

    this.eventService.getEvent(this.eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.loadSales();
      },
      error: () => {
        this.error = 'Failed to load event details';
        this.loading = false;
      }
    });
  }

  private loadSales(): void {
    this.saleService.getSalesByEvent(this.eventId).subscribe({
      next: (response) => {
        this.sales = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sales';
        this.loading = false;
      }
    });
  }

  showCreateSaleForm(): void {
    this.showCreateForm = true;
    this.editingSale = null;
    this.saleForm.reset();
    this.error = '';
    this.success = '';
  }

  editSale(sale: Sale): void {
    if (!this.saleService.isSaleUpcoming(sale)) {
      this.error = 'Can only edit upcoming sales';
      return;
    }

    this.editingSale = sale;
    this.showCreateForm = true;
    this.error = '';
    this.success = '';
    
    // Convert timestamps to datetime-local format
    const startDate = new Date(sale.start_date * 1000);
    const endDate = new Date(sale.end_date * 1000);
    
    this.saleForm.patchValue({
      start_date: this.formatDateTimeForInput(startDate),
      end_date: this.formatDateTimeForInput(endDate)
    });
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingSale = null;
    this.saleForm.reset();
    this.error = '';
    this.success = '';
  }

  onSubmit(): void {
    if (this.saleForm.invalid) return;

    this.submitting = true;
    this.error = '';
    this.success = '';

    const formValue = this.saleForm.value;
    const startTimestamp = Math.floor(new Date(formValue.start_date).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(formValue.end_date).getTime() / 1000);

    if (this.editingSale) {
      // Update existing sale
      const updateData: UpdateSaleRequest = {
        start_date: startTimestamp,
        end_date: endTimestamp
      };

      this.saleService.updateSale(this.editingSale.id, updateData).subscribe({
        next: () => {
          this.success = 'Sale updated successfully';
          this.cancelForm();
          this.loadSales();
          this.submitting = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to update sale';
          this.submitting = false;
        }
      });
    } else {
      // Create new sale
      const createData: CreateSaleRequest = {
        event_id: this.eventId,
        start_date: startTimestamp,
        end_date: endTimestamp
      };

      this.saleService.createSale(createData).subscribe({
        next: () => {
          this.success = 'Sale created successfully';
          this.cancelForm();
          this.loadSales();
          this.submitting = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to create sale';
          this.submitting = false;
        }
      });
    }
  }

  deleteSale(sale: Sale): void {
    if (!this.saleService.isSaleUpcoming(sale)) {
      this.error = 'Can only delete upcoming sales';
      return;
    }

    if (confirm('Are you sure you want to delete this sale? This action cannot be undone.')) {
      this.saleService.deleteSale(sale.id).subscribe({
        next: () => {
          this.success = 'Sale deleted successfully';
          this.loadSales();
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to delete sale';
        }
      });
    }
  }

  getSaleStatus(sale: Sale): string {
    return this.saleService.getSaleStatus(sale);
  }

  getSaleStatusBadgeClass(sale: Sale): string {
    return this.saleService.getSaleStatusBadgeClass(sale);
  }

  formatDateTime(timestamp: number): string {
    return this.saleService.formatDateTime(timestamp);
  }

  private formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  canEditOrDelete(sale: Sale): boolean {
    // Can only edit/delete upcoming sales (not active or past)
    return this.saleService.isSaleUpcoming(sale);
  }

  getStatusText(sale: Sale): string {
    const status = this.getSaleStatus(sale);
    switch (status) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'ended': return 'Ended';
      default: return 'Unknown';
    }
  }

  isEventUpcoming(): boolean {
    if (!this.event) return false;
    return this.event.date * 1000 > Date.now();
  }
}
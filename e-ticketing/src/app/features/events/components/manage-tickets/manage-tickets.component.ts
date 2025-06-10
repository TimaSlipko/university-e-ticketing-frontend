import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../../../core/services/ticket.service';
import { EventService } from '../../../../core/services/event.service';
import { SaleService } from '../../../../core/services/sale.service';
import { 
  GroupedTicket, 
  CreateTicketRequest, 
  UpdateTicketRequest, 
  Event, 
  Sale,
  TicketType,
  getTicketTypeText 
} from '../../../../core/models';

@Component({
  selector: 'app-manage-tickets',
  templateUrl: './manage-tickets.component.html'
})
export class ManageTicketsComponent implements OnInit {
  event: Event | null = null;
  tickets: GroupedTicket[] = [];
  sales: Sale[] = [];
  eventId: number = 0;
  
  loading = false;
  error = '';
  success = '';
  
  showCreateForm = false;
  editingTicket: GroupedTicket | null = null;
  ticketForm: FormGroup;
  submitting = false;

  // Enums for template
  TicketType = TicketType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private eventService: EventService,
    private saleService: SaleService
  ) {
    this.ticketForm = this.createTicketForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      if (this.eventId) {
        this.loadEventData();
      }
    });
  }

  private createTicketForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0)]],
      type: [TicketType.REGULAR, [Validators.required]],
      is_vip: [false],
      place: ['', [Validators.required, Validators.maxLength(100)]],
      sale_id: ['', [Validators.required]],
      amount: [1, [Validators.required, Validators.min(1), Validators.max(1000)]]
    });
  }

  private loadEventData(): void {
    this.loading = true;
    this.error = '';

    // Load event details
    this.eventService.getEvent(this.eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.loadSales();
        this.loadTickets();
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
      },
      error: () => {
        this.error = 'Failed to load sales';
      }
    });
  }

  private loadTickets(): void {
    this.ticketService.getGroupedTicketsBySeller(this.eventId).subscribe({
      next: (response) => {
        this.tickets = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load tickets';
        this.loading = false;
      }
    });
  }

  showCreateTicketForm(): void {
    this.showCreateForm = true;
    this.editingTicket = null;
    this.ticketForm.reset({
      type: TicketType.REGULAR,
      is_vip: false,
      amount: 1
    });
    this.error = '';
    this.success = '';
  }

  editTicket(ticket: GroupedTicket): void {
    if (ticket.sold_amount > 0) {
      this.error = 'Cannot edit tickets that have been sold';
      return;
    }

    this.editingTicket = ticket;
    this.showCreateForm = true;
    this.error = '';
    this.success = '';
    
    this.ticketForm.patchValue({
      title: ticket.title,
      description: ticket.description,
      price: ticket.price,
      type: ticket.type,
      is_vip: ticket.is_vip,
      place: ticket.place,
      sale_id: ticket.sale_id
    });

    // Disable amount field for editing
    this.ticketForm.get('amount')?.disable();
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingTicket = null;
    this.ticketForm.reset();
    this.ticketForm.get('amount')?.enable();
    this.error = '';
    this.success = '';
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) return;

    this.submitting = true;
    this.error = '';
    this.success = '';

    const formValue = this.ticketForm.value;

    if (this.editingTicket) {
      // Update existing tickets
      const updateRequest: UpdateTicketRequest = {
        old_ticket: this.editingTicket,
        updates: {
          title: formValue.title,
          description: formValue.description,
          price: formValue.price,
          type: formValue.type,
          is_vip: formValue.is_vip,
          place: formValue.place,
          sale_id: formValue.sale_id
        }
      };

      this.ticketService.updateTickets(this.eventId, updateRequest).subscribe({
        next: () => {
          this.success = 'Tickets updated successfully';
          this.cancelForm();
          this.loadTickets();
          this.submitting = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to update tickets';
          this.submitting = false;
        }
      });
    } else {
      // Create new tickets
      const createRequest: CreateTicketRequest = {
        ...formValue,
        type: +formValue.type,
        sale_id: +formValue.sale_id,
        event_id: this.eventId
      };

      this.ticketService.createTickets(createRequest).subscribe({
        next: () => {
          this.success = `${formValue.amount} tickets created successfully`;
          this.cancelForm();
          this.loadTickets();
          this.submitting = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to create tickets';
          this.submitting = false;
        }
      });
    }
  }

  deleteTickets(ticket: GroupedTicket): void {
    if (ticket.sold_amount > 0) {
      this.error = 'Cannot delete tickets that have been sold';
      return;
    }

    const message = `Are you sure you want to delete ${ticket.available_amount} tickets of "${ticket.title}"? This action cannot be undone.`;
    
    if (confirm(message)) {
      this.ticketService.deleteTickets(this.eventId, ticket).subscribe({
        next: () => {
          this.success = 'Tickets deleted successfully';
          this.loadTickets();
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to delete tickets';
        }
      });
    }
  }

  getTicketTypeText(type: TicketType): string {
    return getTicketTypeText(type);
  }

  getTicketTypeOptions() {
    return [
      { value: TicketType.REGULAR, label: 'Regular' },
      { value: TicketType.VIP, label: 'VIP' },
      { value: TicketType.PREMIUM, label: 'Premium' }
    ];
  }

  formatPrice(price: number): string {
    return this.ticketService.formatPrice(price);
  }

  canEditOrDelete(ticket: GroupedTicket): boolean {
    return ticket.sold_amount === 0;
  }

  getSaleTitle(saleId: number): string {
    const sale = this.sales.find(s => s.id === saleId);
    if (!sale) return `Sale #${saleId}`;
    
    const startDate = new Date(sale.start_date * 1000).toLocaleDateString();
    const endDate = new Date(sale.end_date * 1000).toLocaleDateString();
    return `Sale: ${startDate} - ${endDate}`;
  }
}
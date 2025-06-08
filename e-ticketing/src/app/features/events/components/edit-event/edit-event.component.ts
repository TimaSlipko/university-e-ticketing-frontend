import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { Event, UpdateEventRequest } from '../../../../core/models';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html'
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;
  event: Event | null = null;
  eventId!: number;
  isLoading = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadEvent();
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(5)]],
      data: ['', this.jsonValidator]
    });
  }

  private jsonValidator(control: any) {
    if (!control.value) return null;
    try {
      JSON.parse(control.value);
      return null;
    } catch {
      return { invalidJson: true };
    }
  }

  loadEvent(): void {
    this.loading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.populateForm();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load event';
        this.loading = false;
      }
    });
  }

  private populateForm(): void {
    if (this.event) {
      // Convert timestamp to datetime-local format
      const eventDate = new Date(this.event.date * 1000);
      const dateString = eventDate.toISOString().slice(0, 16);

      this.eventForm.patchValue({
        title: this.event.title,
        description: this.event.description,
        date: dateString,
        address: this.event.address,
        data: this.event.data || ''
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.eventForm.value;
      const updateRequest: UpdateEventRequest = {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).getTime() / 1000,
        address: formData.address,
        data: formData.data || '{}'
      };

      this.eventService.updateEvent(this.eventId, updateRequest).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/seller/events']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to update event';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  goBack(): void {
    this.router.navigate(['/seller/events']);
  }
}
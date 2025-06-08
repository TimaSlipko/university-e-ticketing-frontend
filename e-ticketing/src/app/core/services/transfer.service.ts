import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransferRequest, Transfer, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private readonly API_URL = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  initiateTransfer(transferData: TransferRequest): Observable<ApiResponse<Transfer>> {
    return this.http.post<ApiResponse<Transfer>>(`${this.API_URL}/tickets/transfer`, transferData);
  }

  getActiveTransfers(): Observable<ApiResponse<Transfer[]>> {
    return this.http.get<ApiResponse<Transfer[]>>(`${this.API_URL}/transfers/active`);
  }

  acceptTransfer(transferId: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.API_URL}/transfers/${transferId}/accept`, {});
  }

  rejectTransfer(transferId: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.API_URL}/transfers/${transferId}/reject`, {});
  }

  getTransferHistory(): Observable<ApiResponse<Transfer[]>> {
    return this.http.get<ApiResponse<Transfer[]>>(`${this.API_URL}/transfers/history`);
  }
}
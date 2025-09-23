import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MortgageCalculationRequest } from '../../model/MortgageCalculationRequest';
import { MortgageCalculationResponse } from '../../model/MortgageCalculationResponse';
import { getApiUrl, getDirectUrl, API_CONFIG } from '../config/api.config';
import { CustomHeaders, DEFAULT_HEADERS, AUTH_HEADERS, TRACKING_HEADERS, BUSINESS_HEADERS } from '../config/headers.config';
import { District } from '../../model/District';

@Injectable({
  providedIn: 'root'
})
export class MortgageCalculationService {
  private readonly apiUrl = getApiUrl(API_CONFIG.MORTGAGE_CALCULATOR); // Real backend endpoint
  private readonly districtsUrl = getDirectUrl(API_CONFIG.DISTRICTS_URL); // Direct URL to admin service


  constructor(private http: HttpClient) {}

  /**
   * Get custom headers for mortgage calculation requests
   * @param productCode The product code for business headers
   * @returns HttpHeaders object with custom headers
   */
  private getCustomHeaders(): HttpHeaders {
    const headers: CustomHeaders = {
      ...DEFAULT_HEADERS,
      ...this.getTrackingHeaders()
    };

    return new HttpHeaders(headers);
  }

  /**
   * Get tracking headers with dynamic values
   * @returns Tracking headers with actual values
   */
  private getTrackingHeaders(): CustomHeaders {
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();
    const correlationId = this.generateCorrelationId();

    return {
      'X-Request-ID': requestId,
      'X-Timestamp': timestamp,
      'X-Correlation-ID': correlationId,
      'X-RBRO-Request-Id': requestId,
      'X-B3-TraceId': requestId,
      'X-B3-SpanId': requestId
    };
  }

  /**
   * Get business headers with dynamic values
   * @param productCode The product code
   * @returns Business headers with actual values
   */
  private getBusinessHeaders(productCode?: string): CustomHeaders {
    return {
      'X-Business-Unit': 'mortgage',
      'X-Product-Code': productCode || 'unknown',
      'X-Channel': 'web',
      'X-Language': 'ro-RO'
    };
  }

  /**
   * Get authentication headers
   * @returns Authentication headers with actual values
   */
  private getAuthHeaders(): CustomHeaders {
    const authToken = this.getAuthToken();
    const userId = this.getUserId();
    const sessionId = this.getSessionId();

    return {
      'Authorization': authToken ? `Bearer ${authToken}` : '',
      'X-User-ID': userId || '',
      'X-Session-ID': sessionId || ''
    };
  }

  /**
   * Generate a unique request ID for tracking (UUID format)
   * @returns Unique request ID string in UUID format
   */
  private generateRequestId(): string {
    return this.generateUUID();
  }

  /**
   * Generate a unique correlation ID for request tracking (UUID format)
   * @returns Unique correlation ID string in UUID format
   */
  private generateCorrelationId(): string {
    return this.generateUUID();
  }

  /**
   * Generate a UUID v4 string
   * @returns UUID string in format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Get authentication token (implement based on your auth system)
   * @returns Authentication token or empty string
   */
  private getAuthToken(): string {
    // TODO: Implement authentication token retrieval
    // Example: return localStorage.getItem('authToken') || '';
    return ''; // Placeholder - implement based on your auth system
  }

  /**
   * Get user ID (implement based on your auth system)
   * @returns User ID or empty string
   */
  private getUserId(): string {
    // TODO: Implement user ID retrieval
    // Example: return localStorage.getItem('userId') || '';
    return ''; // Placeholder - implement based on your auth system
  }

  /**
   * Get session ID (implement based on your auth system)
   * @returns Session ID or empty string
   */
  private getSessionId(): string {
    // TODO: Implement session ID retrieval
    // Example: return localStorage.getItem('sessionId') || '';
    return ''; // Placeholder - implement based on your auth system
  }

  /**
   * Calculate mortgage based on the provided request
   * @param request The mortgage calculation request
   * @returns Observable of mortgage calculation response
   */
  calculateMortgage(request: MortgageCalculationRequest): Observable<MortgageCalculationResponse> {
    const headers = this.getCustomHeaders();
    
    console.log('🚀 Making mortgage calculation request with headers:', {
      url: this.apiUrl,
      headers: Object.fromEntries(headers.keys().map(key => [key, headers.get(key)])),
      request: request
    });

    return this.http.post<MortgageCalculationResponse>(this.apiUrl, request, { headers })
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Get districts list for location dropdowns
   * @returns Observable of districts list
   */
  getDistricts(): Observable<District[]> {
    // TEMP: Hardcoded fallback while districts service is down
    // ORIGINAL IMPLEMENTATION (restore when service is available):
    // const headers = this.getCustomHeaders();
    // console.log('🚀 Making districts request with headers:', {
    //   url: this.districtsUrl,
    //   headers: Object.fromEntries(headers.keys().map(key => [key, headers.get(key)]))
    // });
    // return this.http.get<District[]>(this.districtsUrl, { headers })
    //   .pipe(
    //     catchError((error) => this.handleError(error))
    //   );

    const hardcoded: District[] = [
      { city: 'BUCURESTI', county: 'BUCURESTI' },
      { city: 'CLUJ-NAPOCA', county: 'CLUJ' },
      { city: 'TIMISOARA', county: 'TIMIS' },
      { city: 'IASI', county: 'IASI' },
      { city: 'BRASOV', county: 'BRASOV' },
      { city: 'CONSTANTA', county: 'CONSTANTA' },
      { city: 'SIBIU', county: 'SIBIU' },
      { city: 'ORADEA', county: 'BIHOR' },
      { city: 'PLOIESTI', county: 'PRAHOVA' },
      { city: 'GALATI', county: 'GALATI' }
    ];

    return new Observable<District[]>((subscriber) => {
      subscriber.next(hardcoded);
      subscriber.complete();
    });
  }

  /**
   * Handle HTTP errors (SSR-safe)
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'A apărut o eroare necunoscută';

    // Preserve full backend payload for business validation errors (422)
    if (error?.status === 422) {
      return throwError(() => error);
    }

    const isBrowserErrorEvent = typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent;
    if (isBrowserErrorEvent) {
      errorMessage = `Eroare client: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Datele trimise sunt invalide';
          break;
        case 404:
          errorMessage = 'Serviciul de calculare nu a fost găsit';
          break;
        case 500:
          errorMessage = 'Eroare internă a serverului';
          break;
        case 0:
          errorMessage = 'Nu se poate conecta la server. Verificați conexiunea la internet.';
          break;
        default:
          errorMessage = `Eroare server: ${error.status} - ${error.message}`;
      }
    }

    console.error('Mortgage calculation error:', error);
    // Re-emit as HttpErrorResponse with friendly message for non-422 cases
    const friendly = new HttpErrorResponse({
      error: error.error,
      headers: error.headers,
      status: error.status,
      statusText: error.statusText,
      url: error.url || undefined
    });
    Object.defineProperty(friendly, 'message', { value: errorMessage });
    return throwError(() => friendly);
  }
}

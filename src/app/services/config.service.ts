import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface RuntimeConfig {
  production: boolean;
  environmentName: string;
  apiUrl: string;
  districtsUrl: string;
  backendUrl: string;
  adminServiceUrl: string;
  enableLogging: boolean;
  jentisWorkspace: string;
  location: string;
  features?: {
    mortgageCalculation: boolean;
    districtSelection: boolean;
    adminService: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configSubject = new BehaviorSubject<RuntimeConfig | null>(null);
  public config$ = this.configSubject.asObservable();
  
  private defaultConfig: RuntimeConfig = {
    production: false,
    environmentName: 'development',
    apiUrl: '/api',
    districtsUrl: '/districts',
    backendUrl: 'http://localhost:8080',
    adminServiceUrl: 'https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc',
    enableLogging: true,
    jentisWorkspace: 'preview',
    location: 'development'
  };

  constructor(private http: HttpClient) {}

  /**
   * Load configuration from assets/config/env.json
   * Falls back to build-time environment if runtime config is not available
   */
  loadConfig(): Observable<RuntimeConfig> {
    return this.http.get<RuntimeConfig>('/assets/config/env.json')
      .pipe(
        tap(config => {
          console.log('✅ Runtime configuration loaded from env.json:', config);
          this.configSubject.next(config);
        }),
        catchError(error => {
          console.warn('⚠️ Failed to load runtime config, using default:', error);
          console.log('📋 Using default configuration:', this.defaultConfig);
          this.configSubject.next(this.defaultConfig);
          return of(this.defaultConfig);
        })
      );
  }

  /**
   * Get current configuration synchronously
   */
  getConfig(): RuntimeConfig | null {
    return this.configSubject.value;
  }

  /**
   * Get API base URL from current config
   */
  getApiUrl(): string {
    const config = this.getConfig();
    return config?.apiUrl || this.defaultConfig.apiUrl;
  }

  /**
   * Get districts URL from current config  
   */
  getDistrictsUrl(): string {
    const config = this.getConfig();
    return config?.districtsUrl || this.defaultConfig.districtsUrl;
  }

  /**
   * Get backend URL from current config
   */
  getBackendUrl(): string {
    const config = this.getConfig();
    return config?.backendUrl || this.defaultConfig.backendUrl;
  }

  /**
   * Check if logging is enabled
   */
  isLoggingEnabled(): boolean {
    const config = this.getConfig();
    return config?.enableLogging ?? this.defaultConfig.enableLogging;
  }
}

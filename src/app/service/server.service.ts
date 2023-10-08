import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { catchError, subscribeOn, tap } from 'rxjs/operators';
import { CustomerResponse } from '../interface/custome-response';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly apiUrl = 'any';

  constructor(private http: HttpClient) {}

  servers$ = <Observable<CustomerResponse>>(
    this.http
      .get<CustomerResponse>('${this.apiUrl}/server/list')
      .pipe(tap(console.log), catchError(this.handleError))
  );

  save$ = (server: Server) =>
    <Observable<CustomerResponse>>(
      this.http
        .post<CustomerResponse>('${this.apiUrl}/server/save', server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  ping$ = (ipAddress: string) =>
    <Observable<CustomerResponse>>(
      this.http
        .get<CustomerResponse>('${this.apiUrl}/server/ping/${ipAddress}')
        .pipe(tap(console.log), catchError(this.handleError))
    );

  filter$ = (status: Status, response: CustomerResponse) =>
    <Observable<CustomerResponse>>new Observable<CustomerResponse>(
      (Subscriber) => {
        console.log(response);
        Subscriber.next(
          status === Status.ALL
            ? { ...response, message: 'Servers filtered by ${status} status' }
            : {
                ...response,
                message:
                  response.data.servers.filter(
                    (server) => server.status === status
                  ).length > 0
                    ? "Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status"
                    : 'No servers of ${status} found',
                data: {
                  servers: response.data.servers.filter(
                    (server) => server.status === status
                  ),
                },
              }
        );
        Subscriber.complete();
      }
    ).pipe(tap(console.log), catchError(this.handleError));

  delete$ = (serverId: number) =>
    <Observable<CustomerResponse>>(
      this.http
        .delete<CustomerResponse>('${this.apiUrl}/server/delete/${serverId}')
        .pipe(tap(console.log), catchError(this.handleError))
    );

  // getServers(): Observable<CustomerResponse> {
  //   return this.http.get<CustomerResponse>('http://localhost:8080/server/list');
  // }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError('An error occurred - Error code: ${error.status}');
  }
}

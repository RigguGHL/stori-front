import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Newsletter {
  subject?: string | null
  emails?: Array<any | null>
  file?: string | null
  message?: string | null
}

@Injectable({
  providedIn: 'root'
})

export class NewsletterService {

  constructor(private http: HttpClient) { }

  /** POST:  Send data as a FormData*/
  sendNewsletter(data: Newsletter, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('subject', data.subject || '')
    formData.append('message', data.message || '')
    formData.append('emails', JSON.stringify(data.emails))

    const req = new HttpRequest('POST', `${environment.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

}

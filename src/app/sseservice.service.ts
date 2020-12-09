import { Observable } from "rxjs";
import { Injectable, NgZone } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SSEServiceService {constructor(private _zone: NgZone) {}
getServerSentEvent(url: string): Observable<any> {
  return Observable.create(observer => {
    const eventSource = this.getEventSource(url);
    eventSource.onmessage = event => {
   
      this._zone.run(() => {
        observer.next(event);
      });
    };
    eventSource.onerror = error => {
      this._zone.run(() => {
        observer.error(error);
      });
    };
  });
}
private getEventSource(url: string): EventSource {
  return new EventSource(url);
}
}

// wrapped-socket.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WrappedSocket extends Socket {
  constructor() {
    super({
      url: 'http://localhost:3000/notifications',
      options: {
        autoConnect: true
      }
    });
  }
}

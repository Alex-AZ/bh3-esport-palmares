import { Injectable } from '@angular/core';
import { Palmares } from '../models/Palmares';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { User } from 'src/models/User';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class PalmaresService {
  private palmares = [];
  palmaresSubject = new Subject<Palmares[]>();

  private apiUrlPalmares = 'http://127.0.0.1:8000/api/palmares';

  constructor(private httpClient: HttpClient, private usersService: UsersService) { }

  emitPalmares() {
    this.palmaresSubject.next(this.palmares);
  }

  /** POST: add a new palmares to the database */
  addNewPalmares(palmares: any): Observable<any> {
    return new Observable<any>(observer => {
      palmares.date = palmares.date.valueOf().toString();

      this.httpClient.post(
        this.apiUrlPalmares, JSON.stringify(palmares),
        {
          observe: 'body',
          headers: { Authorization: this.usersService.connectedUser.token } 
        }
      ).subscribe((palmares: Palmares) => {
        palmares.date = moment(palmares.date);
        observer.next(palmares);
      },
        (error) => {
          observer.error(error);
        });
    })
  }

  /** PATCH: update a palmares in the database */
  editPalmares(palmares: Palmares): Observable<any> {
    const editedPalmares = { ...palmares};

    if (editedPalmares.date) {
      editedPalmares.date = (editedPalmares.date.valueOf()).toString();
    }

    return this.httpClient.patch(this.apiUrlPalmares + '/' + editedPalmares.id, editedPalmares, {
      observe: 'response',
      headers: { Authorization: this.usersService.connectedUser.token }
    });
  }

  /** GET: retrieves all palmares from the database */
  getPalmares(): Observable<any> {
    return new Observable<any>(observer => {
        this.httpClient.get(this.apiUrlPalmares, { observe: 'body' })
          .subscribe((palmares: Palmares[]) => {
            observer.next(palmares.map(palmares => {
              palmares.date = moment(palmares.date);
                return palmares;
            }));
        }, error => {
            observer.error(error);
        });
    });
  }

  /** DELETE: remove a palmares from the database */
  deletePalmares(palmares: Palmares): Observable<any> {
    return this.httpClient.delete(this.apiUrlPalmares + '/' + palmares.id, {
      observe: 'response' ,
      headers: { Authorization: this.usersService.connectedUser.token }
    });
  }
}

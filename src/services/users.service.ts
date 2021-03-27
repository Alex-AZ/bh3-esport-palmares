import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private apiUrl = 'http://127.0.0.1:8000/api/users';
    private apiUrlForRoles = 'http://127.0.0.1:8000/api/roles';

    connectedUser: User;

    constructor(private httpClient: HttpClient) { }

    getUsers(): Observable<any> {
        return new Observable<any>(observer => {
            this.httpClient.get(this.apiUrl, { observe: 'body' }).subscribe((users: User[]) => {
                observer.next(users.map(user => {
                    user.birthdate = moment(user.birthdate);
                    return user;
                }));
            }, error => {
                observer.error(error);
            });
        });
    }

    getRoles(): Observable<any> {
        return this.httpClient.get(this.apiUrlForRoles, { observe: 'body', responseType: 'json' });
    }

    addNewUserAndSendEmailActivation(username: string, email: string): Observable<any> {
        return this.httpClient.post(this.apiUrl, JSON.stringify({ username, email }), {
            observe: 'body',
            headers: { Authorization: this.connectedUser.token }
        });
    }

    saveUsersPositions(users: User[]): Observable<any> {
        return this.httpClient.patch(this.apiUrl, users, {
            observe: 'response',
            headers: { Authorization: this.connectedUser.token }
        });
    }

    deleteUser(user: User): Observable<any> {
        return this.httpClient.delete(this.apiUrl + '/' + user.id, {
            observe: 'response',
            headers: { Authorization: this.connectedUser.token }
        });
    }

    verifyToken(token: string): Observable<any> {
        return this.httpClient.get(this.apiUrl + '/verify-token/' + token, { observe: 'response' });
    }

    activateUser(user: any, token: string): Observable<any> {
        const editedUser = { ...user };

        if (editedUser.birthdate) {
            editedUser.birthdate = (editedUser.birthdate.valueOf()).toString();
        }

        if (editedUser.pictureFile && editedUser.pictureData) {
            editedUser.pictureExtension = this.getExtensionFromFile(editedUser.pictureFile);
        }

        return new Observable<any>(observer => {
            this.httpClient.patch(this.apiUrl + '/activate/' + token, editedUser, { observe: 'body' }).subscribe((userResponse: User) => {
                userResponse.birthdate = moment(userResponse.birthdate);
                observer.next(userResponse);
            }, error => {
                observer.error(error);
            });
        });
    }

    editUser(user: User): Observable<any> {
        const editedUser = { ...user };

        if (editedUser.birthdate) {
            editedUser.birthdate = (editedUser.birthdate.valueOf()).toString();
        }

        if (editedUser.pictureFile && editedUser.pictureData) {
            editedUser.pictureExtension = this.getExtensionFromFile(editedUser.pictureFile);
        }

        return this.httpClient.patch(this.apiUrl + '/' + editedUser.id, editedUser, {
            observe: 'response',
            headers: { Authorization: this.connectedUser.token }
        });
    }

    logIn(username: string, password: string): Observable<any> {
        return new Observable<any>(observer => {
            this.httpClient.post(this.apiUrl + '/login', { username, password }, { observe: 'body' }).subscribe((user: User) => {
                user.birthdate = moment(user.birthdate);
                observer.next(user);
            }, error => {
                observer.error(error);
            });
        });
    }

    sendResetPasswordRequest(username: string, email: string): void {
        this.httpClient.post(this.apiUrl + '/password-request', { username, email }).subscribe();
    }

    verifyPasswordToken(passwordToken: string): Observable<any> {
        return new Observable<any>(observer => {
            this.httpClient.get(this.apiUrl + '/verify-password-token/' + passwordToken, { observe: 'body' }).subscribe((user: User) => {
                user.birthdate = moment(user.birthdate);
                observer.next(user);
            }, error => {
                observer.error(error);
            });
        });
    }

    editPassword(user: User, password: string): Observable<any> {
        return this.httpClient.patch(
            this.apiUrl + '/edit-password/' + user.id,
            { id: user.id, password },
            { observe: 'response' }
        );
    }

    saveUserToLocalStorage(user: User): void {
        localStorage.setItem('bh3ConnectedUser', JSON.stringify(user));
    }

    getUserFromLocalStorage(): Observable<any> {
        return new Observable<any>(observer => {
            const userFromLocalStorage = JSON.parse(localStorage.getItem('bh3ConnectedUser'));

            if (userFromLocalStorage) {
                this.httpClient.get(
                    `${this.apiUrl}/connected-user/${userFromLocalStorage.id}/${userFromLocalStorage.token}`,
                    { observe: 'body' }
                ).subscribe((user: User) => {
                    user.birthdate = moment(user.birthdate);
                    observer.next(user);
                }, error => {
                    observer.error(error);
                });
            } else {
                observer.next(null);
            }
        });
    }

    getExtensionFromFile(file): string {
        return /.+(\.[a-z]{3,4})$/.exec(file.name)[1];
    }
}

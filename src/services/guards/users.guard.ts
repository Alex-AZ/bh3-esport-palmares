import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';
import { User } from '../../models/User';

@Injectable()
export class UsersGuard implements CanActivate {

    constructor(private usersService: UsersService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.usersService.getUserFromLocalStorage().subscribe((user: User) => {
                let allowAccess = false;

                if (user) {
                    user.roles.forEach(role => {
                        if (role.name === 'Président' || role.name === 'Vice-Président' || role.name === 'Secrétaire' || role.name === 'Head Manager') {
                            allowAccess = true;
                        }
                    });
                }

                observer.next(allowAccess);
                observer.complete();

                if (!allowAccess) {
                    this.router.navigate(['/']);
                }
            });
        });
    }
}

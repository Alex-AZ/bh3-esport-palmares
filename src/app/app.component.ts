import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/User';

@Component({
    selector: 'bh3-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private usersService: UsersService) { }

    ngOnInit(): void {
        this.usersService.getUserFromLocalStorage().subscribe((user: User) => {
            this.usersService.connectedUser = user;
        });
    }
}

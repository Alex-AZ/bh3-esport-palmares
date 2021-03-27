import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'bh3-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            if (
                !localStorage.getItem('bh3LastConnectionTimestamp') ||
                localStorage.getItem('bh3LastConnectionTimestamp') &&
                parseInt(localStorage.getItem('bh3LastConnectionTimestamp'), 10) < (Date.now() - 5000)
            ) {
                this.usersService.logIn(this.loginForm.value.username, this.loginForm.value.password).subscribe(
                    (user: User) => {
                        this.usersService.connectedUser = user;

                        this.usersService.saveUserToLocalStorage(user);

                        this.router.navigate(['backoffice']);
                    }, error => {
                        this.snackBar.open(error.error.detail, 'Fermer');
                    }
                );

                localStorage.setItem('bh3LastConnectionTimestamp', Date.now().toString());
            } else {
                const secondsLeft = 5 - (Math.round((Date.now() - parseInt(localStorage.getItem('bh3LastConnectionTimestamp'), 10)) / 1000));
                this.snackBar.open('Vous ne pouvez effectuer une seule tentative de connexion toutes les 5 secondes. Il reste ' + secondsLeft + ' secondes', 'Fermer');
            }
        }
    }
}

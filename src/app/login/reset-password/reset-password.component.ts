import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'bh3-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    form: FormGroup;

    constructor(
        private usersService: UsersService,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            if (
                !localStorage.getItem('resetPasswordTimestamp') ||
                localStorage.getItem('resetPasswordTimestamp') &&
                parseInt(localStorage.getItem('resetPasswordTimestamp'), 10) < (Date.now() - 60000)
            ) {
                this.usersService.sendResetPasswordRequest(this.form.value.username, this.form.value.email);
                this.snackBar.open('La demande de réinitialisation a bien été envoyée', 'Fermer', { duration: 2000 });
                this.router.navigate(['/']);

                localStorage.setItem('resetPasswordTimestamp', Date.now().toString());
            } else {
                const secondsLeft = 60 - (Math.round((Date.now() - parseInt(localStorage.getItem('resetPasswordTimestamp'), 10)) / 1000));
                this.snackBar.open('Vous ne pouvez envoyer qu\'une demande par minute. Il reste ' + secondsLeft + ' secondes', 'Fermer');
            }
        }
    }

    getEmailErrors(): string {
        if (this.form.controls.email.hasError('required')) {
            return 'Ce champ est obligatoire';
        }

        if (this.form.controls.email.hasError('email')) {
            return 'Cette adresse email n\'est pas valide';
        }
    }
}

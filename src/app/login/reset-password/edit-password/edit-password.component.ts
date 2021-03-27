import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../../../models/User';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'bh3-edit-password',
    templateUrl: './edit-password.component.html'
})
export class EditPasswordComponent implements OnInit {
    allowAccess = false;
    form: FormGroup;
    user: User | undefined;

    constructor(
        private usersService: UsersService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.usersService.verifyPasswordToken(this.route.snapshot.params.passwordToken).subscribe((user: User) => {
            this.user = user;

            this.form = this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
                passwordConfirm: ['', [Validators.required, this.passwordConfirmValidator()]]
            });

            this.form.controls.password.valueChanges.subscribe(password => {
                if (this.form.value.passwordConfirm) {
                    if (this.form.value.passwordConfirm !== password) {
                        this.form.controls.passwordConfirm.setErrors(
                            { ...this.form.controls.passwordConfirm.errors, passwordConfirm: true }
                        );
                    } else {
                        this.form.controls.passwordConfirm.setErrors(null);
                    }
                }
            });

            this.allowAccess = true;
        }, (error) => {
            this.snackBar.open(error.error.detail, 'Fermer', { duration: 2000 });
        });
    }

    private passwordConfirmValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (this.form !== undefined && this.form.value.password !== control.value) {
                return {
                    passwordConfirm: {
                        value: ''
                    }
                };
            } else {
                return null;
            }
        };
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.usersService.editPassword(this.user, this.form.value.password).subscribe(() => {
                this.snackBar.open('Votre mot de passe a bien été modifié', 'Fermer', { duration: 2000 });
                this.usersService.connectedUser = this.user;
                this.router.navigate(['backoffice']);
            }, (error) => {
                this.snackBar.open(error.error.detail, 'Fermer', { duration: 2000 });
            });
        }
    }

    getErrors(formControlName: string): string {
        if (this.form.controls[formControlName].hasError('required')) {
            return 'Ce champ est obligatoire';
        }

        if (this.form.controls[formControlName].hasError('minlength')) {
            return `Vous devez entrer au moins ${this.form.controls[formControlName].getError('minlength').requiredLength} caractères`;
        }

        if (this.form.controls[formControlName].hasError('maxlength')) {
            return `Vous ne pouvez pas entrer plus de ${this.form.controls[formControlName].getError('maxlength').requiredLength} caractères`;
        }

        if (this.form.controls[formControlName].hasError('passwordConfirm')) {
            return 'Vous devez entrer le même mot de passe';
        }
    }
}

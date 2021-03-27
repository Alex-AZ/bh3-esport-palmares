import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/User';

@Component({
    selector: 'bh3-backoffice-activate-user',
    templateUrl: './activate-user.component.html',
    styleUrls: ['./activate-user.component.scss']
})
export class BackofficeActivateUserComponent implements OnInit {
    allowAccess = false;
    userForm: FormGroup;
    user: User | undefined;
    pictureData: string | ArrayBuffer;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.usersService.verifyToken(this.route.snapshot.params[`token`]).subscribe((user: User) => {
            this.user = user;

            this.allowAccess = true;

            this.userForm = this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
                passwordConfirm: ['', [Validators.required, this.passwordConfirmValidator()]],
                firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
                lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
                birthdate: ['', [Validators.required]],
                gamertag: ['', [Validators.minLength(2), Validators.maxLength(50)]],
                psn: ['', [Validators.minLength(2), Validators.maxLength(50)]],
                steam: ['', [Validators.minLength(2), Validators.maxLength(50)]],
                twitter: ['', [Validators.minLength(2), Validators.maxLength(255)]],
                facebook: ['', [Validators.minLength(2), Validators.maxLength(255)]],
                pictureFile: ['']
            });

            this.userForm.controls.password.valueChanges.subscribe(password => {
                if (this.userForm.value.passwordConfirm) {
                    if (this.userForm.value.passwordConfirm !== password) {
                        this.userForm.controls.passwordConfirm.setErrors(
                            { ...this.userForm.controls.passwordConfirm.errors, passwordConfirm: true }
                        );
                    } else {
                        this.userForm.controls.passwordConfirm.setErrors(null);
                    }
                }
            });

            this.userForm.controls.pictureFile.valueChanges.subscribe(pictureFile => {
                if (pictureFile.size > 1000000) {
                    this.userForm.controls.pictureFile.setErrors(
                        { ...this.userForm.controls.pictureFile.errors, maxFileSize: true }
                    );
                } else {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(pictureFile);
                    fileReader.onload = () => {
                        this.user.pictureData = fileReader.result;
                    };
                }

            });
        }, error => {
            this.snackBar.open(error.error.detail, 'Fermer', { duration: 2000 });
            this.router.navigate(['/']);
        });
    }

    private passwordConfirmValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (this.userForm !== undefined && this.userForm.value.password !== control.value) {
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

    onActivateUser(): void {
        if (this.userForm.valid) {
            this.user.firstname = this.userForm.value.firstname;
            this.user.lastname = this.userForm.value.lastname;
            this.user.pictureFile = this.userForm.value.pictureFile;
            this.user.birthdate = this.userForm.value.birthdate;
            this.user.gamertag = this.userForm.value.gamertag;
            this.user.psn = this.userForm.value.psn;
            this.user.steam = this.userForm.value.steam;
            this.user.twitter = this.userForm.value.twitter;
            this.user.facebook = this.userForm.value.facebook;
            this.user.password = this.userForm.value.password;

            this.usersService.activateUser(this.user, this.route.snapshot.params[`token`]).subscribe((user: User) => {
                this.usersService.connectedUser = user;

                this.usersService.saveUserToLocalStorage(user);
            }, error => {
                this.snackBar.open(error.error.detail, 'Fermer');
            });

            this.snackBar.open('Votre compte a bien été activé', 'Fermer', { duration: 2000 });
            this.router.navigate(['backoffice']);
        }
    }

    getErrors(formControlName: string): string {
        if (this.userForm.controls[formControlName].hasError('required')) {
            return 'Ce champ est obligatoire';
        }

        if (this.userForm.controls[formControlName].hasError('minlength')) {
            return `Vous devez entrer au moins ${this.userForm.controls[formControlName].getError('minlength').requiredLength} caractères`;
        }

        if (this.userForm.controls[formControlName].hasError('maxlength')) {
            return `Vous ne pouvez pas entrer plus de ${this.userForm.controls[formControlName].getError('maxlength').requiredLength} caractères`;
        }

        if (this.userForm.controls[formControlName].hasError('passwordConfirm')) {
            return 'Vous devez entrer le même mot de passe';
        }

        if (this.userForm.controls[formControlName].hasError('maxFileSize')) {
            return `L'image ne doit pas dépasser 1Mo'`;
        }
    }
}

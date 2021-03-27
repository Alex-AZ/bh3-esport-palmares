import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/User';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'bh3-backoffice-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class BackofficeUsersComponent implements OnInit, OnDestroy {
    @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;
    addUserForm: FormGroup;
    editUserForm: FormGroup;
    users: User[] = [];
    usersSubscription: Subscription;
    rolesSubscription: Subscription;
    editedUser: User;
    roles: any[];
    usersAutocompleteControl = new FormControl('');
    filteredUsers: Observable<any[]>;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.addUserForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), this.uniqueUsername()]],
            email: ['', [Validators.required, Validators.maxLength(255), Validators.email, this.uniqueEmail()]]
        });

        console.log(1);
        

        this.editUserForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            email: ['', [Validators.required, Validators.maxLength(255), Validators.email]],
            birthdate: ['', Validators.required],
            gamertag: ['', [Validators.minLength(2), Validators.maxLength(255)]],
            psn: ['', [Validators.minLength(2), Validators.maxLength(255)]],
            steam: ['', [Validators.minLength(2), Validators.maxLength(255)]],
            twitter: ['', [Validators.minLength(2), Validators.maxLength(255)]],
            facebook: ['', [Validators.minLength(2), Validators.maxLength(255)]],
            roles: [''],
            pictureFile: [''],
            subscription: ['', Validators.required]
        });

        this.editUserForm.disable();

        this.usersSubscription = this.usersService.getUsers().subscribe((users: User[]) => {
            this.users = users;
        });

        this.rolesSubscription = this.usersService.getRoles().subscribe((roles: any[]) => {
            this.roles = roles;
        });

        this.editUserForm.controls.pictureFile.valueChanges.subscribe(pictureFile => {
            if (pictureFile) {
                if (pictureFile.size > 1000000) {
                    this.editUserForm.controls.pictureFile.setErrors(
                        { ...this.editUserForm.controls.pictureFile.errors, maxFileSize: true }
                    );
                } else {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(pictureFile);
                    fileReader.onload = () => {
                        this.editedUser.pictureData = fileReader.result;
                    };
                }
            }
        });

        this.usersAutocompleteControl.valueChanges.subscribe(username => {
            const user = this.users.find(userElement => userElement.username === username);

            if (user) {
                this.onGoToEditUser(user);
                this.editUserForm.enable();
            } else {
                this.editedUser = undefined;
                this.editUserForm.reset();
                this.editUserForm.disable();
            }
        });

        this.filteredUsers = this.usersAutocompleteControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterUsers(value))
        );
    }

    private uniqueUsername(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (control.value !== null && this.users.map(user => user.username.toLowerCase()).includes(control.value.toLowerCase())) {
                return {
                    uniqueUsername: {
                        value: ''
                    }
                };
            } else {
                return null;
            }
        };
    }

    private uniqueEmail(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (control.value !== null && this.users.map(user => user.email.toLowerCase()).includes(control.value.toLowerCase())) {
                return {
                    uniqueEmail: {
                        value: ''
                    }
                };
            } else {
                return null;
            }
        };
    }

    private _filterUsers(inputValue: string): User[] {
        const filterValue = inputValue.toLowerCase();
        return this.users.filter(userElement => {
            return userElement.username.toLowerCase().includes(filterValue);
        });
    }

    dropUser(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.users, event.previousIndex, event.currentIndex);
    }

    onAddUser(): void {
        if (this.addUserForm.valid) {
            this.usersService.addNewUserAndSendEmailActivation(
                this.addUserForm.value.username,
                this.addUserForm.value.email
            ).subscribe((user: User) => {
                this.users.push(user);

                this.snackBar.open('Nouvel utilisateur ajouté', 'Fermer', { duration: 2000 });

                this.addUserForm.reset();
                this.addUserForm.controls.username.setErrors(null);
                this.addUserForm.controls.email.setErrors(null);
            }, error => {
                this.usersService.getUsers().subscribe(users => {
                    this.users = users;
                });

                this.snackBar.open('Erreur : ' + error.error.detail, 'Fermer', { duration: 2000 });
            });
        }
    }

    onGoToEditUser(user: User): void {
        this.tabGroup.selectedIndex = 1;

        this.editUserForm.reset();
        this.editUserForm.enable();

        this.editUserForm.controls.username.setValue(user.username);
        this.editUserForm.controls.firstname.setValue(user.firstname);
        this.editUserForm.controls.lastname.setValue(user.lastname);
        this.editUserForm.controls.email.setValue(user.email);
        this.editUserForm.controls.birthdate.setValue(user.birthdate);
        this.editUserForm.controls.gamertag.setValue(user.gamertag);
        this.editUserForm.controls.psn.setValue(user.psn);
        this.editUserForm.controls.steam.setValue(user.steam);
        this.editUserForm.controls.twitter.setValue(user.twitter);
        this.editUserForm.controls.facebook.setValue(user.facebook);
        this.editUserForm.controls.subscription.setValue(user.subscription);
        this.editUserForm.controls.roles.setValue(user.roles.map(role => role.id));

        this.editedUser = user;
    }

    onEditUser(): void {
        if (this.editUserForm.valid) {
            this.editedUser.username = this.editUserForm.value.username;
            this.editedUser.firstname = this.editUserForm.value.firstname;
            this.editedUser.lastname = this.editUserForm.value.lastname;
            this.editedUser.email = this.editUserForm.value.email;
            this.editedUser.pictureFile = this.editUserForm.value.pictureFile;
            this.editedUser.birthdate = this.editUserForm.value.birthdate;
            this.editedUser.gamertag = this.editUserForm.value.gamertag;
            this.editedUser.psn = this.editUserForm.value.psn;
            this.editedUser.steam = this.editUserForm.value.steam;
            this.editedUser.twitter = this.editUserForm.value.twitter;
            this.editedUser.facebook = this.editUserForm.value.facebook;
            this.editedUser.subscription = this.editUserForm.value.subscription;

            this.editedUser.roles = this.roles.filter(role => this.editUserForm.value.roles.includes(role.id));

            this.usersService.editUser(this.editedUser).subscribe(() => {
                if (this.editedUser.id === this.usersService.connectedUser.id) {
                    this.usersService.getUserFromLocalStorage().subscribe((user: User) => {
                        this.usersService.connectedUser = user;
                    });
                }
            }, error => {
                this.snackBar.open('Erreur : ' + error.error.detail, 'Fermer', { duration: 2000 });

                this.usersService.getUsers().subscribe((users: User[]) => {
                    this.users = users;
                });
            });

            this.snackBar.open('L\'utilisateur a bien été modifié', 'Fermer', { duration: 2000 });
            this.tabGroup.selectedIndex = 0;
        }
    }

    onSaveUsersPositions(): void {
        this.users.forEach((user, index) => {
            user.position = index + 1;
        });

        this.snackBar.open('Positions sauvegardées', 'Fermer', { duration: 2000 });

        this.usersService.saveUsersPositions(this.users).subscribe(response => null, error => {
            this.usersService.getUsers().subscribe(users => {
                this.users = users;
            });

            this.snackBar.open('Erreur : ' + error.error.detail, 'Fermer', { duration: 2000 });
        });
    }

    onRemoveUser(user: User): void {
        this.users = this.users.filter(userElement => userElement !== user);

        this.usersService.deleteUser(user).subscribe(response => null, error => {
            this.usersService.getUsers().subscribe(users => {
                this.users = users;
            });

            this.snackBar.open('Erreur : ' + error.error.detail, 'Fermer', { duration: 2000 });
        });
    }

    ngOnDestroy(): void {
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }

        if (this.rolesSubscription) {
            this.rolesSubscription.unsubscribe();
        }
    }

    getErrors(formGroup: FormGroup, formControlName: string): string {
        if (formGroup.controls[formControlName].hasError('required')) {
            return 'Ce champ est obligatoire';
        }

        if (formGroup.controls[formControlName].hasError('minlength')) {
            return `Vous devez entrer au moins ${formGroup.controls[formControlName].getError('minlength').requiredLength} caractères`;
        }

        if (formGroup.controls[formControlName].hasError('maxlength')) {
            return `Vous ne pouvez pas entrer plus de ${formGroup.controls[formControlName].getError('maxlength').requiredLength} caractères`;
        }

        if (formGroup.controls[formControlName].hasError('email')) {
            return 'Vous devez entrer une adresse email valide';
        }

        if (formGroup.controls[formControlName].hasError('passwordConfirm')) {
            return 'Vous devez entrer le même mot de passe';
        }

        if (formGroup.controls[formControlName].hasError('maxFileSize')) {
            return 'L\'image ne doit pas dépasser 1Mo';
        }

        if (formGroup.controls[formControlName].hasError('uniqueUsername')) {
            return 'Ce nom d\'utilisateur est déjà pris';
        }

        if (formGroup.controls[formControlName].hasError('uniqueEmail')) {
            return 'Cette adresse email est déjà utilisée';
        }
    }
}

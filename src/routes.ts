import { Routes} from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { ResetPasswordComponent } from './app/login/reset-password/reset-password.component';
import { EditPasswordComponent } from './app/login/reset-password/edit-password/edit-password.component';
import { BackofficeComponent } from './app/backoffice/backoffice.component';
import { BackofficeUsersComponent } from './app/backoffice/users/users.component';
import { BackofficePalmaresComponent } from './app/backoffice/palmares/palmares.component';
import { BackofficeActivateUserComponent } from './app/backoffice/activate-user/activate-user.component';
import { BackofficeGuard } from './services/guards/backoffice.guard';
import { UsersGuard } from './services/guards/users.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'reset-password/:passwordToken', component: EditPasswordComponent },
    { path: 'backoffice', component: BackofficeComponent, canActivate: [BackofficeGuard] },
    { path: 'backoffice/users', component: BackofficeUsersComponent, canActivate: [UsersGuard] },
    { path: 'backoffice/activate-user/:token', component: BackofficeActivateUserComponent },
    { path: 'backoffice/users', component: BackofficeUsersComponent },
    { path: 'backoffice/palmares', component: BackofficePalmaresComponent }
];

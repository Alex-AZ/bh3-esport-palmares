import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { routes } from '../routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { EditPasswordComponent } from './login/reset-password/edit-password/edit-password.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { BackofficeUsersComponent } from './backoffice/users/users.component';
import { BackofficePalmaresComponent } from './backoffice/palmares/palmares.component';
import { BackofficeActivateUserComponent } from './backoffice/activate-user/activate-user.component';
import { BackofficeGuard } from '../services/guards/backoffice.guard';
import { UsersGuard } from '../services/guards/users.guard';

@NgModule({
    declarations: [
        AppComponent,
        BackofficeUsersComponent,
        BackofficePalmaresComponent,
        LoginComponent,
        ResetPasswordComponent,
        EditPasswordComponent,
        BackofficeComponent,
        BackofficeUsersComponent,
        BackofficeActivateUserComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        DragDropModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatNativeDateModule,
        NgxMatFileInputModule
    ],
    providers: [
        BackofficeGuard,
        UsersGuard,
        {
            provide: MAT_DATE_FORMATS, useValue: {
                parse: {
                    dateInput: 'DD/MM/YYYY',
                },
                display: {
                    dateInput: 'DD/MM/YYYY',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'LL',
                    monthYearA11yLabel: 'MMMM YYYY',
                },
            }
        },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {
            provide: MAT_DATE_LOCALE, useValue: 'fr-FR'
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

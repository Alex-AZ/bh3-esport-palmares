import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { Palmares } from '../../../models/Palmares';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PalmaresService } from '../../../services/palmares.service';

interface Country {
  value: string;
  viewValue: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'bh3-backoffice-palmares',
  styleUrls: ['./palmares.component.scss'],
  templateUrl: './palmares.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'fr-FR'
    }
  ]
})
export class BackofficePalmaresComponent implements OnInit {
  addPalmaresForm: FormGroup;
  palmares: any[];
  editedPalmares: Palmares;
  palmaresSubscription: Subscription;

  // Table
  displayedColumns: string[] = ['date', 'event', 'game', 'country', 'ranking', 'update', 'delete', 'visibleOnHomepage'];
  dataSource: MatTableDataSource<Palmares>;

  // Table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private formbuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private palmaresService: PalmaresService
  ) {

  }

  ngOnInit() {
    this.palmaresService.getPalmares().subscribe((palmares: Palmares[]) => {
      this.palmares = palmares;
      this.dataSource = new MatTableDataSource(this.palmares);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.addPalmaresForm = this.formbuilder.group({
      event: this.formbuilder.control('', [Validators.required]),
      game: this.formbuilder.control('', [Validators.required]),
      date: this.formbuilder.control('', [Validators.required]),
      country: this.formbuilder.control('', [Validators.required]),
      ranking: this.formbuilder.control('', [Validators.required])
    })
  }

  onAddPalmares() {    
    if (this.addPalmaresForm.valid) {
      const value = this.addPalmaresForm.value;

      const newPalmares: Palmares = {
        id: value.id,
        game: value.game,
        event: value.event,
        country: value.country,
        ranking: value.ranking,
        date: value.date,
        visibleOnHomepage: false
      }
  
      this.palmaresService.addNewPalmares(newPalmares).subscribe((palmares: Palmares) => {
        this.palmares.unshift(palmares);
        this.dataSource.data = this.palmares;
  
        this.snackBar.open('Nouveau palmarès ajouté', 'Fermer', { duration: 2000 });
  
      }, error => {
        this.palmaresService.getPalmares().subscribe(palmares => {
          this.palmares = palmares;
        });
  
        this.snackBar.open('Erreur :' + error.error.detail, 'Fermer', { duration: 2000 });
      });
  
      this.addPalmaresForm.reset();
    }
  }

  onToggleEditPalmares(palmares: Palmares) {
    if (this.editedPalmares && this.editedPalmares === palmares) {
      this.editedPalmares = undefined;
      this.addPalmaresForm.reset();
    } else {
      this.editedPalmares = palmares;

      this.addPalmaresForm.controls.game.setValue(palmares.game);
      this.addPalmaresForm.controls.event.setValue(palmares.event);
      this.addPalmaresForm.controls.country.setValue(palmares.country);
      this.addPalmaresForm.controls.ranking.setValue(palmares.ranking);
      this.addPalmaresForm.controls.date.setValue(palmares.date);
    }
  }

  onEditPalmares() {
    if (this.addPalmaresForm.valid) {
      this.editedPalmares.game = this.addPalmaresForm.value.game;
      this.editedPalmares.event = this.addPalmaresForm.value.event;
      this.editedPalmares.country = this.addPalmaresForm.value.country;
      this.editedPalmares.ranking = this.addPalmaresForm.value.ranking;
      this.editedPalmares.date = this.addPalmaresForm.value.date;

      this.palmaresService.editPalmares(this.editedPalmares).subscribe();
      this.dataSource.data = this.palmares;

      this.editedPalmares = undefined;
      this.addPalmaresForm.reset();

      this.snackBar.open('Palmarès modifié', 'Fermer', { duration: 2000 });
    }
  }

  onToggleVisibility(palmares: Palmares) {
    palmares.visibleOnHomepage = !palmares.visibleOnHomepage;
    this.palmaresService.editPalmares(palmares).subscribe();
  }

  onDeletePalmares(palmares: Palmares) {
    this.palmares = this.palmares.filter(palmaresElement => palmaresElement !== palmares);
    this.dataSource.data = this.palmares;

    this.palmaresService.deletePalmares(palmares).subscribe();
  }

  getEventErrors(): string {
    if (this.addPalmaresForm.controls.event.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
  }

  getGameErrors(): string {
    if (this.addPalmaresForm.controls.game.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
  }

  getDateErrors(): string {
    if (this.addPalmaresForm.controls.date.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
  }

  getCountryErrors(): string {
    if (this.addPalmaresForm.controls.country.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
  }

  getRankingErrors(): string {
    if (this.addPalmaresForm.controls.ranking.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.palmaresSubscription.unsubscribe();
  }

}
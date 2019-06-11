import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportesPage } from './reportes.page';
import { AuthService } from 'src/app/services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReportesPage
            }
        ])
    ],
    declarations: [ReportesPage],
    providers: [
        AuthService
    ]
})
export class ReportesPageModule { }

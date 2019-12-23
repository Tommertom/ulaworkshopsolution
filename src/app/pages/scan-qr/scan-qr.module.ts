import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScanQrPage } from './scan-qr.page';
import { ConsentPageModule } from '../consent/consent.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ScanQrPage }])
  ],
  declarations: [ScanQrPage]
})
export class ScanQrPageModule { }

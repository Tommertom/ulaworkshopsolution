import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { UlaService } from '../../../service/ula.service';
import { ModalController } from '@ionic/angular';


import { UlaResponse } from 'universal-ledger-agent';
import { ConsentPage } from '../consent/consent.page';

@Component({
  selector: 'app-scan-qr',
  templateUrl: 'scan-qr.page.html',
  styleUrls: ['scan-qr.page.scss']
})
export class ScanQrPage {

  succesMessage = 'No scan performed yet...';

  constructor(private modalCtrl: ModalController, private qrScanner: QRScanner, private ulaService: UlaService) { }

  ionViewWillEnter() {
    //    this.doScan();
  }

  doScan() {

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          // start scanning
          const scanSub = this.qrScanner.scan().subscribe((text: any) => {
            // only the browser platform returns the payload inside the result property
            const payload = text.result ? JSON.parse(text.result) : JSON.parse(text);

            console.log('Scanned:', payload);

            this.ulaService.sendMessage(payload, async (result: UlaResponse) => {

              console.log('statuscode:', result.statusCode);
              console.log('body:', result.body, result);
              // Todo If result.statusCode is 204 or 201, you've received credentials. Show 'succeeded' message
              if (result.statusCode === 201 || result.statusCode === 204) {
                this.succesMessage = 'Succeeded';
              }

              // Todo If statuscode is 200, ask for consent because the app needs to send credentials:
              if (result.statusCode === 200) {

                const modal = await this.modalCtrl.create({
                  component: ConsentPage,
                  componentProps: {
                    payload: result.body
                  }
                });

                modal.onDidDismiss().then(() => {
                  this.doScan();
                });

                modal.present();
              }
            });

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied, guide the user to the settings page
          this.qrScanner.openSettings();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

}

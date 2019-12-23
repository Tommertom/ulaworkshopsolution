import { Component } from '@angular/core';
import { UlaService } from '../../../service/ula.service';

import { UlaResponse } from 'universal-ledger-agent';


@Component({
  selector: 'app-my-creds',
  templateUrl: 'my-credentials.page.html',
  styleUrls: ['my-credentials.page.scss']
})
export class MyCredentialsPage {

  attestations = '';

  constructor(private ulaService: UlaService) {
  }

  ionViewWillEnter() {
    // Send a message to the ULA with the type 'get-attestors'
    // The callback will return you an UlaResponse object. In the 'body' property, you find an array of attestors,
    // each attestor containing one or more attestations
    // (https://github.com/rabobank-blockchain/universal-ledger-agent/blob/master/src/model/attestor.ts)

    // Loop through all attestations and show the key and value in the my-credentials html page
    this.getAttestors();
  }

  getAttestors() {
    const getAttesttorsCallback = (result: UlaResponse) => {
      console.log('statuscode:', result, result.statusCode);
      this.attestations = JSON.stringify(result, null, 2);
    };

    this.ulaService.sendMessage(
      {
        type: 'get-attestors',
        // payload: this.payload.filledTemplate,
        // url: this.payload.url
      },
      getAttesttorsCallback);
  }
}

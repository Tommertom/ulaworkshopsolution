import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { LocalCryptUtils } from 'crypt-util';
import {
  ChallengeRequestSigner,
  VerifiableCredentialSigner,
  VerifiablePresentationSigner
} from 'vp-toolkit';

import {
  VerifiableCredentialGenerator,
  VerifiablePresentationGenerator,
} from 'vp-toolkit';

import { BrowserHttpService } from 'universal-ledger-agent';

import { AddressHelper, VerifiableCredentialHelper } from 'ula-vp-controller';

import { VpController } from 'ula-vp-controller';

import { DataStorage } from 'ula-vc-data-management';

// https://github.com/rabobank-blockchain/universal-ledger-agent/blob/develop/docs/Integration.md

import {
  AddressRepository,
  VcDataManagement,
  VerifiableCredentialRepository,
  VerifiableCredentialTransactionRepository
} from 'ula-vc-data-management';

import { ProcessEthBarcode } from 'ula-process-eth-barcode'

import { EventHandler } from 'universal-ledger-agent';

@Injectable()
export class UlaService {
  private eventHandler: EventHandler; // Change this type to EventHandler after installing all dependencies

  constructor(private storage: Storage) {
    // Some repositories and plugins require a DataStorage, use the constructor param for that.
    const privateMasterKey = 'xprv9s21ZrQH143K2LLQ7KdTM8D8yAD54aGpcLwCt3gniTeKZbyPjvgwtCZeNErqSRWJMQJonB6C2qehSMsvt4JPD3amjZvfg9eNdEksXHhezHM';

    // Todo construct all plugin dependencies here
    const cryptUtil = new LocalCryptUtils();
    cryptUtil.importMasterPrivateKey(privateMasterKey);

    const crSigner = new ChallengeRequestSigner(cryptUtil);
    const vcSigner = new VerifiableCredentialSigner(cryptUtil);
    const vpSigner = new VerifiablePresentationSigner(cryptUtil, vcSigner);

    const vcGenerator = new VerifiableCredentialGenerator(vcSigner);
    const vpGenerator = new VerifiablePresentationGenerator(vpSigner);

    const browserHttpService = new BrowserHttpService();

    const addressHelper = new AddressHelper(cryptUtil);
    const verifiableCredentialHelper = new VerifiableCredentialHelper(vcGenerator, addressHelper);
    // Todo construct all plugins here

    // The accountId can be seen as a 'profile ID',
    // if your app supports multiple profiles.
    const accountId = 0;

    const vpControllerPlugin = new VpController(
      vpGenerator,
      [vpSigner],
      [crSigner],
      browserHttpService,
      verifiableCredentialHelper,
      addressHelper,
      accountId);

    const vcDataRepository = new VerifiableCredentialRepository(storage);
    const addressRepository = new AddressRepository(storage);
    const vcTxRepository = new VerifiableCredentialTransactionRepository(storage);

    const vcDataMgmtPlugin = new VcDataManagement(vcDataRepository, addressRepository, vcTxRepository);

    const processQrCodePlugin = new ProcessEthBarcode(browserHttpService);

    const plugins = [
      vcDataMgmtPlugin,
      vpControllerPlugin,
      processQrCodePlugin
    ];

    // Todo construct the ULA eventhandler with the plugins
    this.eventHandler = new EventHandler(plugins);
  }

  public async sendMessage(message: object, callback: any) {
    // Todo simply call eventHandler.processMsg with the two parameters above, that's it

    this.eventHandler.processMsg(message, callback);
  }
}


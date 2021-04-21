import { Component, OnInit } from '@angular/core';

import { CheckoutService } from './../checkout.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-form-address',
  templateUrl: './form-address.component.html',
  styleUrls: ['./form-address.component.scss']
})
export class FormAddressComponent implements OnInit {

  billingForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder, 
    private checkoutService: CheckoutService,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.billingForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      landline: ['', Validators.required],
      area: ['', Validators.required],
      streetName: ['', Validators.required],
      buildingName: ['', Validators.required],
      floorNumber: [0, Validators.required],
      apartmentNumber: [0, Validators.required],
      nearestLandmark: ['', Validators.required],
      locationType: ['', Validators.required],
      note: ['', Validators.required],
      cityName: ['', Validators.required],
    });
  }

  onSaveAddress() {
    if (this.billingForm.valid) {
      this.checkoutService.createShippingAddress(this.billingForm.value).subscribe(() => { 
        this.billingForm.reset();
        window.location.reload(); 
      })
    }
  }

}

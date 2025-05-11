import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Address } from '../../../interface/address.interface';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent {
  addingAddress = false;
  addressForm: FormGroup;

  // Ejemplo de datos
  addressList: Address[] = [
    {
      id: 1,
      address: "Calle Mayor",
      number: "45",
      id_user: 1,
      delated: false,
      createdAt: "2024-01-15T09:30:00Z"
    },
    {
      id: 2,
      address: "Avenida Libertad",
      number: "123B",
      id_user: 1,
      delated: false,
      createdAt: "2024-02-20T14:15:00Z"
    }
  ];

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      address: ['', [Validators.required]],
      number: ['', [Validators.required]]
    });
  }

  onSubmitAddress() {
    if (this.addressForm.valid) {
      const newAddress: Address = {
        id: this.generateNewId(),
        ...this.addressForm.value,
        id_user: 1, // ID de usuario logueado
        delated: false,
        createdAt: new Date().toISOString()
      };
      
      this.addressList.push(newAddress);
      this.addingAddress = false;
      this.addressForm.reset();
    }
  }

  deleteAddress(addressId: number) {
    this.addressList = this.addressList.filter(addr => addr.id !== addressId);
  }

  private generateNewId(): number {
    return Math.max(...this.addressList.map(a => a.id)) + 1;
  }
}

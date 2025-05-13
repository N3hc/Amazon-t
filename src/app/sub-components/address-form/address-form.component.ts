import { Component, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Address } from '../../../interface/address.interface';
import { UserService } from '../../../services/user/user.service';
import { OnInit } from '@angular/core';
import { Api2Service } from '../../../services/api/api2.service';
import { User } from '../../../interface/user.interface';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent implements OnInit {
  addingAddress = false;
  addressForm: FormGroup;

    @Input() enableSelection: boolean = false;

    selectedAddressId: number | null = null;

    onAddressSelect(addressId: number) {
      if (this.enableSelection) {
        this.selectedAddressId = this.selectedAddressId === addressId ? null : addressId;
      }
    }

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

  constructor(private fb: FormBuilder, private userService: UserService, private api2service: Api2Service) {
    this.addressForm = this.fb.group({
      address: ['', [Validators.required]],
      number: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.userService.getUser().subscribe((user: User | null) => {
      if (!user) {
        console.warn('No user is currently loaded');
        return;
      }

      this.api2service.getDireccionesByUser(user.id).subscribe((addresses: Address[]) => {
        this.addressList = addresses;
        console.log('User addresses:', this.addressList);
      });
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
    this.api2service.updateAddress({id:addressId, deleted: 1}).subscribe((response) => {
      console.log('Address deleted:', addressId);
      this.addressList = this.addressList.filter(address => address.id !== addressId);
    });
  }

  private generateNewId(): number {
    return Math.max(...this.addressList.map(a => a.id)) + 1;
  }
}

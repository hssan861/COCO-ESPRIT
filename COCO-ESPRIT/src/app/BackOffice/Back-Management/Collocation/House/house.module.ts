import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseRoutingModule } from './house-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddHouseComponent } from './add-house/add-house.component';
import { ListHouseComponent } from './list-house/list-house.component';
import { UpdateHouseComponent } from './update-house/update-house.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UpdateHComponent } from 'src/app/FrontOffice/Front-Management/Collocation/house/update-h/update-h.component';


@NgModule({
  declarations: [   AddHouseComponent,
    ListHouseComponent,
    UpdateHComponent
    
    ],
  imports: [
    CommonModule,
    HouseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ]
})
export class HouseModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PollutionList } from './components/pollution-list/pollution-list';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionDetail } from './components/pollution-detail/pollution-detail';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PollutionList },
  { path: 'new', component: PollutionForm },
  { path: 'edit/:id', component: PollutionForm },
  { path: 'detail/:id', component: PollutionDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollutionsRoutingModule { }

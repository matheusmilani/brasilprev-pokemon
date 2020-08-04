import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component'
import { PokemonCardListComponent } from './pokemon-card-list/pokemon-card-list.component'

const routes: Routes = [
  {path: 'card/:id', component: PokemonCardComponent},
  {path: 'cards', component: PokemonCardListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
